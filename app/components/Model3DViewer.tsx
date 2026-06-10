"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

// ---------------------------------------------------------------------------
// Reusable interactive 3D model viewer.
//
//   calloutStyle "mediaCard": hover a part → it glows hot pink → a connector
//     line snaps out → an image bezel "glitches on" in a docked card. (Wordmark.)
//
//   calloutStyle "panel": hover a part → it glows hot pink + a line pops out with
//     the callout word (e.g. "DIRECTION"). Click → a description panel opens below
//     the canvas, like the F-35 piece. No glitch. (Astronaut.)
//
//   Parts are identified either left-to-right by position (mode "letters", for the
//   wordmark whose two A's share a name) or by node name (mode "named").
// ---------------------------------------------------------------------------

export type Media =
  | { kind: "images"; srcs: string[] }
  | { kind: "video"; src: string; poster?: string };

export type CalloutDef = {
  key: string;
  match: string | number; // node-name (named mode) OR left-to-right index (letters mode)
  label: string;
  media?: Media; // mediaCard style
  description?: string; // panel style
  split?: boolean; // panel: anchor the word per-side (L/R) on a two-sided mesh (e.g. gloves)
};

export type ModelConfig = {
  modelPath: string;
  mode: "letters" | "named";
  calloutStyle?: "mediaCard" | "panel"; // default "mediaCard"
  callouts: CalloutDef[];
  fitFactor?: number;
  targetYFactor?: number;
  swayAmp?: number;
  cardSide?: "top" | "right"; // mediaCard only
  aspect?: string;
  // Material / lighting fixes (e.g. for a glTF exported with wrong metalness or
  // a stray BLEND alpha mode):
  forceOpaque?: boolean; // override alphaMode BLEND → opaque (fixes see-through)
  metalness?: number; // override every material's metalness (0 = non-metal/plastic)
  roughness?: number; // override every material's roughness
  exposure?: number; // tone-mapping exposure (default 1.15)
  envIntensity?: number; // environment reflection strength (default 1)
  // Decorative model locked under the main one (e.g. the wordmark under the
  // astronaut's feet) — loaded into the same scene so it rotates together.
  // Visual only, not interactive.
  decorModelPath?: string;
  decorScale?: number; // decor width ÷ main-model width (default 0.9)
  decorGapFactor?: number; // gap below the feet, as a fraction of main height (default 0.04)
};

const ACCENT = "#FF2D7E";
const IDLE_MS = 3500;

function dampTo(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function normalizeName(s: string): string {
  return s.toLowerCase().replace(/[_\s\-—–.:/[\]]+/g, "");
}

// Hot-pink highlight that fades in on hover. Driven by the material's STANDARD
// `emissive` uniform (three uploads it per-material as emissive*emissiveIntensity,
// with none of the custom-uniform / shared-program pitfalls): emissiveIntensity
// 0→1 is the hover amount. The WHOLE part tints pink with a brighter glowing rim
// on the silhouette edge, so it clearly reads even on the small white parts.
function makeHighlightMaterial(base: THREE.Material): THREE.MeshStandardMaterial {
  const m = base.clone() as THREE.MeshStandardMaterial;
  // Per-material hover uniform (0→1), linked into THIS material's own program.
  // A unique program cache key guarantees each clone compiles its own program, so
  // the uniform never cross-links with another material (the old shared-program
  // pitfall). The ramp updates m.userData.uHover.value each frame.
  const uHover = { value: 0 };
  m.userData.uHover = uHover;
  m.customProgramCacheKey = () => "sm-rim-" + m.uuid;
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uHover = uHover;
    shader.fragmentShader =
      "uniform float uHover;\n" +
      shader.fragmentShader.replace(
        "#include <opaque_fragment>",
        `#include <opaque_fragment>
        {
          float hover = clamp(uHover, 0.0, 1.0);
          vec3 nrm = normalize(normal);
          float fres = pow(1.0 - clamp(dot(nrm, normalize(vViewPosition)), 0.0, 1.0), 1.8);
          vec3 rimCol = vec3(1.0, 0.18, 0.49);
          // Tint the whole part pink so it clearly reads as highlighted, then add a
          // brighter glowing rim on the silhouette edge.
          float tint = hover * clamp(0.34 + 0.85 * fres, 0.0, 0.95);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, rimCol, tint);
          gl_FragColor.rgb += rimCol * hover * (0.25 + 1.1 * fres);
        }`,
      );
  };
  m.needsUpdate = true;
  return m;
}

// Corrects materials that came out of the glTF exporter wrong (e.g. a stray
// BLEND alpha mode making the model see-through, or metalness=1 on a matte suit).
function applyMaterialFix(mat: THREE.Material, config: ModelConfig) {
  const m = mat as THREE.MeshStandardMaterial;
  if (config.forceOpaque && m.transparent) {
    m.transparent = false;
    m.depthWrite = true;
    m.alphaTest = 0;
  }
  if (config.metalness !== undefined && "metalness" in m) m.metalness = config.metalness;
  if (config.roughness !== undefined && "roughness" in m) m.roughness = config.roughness;
  m.needsUpdate = true;
}

type PartEntry = {
  key: string;
  label: string;
  mats: THREE.MeshStandardMaterial[];
  anchor: THREE.Vector3; // single fixed tag spot (and the mediaCard connector anchor)
  center: THREE.Vector3; // part center (for left/right side detection)
  anchorL?: THREE.Vector3; // split parts: fixed tag spot on the left half
  anchorR?: THREE.Vector3; // split parts: fixed tag spot on the right half
};

// For a two-sided part (e.g. both gloves in one mesh) find a fixed point on the
// left half and the right half, by averaging sampled vertices split at splitX.
function sideAnchors(
  group: { mesh: THREE.Mesh }[],
  splitX: number,
): [THREE.Vector3 | undefined, THREE.Vector3 | undefined] {
  const lSum = new THREE.Vector3();
  const rSum = new THREE.Vector3();
  let lN = 0;
  let rN = 0;
  const v = new THREE.Vector3();
  for (const { mesh } of group) {
    const pos = mesh.geometry?.attributes?.position as
      | THREE.BufferAttribute
      | undefined;
    if (!pos) continue;
    mesh.updateMatrixWorld(true);
    const stride = Math.max(1, Math.floor(pos.count / 4000)); // sample ~4k verts
    for (let i = 0; i < pos.count; i += stride) {
      v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      if (v.x < splitX) {
        lSum.add(v);
        lN++;
      } else {
        rSum.add(v);
        rN++;
      }
    }
  }
  return [
    lN ? lSum.divideScalar(lN) : undefined,
    rN ? rSum.divideScalar(rN) : undefined,
  ];
}

function useParts(scene: THREE.Object3D, config: ModelConfig) {
  return useMemo(() => {
    scene.updateMatrixWorld(true);

    const preBox = new THREE.Box3().setFromObject(scene);
    const preCenter = new THREE.Vector3();
    preBox.getCenter(preCenter);
    scene.position.sub(preCenter);
    scene.updateMatrixWorld(true);

    const meshes: { mesh: THREE.Mesh; box: THREE.Box3; cx: number }[] = [];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || !m.geometry) return;
      const box = new THREE.Box3().setFromObject(m);
      meshes.push({ mesh: m, box, cx: (box.min.x + box.max.x) / 2 });
    });

    // Correct wrong material settings (transparency / metalness) before cloning.
    if (
      config.forceOpaque ||
      config.metalness !== undefined ||
      config.roughness !== undefined
    ) {
      for (const { mesh } of meshes) {
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach((mm) => applyMaterialFix(mm, config));
        else if (mat) applyMaterialFix(mat, config);
      }
    }

    const grouped = new Map<string, { mesh: THREE.Mesh; box: THREE.Box3 }[]>();
    if (config.mode === "letters") {
      meshes.sort((a, b) => a.cx - b.cx);
      const byIndex = new Map<number, CalloutDef>();
      for (const c of config.callouts)
        if (typeof c.match === "number") byIndex.set(c.match, c);
      meshes.forEach((entry, i) => {
        const c = byIndex.get(i);
        if (!c) return;
        if (!grouped.has(c.key)) grouped.set(c.key, []);
        grouped.get(c.key)!.push(entry);
      });
    } else {
      const named = config.callouts.filter((c) => typeof c.match === "string");
      for (const entry of meshes) {
        let node: THREE.Object3D | null = entry.mesh;
        let matched: CalloutDef | undefined;
        while (node && !matched) {
          const nn = normalizeName(node.name || "");
          matched = named.find((c) => normalizeName(String(c.match)) === nn);
          node = node.parent;
        }
        if (!matched) continue;
        if (!grouped.has(matched.key)) grouped.set(matched.key, []);
        grouped.get(matched.key)!.push(entry);
      }
    }

    const parts: PartEntry[] = [];
    const meshToKey = new Map<string, string>();
    for (const c of config.callouts) {
      const group = grouped.get(c.key);
      if (!group || group.length === 0) {
        console.warn("[Model3DViewer] no mesh for callout:", c.key, c.match);
        continue;
      }
      const mats: THREE.MeshStandardMaterial[] = [];
      const partBox = new THREE.Box3();
      for (const { mesh, box } of group) {
        const existing = (
          Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
        ) as THREE.MeshStandardMaterial;
        // Idempotent: if this mesh already carries a highlight material (React
        // Strict Mode runs this twice in dev), REUSE it. Re-cloning would leave
        // the rendered material different from the one the ramp updates, so the
        // hover pink would never show.
        const material = existing.userData?.uHover
          ? existing
          : makeHighlightMaterial(existing);
        mesh.material = material;
        mats.push(material);
        partBox.union(box);
        meshToKey.set(mesh.uuid, c.key);
      }
      const center = new THREE.Vector3();
      partBox.getCenter(center);
      const anchor = center.clone();
      if (config.mode === "letters") anchor.y = partBox.max.y;
      let anchorL: THREE.Vector3 | undefined;
      let anchorR: THREE.Vector3 | undefined;
      if (c.split) [anchorL, anchorR] = sideAnchors(group, center.x);
      parts.push({
        key: c.key,
        label: c.label,
        mats,
        anchor,
        center,
        anchorL,
        anchorR,
      });
    }

    const partByKey = new Map(parts.map((p) => [p.key, p]));
    console.log("[Model3DViewer] parts:", parts.map((p) => p.key).join(", "));
    return { parts, meshToKey, partByKey };
  }, [scene, config]);
}

function EnvironmentSetup({ intensity = 1 }: { intensity?: number }) {
  const { scene, gl } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;
    scene.environmentIntensity = intensity;
    return () => {
      envMap.dispose();
      pmrem.dispose();
      scene.environment = null;
      scene.environmentIntensity = 1;
    };
  }, [scene, gl, intensity]);
  return null;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: `2px solid ${ACCENT}`,
            borderTopColor: "transparent",
            animation: "sm-spin 0.8s linear infinite",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: ACCENT,
            textAlign: "center",
            whiteSpace: "nowrap",
            paddingLeft: 2, // balances the trailing letter-spacing so it's truly centered
          }}
        >
          Loading {progress.toFixed(0)}%
        </span>
        <style>{`@keyframes sm-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

function CalloutMedia({ media }: { media: Media }) {
  if (media.kind === "video") {
    return (
      <video className="sm-media" src={media.src} poster={media.poster} muted loop playsInline autoPlay />
    );
  }
  const srcs = media.srcs;
  if (srcs.length <= 1) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="sm-media" src={srcs[0]} alt="" />;
  }
  return (
    <div className="sm-stills">
      {srcs.slice(0, 3).map((s, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} className="sm-still" src={s} alt="" />
      ))}
    </div>
  );
}

// (mediaCard) projects the active part's anchor and points the line at the card.
function Connector({
  anchor,
  lineRef,
  cardRef,
  cardSide,
}: {
  anchor: THREE.Vector3;
  lineRef: React.RefObject<SVGLineElement | null>;
  cardRef: React.RefObject<HTMLDivElement | null>;
  cardSide: "top" | "right";
}) {
  const { camera, gl } = useThree();
  useFrame(() => {
    const line = lineRef.current;
    if (!line) return;
    const rect = gl.domElement.getBoundingClientRect();
    const v = anchor.clone().project(camera);
    const x1 = (v.x * 0.5 + 0.5) * rect.width;
    const y1 = (-v.y * 0.5 + 0.5) * rect.height;
    let x2 = rect.width / 2;
    let y2 = 40;
    const card = cardRef.current;
    if (card) {
      const cr = card.getBoundingClientRect();
      if (cardSide === "right") {
        x2 = cr.left - rect.left;
        y2 = cr.top - rect.top + cr.height / 2;
      } else {
        x2 = cr.left - rect.left + cr.width / 2;
        y2 = cr.bottom - rect.top;
      }
    }
    line.setAttribute("x1", String(x1));
    line.setAttribute("y1", String(y1));
    line.setAttribute("x2", String(x2));
    line.setAttribute("y2", String(y2));
  });
  return null;
}

// A non-interactive model seated under the main one (the SPACEMAN wordmark under
// the astronaut's feet). It lives in the same scene, so the camera orbit turns it
// together with the astronaut. Materials are copied clean so it never reacts to the
// separate interactive wordmark viewer's hover state.
function DecorModel({
  path,
  feetY,
  width,
  scale,
  gap,
}: {
  path: string;
  feetY: number;
  width: number;
  scale: number;
  gap: number;
}) {
  const { scene } = useGLTF(path);
  const { size: viewport } = useThree();
  // On a tall/portrait phone frame the full-width wordmark would overflow the
  // sides, so cap it to roughly the astronaut's width. Wide frames keep the
  // configured size.
  const portrait = viewport.height > viewport.width;
  const effScale = portrait ? Math.min(scale, 0.95) : scale;
  const obj = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      const mat = mesh.material;
      if (mesh.isMesh && mat && !Array.isArray(mat)) {
        const fresh = new THREE.MeshStandardMaterial();
        fresh.copy(mat as THREE.MeshStandardMaterial);
        mesh.material = fresh;
      }
    });
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
    root.position.sub(center); // center the wordmark at the group origin
    const group = new THREE.Group();
    group.add(root);
    const s = size.x > 0 ? (width * effScale) / size.x : 1;
    group.scale.setScalar(s);
    group.position.set(0, feetY - gap - (size.y * s) / 2, 0);
    return group;
  }, [scene, feetY, width, effScale, gap]);
  return <primitive object={obj} />;
}

function ModelScene({
  config,
  hotKeys,
  activeKey,
  onHover,
  onPick,
  controlsRef,
  reducedMotion,
  isInteracting,
  holdStill,
  lineRef,
  cardRef,
}: {
  config: ModelConfig;
  hotKeys: Set<string>;
  activeKey: string | null;
  onHover: (k: string | null) => void;
  onPick: (k: string) => void;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  reducedMotion: boolean;
  isInteracting: boolean;
  holdStill: boolean; // pause the auto-sway (a callout is open)
  lineRef: React.RefObject<SVGLineElement | null>;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { scene } = useGLTF(config.modelPath);
  const { camera, size } = useThree();
  const { parts, meshToKey, partByKey } = useParts(scene, config);
  const style = config.calloutStyle ?? "mediaCard";
  // Recentered bounds of the main model — used to seat the decor model under it.
  const mainBox = useMemo(() => new THREE.Box3().setFromObject(scene), [scene]);
  // (panel style) the FIXED model point the word tag is pinned to. It never follows
  // the cursor; for a two-sided part the cursor's side only selects the left or right
  // fixed spot. hoverKeyRef = the part(+side) currently shown, so the tag only moves
  // when you cross to a different part or side.
  const [hoverPoint, setHoverPoint] = useState<THREE.Vector3 | null>(null);
  const hoverKeyRef = useRef<string | null>(null);

  // Frame the model to whichever axis is tighter. A wide (desktop 16:9) frame is
  // limited by the vertical FOV → identical framing to before. A tall/portrait
  // phone frame becomes limited by the (narrower) horizontal FOV → the model fills
  // the width and stands tall instead of being shrunk to fit a wide layout.
  const fitAspect = Math.round((size.width / Math.max(1, size.height)) * 100) / 100;
  const { defaultCamPos, defaultTarget } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    const vFov = (38 * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(0.0001, fitAspect));
    const fitFov = Math.min(vFov, hFov);
    const fitDistance = sphere.radius / Math.sin(fitFov / 2);
    const distance = fitDistance * (config.fitFactor ?? 0.66);
    // On a portrait (phone) frame the lockup sits high with empty space below it,
    // so nudge the whole lockup (astronaut + wordmark) down ~6% to balance it.
    // Desktop (landscape) keeps the original framing untouched.
    const portrait = fitAspect < 1;
    const targetYFactor = (config.targetYFactor ?? 0.32) + (portrait ? 0.17 : 0);
    const target = sphere.center
      .clone()
      .add(new THREE.Vector3(0, sphere.radius * targetYFactor, 0));
    const pos = target.clone().add(new THREE.Vector3(0, 0, distance));
    return { defaultCamPos: pos, defaultTarget: target };
  }, [scene, config.fitFactor, config.targetYFactor, fitAspect]);

  useEffect(() => {
    camera.position.copy(defaultCamPos);
    const c = controlsRef.current;
    if (c) {
      c.target.copy(defaultTarget);
      const d = defaultCamPos.distanceTo(defaultTarget);
      c.minDistance = d * 0.25; // allow zooming in much closer (esp. on phones)
      c.maxDistance = d * 2.6;
      c.update();
    }
  }, [camera, controlsRef, defaultCamPos, defaultTarget]);

  const lookup = (obj: THREE.Object3D | null): string | null => {
    let n = obj;
    while (n) {
      const hit = meshToKey.get(n.uuid);
      if (hit !== undefined) return hit;
      n = n.parent;
    }
    return null;
  };

  const handleMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const k = lookup(e.object);
    document.body.style.cursor = k ? "pointer" : "auto";
    if (style === "panel") {
      // Anchor the word to a FIXED spot on the part (never follow the cursor). A
      // two-sided part gets a fixed spot per side; the cursor's x only decides
      // which side, not where the word lands.
      if (!k) {
        if (hoverKeyRef.current !== null) {
          setHoverPoint(null);
          hoverKeyRef.current = null;
        }
      } else {
        const part = partByKey.get(k);
        let anchor = part?.anchor;
        let sideTag = k;
        if (part?.anchorL && part.anchorR) {
          const left = e.point.x < part.center.x;
          anchor = left ? part.anchorL : part.anchorR;
          sideTag = left ? k + ":L" : k + ":R";
        }
        if (anchor && sideTag !== hoverKeyRef.current) {
          setHoverPoint(anchor.clone());
          hoverKeyRef.current = sideTag;
        }
      }
    }
    onHover(k);
  };
  const handleOut = () => {
    document.body.style.cursor = "auto";
    if (style === "panel") {
      setHoverPoint(null);
      hoverKeyRef.current = null;
    }
    onHover(null);
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const k = lookup(e.object);
    if (k) onPick(k);
  };

  const swayAmp = config.swayAmp ?? 0.5;
  useFrame((state, delta) => {
    for (const p of parts) {
      const target = hotKeys.has(p.key) ? 1.0 : 0.0;
      for (const m of p.mats) {
        const u = m.userData.uHover as { value: number } | undefined;
        if (u) u.value = dampTo(u.value, target, 12, delta);
      }
    }
    const c = controlsRef.current;
    if (c) {
      c.autoRotate = false;
      // Gentle automatic left↔right sway. Runs during hover too — pauses only when
      // a callout is open (holdStill) or the user is dragging/zooming (isInteracting).
      if (!reducedMotion && !holdStill && !isInteracting && swayAmp > 0) {
        const targetAz = Math.sin(state.clock.elapsedTime * 0.3) * swayAmp;
        c.setAzimuthalAngle(dampTo(c.getAzimuthalAngle(), targetAz, 2.2, delta));
      }
      c.update();
    }
  });

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  const activePart = activeKey ? partByKey.get(activeKey) : null;

  return (
    <>
      <group
        onPointerMove={handleMove}
        onPointerOut={handleOut}
        onClick={handleClick}
      >
        <primitive object={scene} />

        {style === "mediaCard" && activePart && (
          <Connector
            anchor={activePart.anchor}
            lineRef={lineRef}
            cardRef={cardRef}
            cardSide={config.cardSide ?? "top"}
          />
        )}

        {style === "panel" && hoverPoint && activePart && (
          <Html
            position={[hoverPoint.x, hoverPoint.y, hoverPoint.z]}
            zIndexRange={[3000, 2000]}
            style={{ pointerEvents: "none" }}
          >
            <div className="sm-tag" key={activePart.key}>
              <span className="sm-tag-dot" />
              <span className="sm-tag-line" />
              <span className="sm-tag-word">{activePart.label}</span>
            </div>
          </Html>
        )}
      </group>

      {config.decorModelPath && (
        <DecorModel
          path={config.decorModelPath}
          feetY={mainBox.min.y}
          width={mainBox.max.x - mainBox.min.x}
          scale={config.decorScale ?? 0.9}
          gap={(mainBox.max.y - mainBox.min.y) * (config.decorGapFactor ?? 0.04)}
        />
      )}
    </>
  );
}

export default function Model3DViewer({ config }: { config: ModelConfig }) {
  const style = config.calloutStyle ?? "mediaCard";
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [lastInteract, setLastInteract] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const calloutByKey = useMemo(
    () => new Map(config.callouts.map((c) => [c.key, c])),
    [config.callouts],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (lastInteract === 0) {
      setIsInteracting(false);
      return;
    }
    setIsInteracting(true);
    const t = setTimeout(() => setIsInteracting(false), IDLE_MS);
    return () => clearTimeout(t);
  }, [lastInteract]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
        setHovered(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleUserInteract = () => setLastInteract(Date.now());

  // mediaCard: hover opens the card (sticky). panel: hover only previews; click opens panel.
  const onHover = (k: string | null) => {
    if (style === "mediaCard") {
      if (k) setSelected(k);
    } else {
      setHovered(k);
    }
  };
  const onPick = (k: string) => setSelected(k);
  const dismiss = () => {
    setSelected(null);
    setHovered(null);
  };

  const hotKeys = useMemo(() => {
    const s = new Set<string>();
    if (style === "mediaCard") {
      if (selected) s.add(selected);
    } else {
      if (hovered) s.add(hovered);
      if (selected) s.add(selected);
    }
    return s;
  }, [style, hovered, selected]);

  const activeKey = style === "mediaCard" ? selected : hovered ?? selected;
  const cardSide = config.cardSide ?? "top";
  const cardCallout = style === "mediaCard" && selected ? calloutByKey.get(selected) : null;
  const panelCallout = style === "panel" && selected ? calloutByKey.get(selected) : null;

  return (
    <>
      <div
        className="sm-wrap"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: config.aspect ?? "16 / 9",
          background:
            "radial-gradient(ellipse at 50% 42%, #1f0c29 0%, #0c0610 48%, #050308 100%)",
          border: "1px solid #211826",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Canvas
          camera={{ position: [0, 0.5, 10], fov: 38, near: 0.05, far: 5000 }}
          gl={{ antialias: true, alpha: true }}
          onPointerMissed={dismiss}
          onPointerDown={handleUserInteract}
          onWheel={handleUserInteract}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = config.exposure ?? 1.15;
          }}
        >
          <EnvironmentSetup intensity={config.envIntensity ?? 1} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 6, 6]} intensity={2.2} color="#FFFFFF" />
          <directionalLight position={[-6, 2, -3]} intensity={1.0} color="#8FA8FF" />
          <pointLight position={[-4, -2, 3]} intensity={0.6} color="#FF2D7E" />
          <pointLight position={[5, -1, 2]} intensity={0.5} color="#9B30FF" />

          <Suspense fallback={<Loader />}>
            <ModelScene
              config={config}
              hotKeys={hotKeys}
              activeKey={activeKey}
              onHover={onHover}
              onPick={onPick}
              controlsRef={controlsRef}
              reducedMotion={reducedMotion}
              isInteracting={isInteracting}
              holdStill={selected !== null}
              lineRef={lineRef}
              cardRef={cardRef}
            />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom
            enableDamping
            dampingFactor={0.08}
            makeDefault
          />
        </Canvas>

        {cardCallout && cardCallout.media && (
          <div className="sm-overlay" key={selected}>
            <svg className="sm-connector" preserveAspectRatio="none">
              <line ref={lineRef} className="sm-connector-line" pathLength={1} x1="0" y1="0" x2="0" y2="0" />
            </svg>
            <div
              className={`sm-card-fixed sm-card-${cardSide}`}
              ref={cardRef}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button type="button" className="sm-card-close" aria-label="Close callout" onClick={(e) => { e.stopPropagation(); dismiss(); }}>
                ✕
              </button>
              <div className="sm-card-eyebrow">{cardCallout.label}</div>
              <div className="sm-bezel">
                <CalloutMedia media={cardCallout.media} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* panel style: description slides open below the canvas, like the F-35 */}
      {style === "panel" && (
        <div className={`sm-panel-wrap ${panelCallout ? "is-open" : ""}`} aria-hidden={!panelCallout}>
          <div className="sm-panel" role="dialog" aria-label={panelCallout?.label ?? ""}>
            <button type="button" className="sm-panel-close" aria-label="Close panel" onClick={dismiss}>
              ✕
            </button>
            {panelCallout && (
              <>
                {panelCallout.media && (
                  <div className="sm-panel-media">
                    <CalloutMedia media={panelCallout.media} />
                  </div>
                )}
                <div className="sm-panel-text">
                  <div className="sm-panel-eyebrow">What Spaceman does</div>
                  <h3 className="sm-panel-heading">{panelCallout.label}</h3>
                  <p className="sm-panel-body">{panelCallout.description}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ViewerStyles />
    </>
  );
}

function ViewerStyles(): ReactNode {
  return (
    <style jsx global>{`
      /* ---- on-model word tag (panel style) ---- */
      .sm-tag {
        display: flex;
        align-items: center;
        transform: translateY(-50%);
        white-space: nowrap;
        pointer-events: none;
        font-family: var(--font-jetbrains), monospace;
        animation: sm-tag-in 0.18s ease-out both;
      }
      @keyframes sm-tag-in {
        from {
          opacity: 0;
          transform: translateY(-50%) translateX(-6px);
        }
        to {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }
      }
      .sm-tag-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${ACCENT};
        box-shadow: 0 0 10px 1px rgba(255, 45, 126, 0.85);
        flex-shrink: 0;
      }
      .sm-tag-line {
        width: 30px;
        height: 1px;
        background: linear-gradient(90deg, ${ACCENT}, rgba(255, 45, 126, 0.6));
        transform-origin: left;
        animation: sm-tag-line 0.18s ease-out both;
      }
      @keyframes sm-tag-line {
        from {
          transform: scaleX(0);
        }
        to {
          transform: scaleX(1);
        }
      }
      .sm-tag-word {
        margin-left: 7px;
        padding: 4px 9px;
        font-size: 11px;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        color: #fff;
        background: rgba(10, 6, 12, 0.82);
        border: 1px solid rgba(255, 45, 126, 0.45);
        border-radius: 6px;
        backdrop-filter: blur(2px);
      }

      /* ---- description panel below the canvas (panel style) ---- */
      .sm-panel-wrap {
        display: grid;
        grid-template-rows: 0fr;
        opacity: 0;
        transition: grid-template-rows 0.4s cubic-bezier(0.22, 1, 0.36, 1),
          opacity 0.3s ease, margin-top 0.4s ease;
        margin-top: 0;
      }
      .sm-panel-wrap.is-open {
        grid-template-rows: 1fr;
        opacity: 1;
        margin-top: 16px;
      }
      .sm-panel {
        position: relative;
        overflow: hidden;
        display: flex;
        gap: clamp(18px, 3vw, 30px);
        align-items: flex-start; /* lock text to the top — only the image/box height flexes */
        background: rgba(13, 10, 14, 0.94);
        border: 1px solid rgba(255, 45, 126, 0.5);
        border-radius: 12px;
        padding: clamp(20px, 3.5vw, 34px);
      }
      .sm-panel-media {
        flex-shrink: 0;
        width: clamp(130px, 20vw, 200px);
        align-self: flex-start;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: #000;
      }
      /* show each photo at its NATIVE aspect ratio — never crop it */
      .sm-panel-media .sm-media {
        height: auto;
        object-fit: contain;
      }
      .sm-panel-text {
        flex: 1;
        min-width: 0;
      }
      @media (max-width: 640px) {
        /* Vertical frame on phones so the astronaut reads large (overrides the
           inline 16/9 default). */
        .sm-wrap {
          aspect-ratio: 3 / 4 !important;
        }
        .sm-panel {
          flex-direction: column;
          align-items: stretch;
        }
        .sm-panel-media {
          width: 100%;
        }
      }
      .sm-panel-close {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: transparent;
        border: 1px solid rgba(255, 45, 126, 0.6);
        color: ${ACCENT};
        font-size: 13px;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .sm-panel-close:hover {
        background: rgba(255, 45, 126, 0.14);
      }
      .sm-panel-eyebrow {
        font-family: var(--font-jetbrains), monospace;
        font-size: 10px;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: ${ACCENT};
        margin-bottom: 12px;
      }
      .sm-panel-heading {
        font-family: var(--font-archivo), sans-serif;
        font-size: clamp(24px, 2.8vw, 34px);
        font-weight: 800;
        letter-spacing: -0.01em;
        color: #f0ede6;
        line-height: 1.08;
        margin: 0 0 14px;
      }
      .sm-panel-body {
        font-family: var(--font-dm-sans), sans-serif;
        font-size: 15px;
        line-height: 1.7;
        color: #c2bdb1;
        margin: 0;
        max-width: 60ch;
      }

      /* ---- docked media card (mediaCard style) ---- */
      .sm-overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 5;
      }
      .sm-connector {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        pointer-events: none;
      }
      .sm-connector-line {
        stroke: ${ACCENT};
        stroke-width: 1.5;
        stroke-dasharray: 1;
        stroke-dashoffset: 1;
        filter: drop-shadow(0 0 3px rgba(255, 45, 126, 0.85));
        animation: sm-draw 0.16s ease-out forwards;
      }
      @keyframes sm-draw {
        to {
          stroke-dashoffset: 0;
        }
      }
      .sm-card-fixed {
        pointer-events: auto;
        position: absolute;
        width: 264px;
        max-width: 72%;
        padding: 12px;
        background: rgba(12, 9, 14, 0.92);
        border: 1px solid rgba(255, 45, 126, 0.55);
        border-radius: 14px;
        box-shadow: 0 16px 44px rgba(0, 0, 0, 0.6),
          inset 0 0 0 1px rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(6px);
        opacity: 0;
        animation: sm-glitch-in 0.42s linear 0.16s forwards;
      }
      .sm-card-top {
        top: 22px;
        left: 0;
        right: 0;
        margin: 0 auto;
      }
      .sm-card-right {
        top: 22px;
        right: 22px;
      }
      @keyframes sm-glitch-in {
        0% { opacity: 0; clip-path: inset(50% 0 50% 0); transform: translateX(-8px); filter: brightness(2.4) saturate(0.4); }
        12% { opacity: 1; clip-path: inset(42% 0 38% 0); transform: translateX(8px); }
        24% { opacity: 0.25; clip-path: inset(18% 0 66% 0); transform: translateX(-6px); }
        38% { opacity: 1; clip-path: inset(62% 0 6% 0); transform: translateX(5px); filter: brightness(1.5) hue-rotate(25deg); }
        52% { opacity: 0.55; clip-path: inset(6% 0 58% 0); transform: translateX(-3px); }
        68% { opacity: 1; clip-path: inset(28% 0 22% 0); transform: translateX(2px); filter: brightness(1.15); }
        84% { opacity: 0.9; clip-path: inset(0 0 26% 0); transform: translateX(-1px); }
        100% { opacity: 1; clip-path: inset(0 0 0 0); transform: translateX(0); filter: none; }
      }
      .sm-card-close {
        position: absolute;
        top: 7px;
        right: 7px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 7px;
        background: rgba(0, 0, 0, 0.45);
        border: 1px solid rgba(255, 255, 255, 0.18);
        color: #fff;
        font-size: 11px;
        line-height: 1;
        cursor: pointer;
        z-index: 2;
      }
      .sm-card-close:hover {
        background: rgba(255, 45, 126, 0.28);
        border-color: ${ACCENT};
      }
      .sm-card-eyebrow {
        font-family: var(--font-jetbrains), monospace;
        font-size: 9px;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: ${ACCENT};
        margin: 0 2px 8px;
      }
      .sm-bezel {
        position: relative;
        border-radius: 9px;
        overflow: hidden;
        background: #000;
        border: 1px solid rgba(255, 255, 255, 0.08);
        aspect-ratio: 16 / 9;
      }
      .sm-bezel::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.1) 0 1px, transparent 1px 3px);
        opacity: 0;
        animation: sm-scan 0.55s ease-out 0.16s forwards;
      }
      @keyframes sm-scan {
        0% { opacity: 0.85; }
        60% { opacity: 0.45; }
        100% { opacity: 0; }
      }
      .sm-media {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .sm-stills {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 3px;
        height: 100%;
      }
      .sm-still {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      @media (max-width: 600px) {
        .sm-card-fixed {
          width: 200px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .sm-card-fixed,
        .sm-bezel::after,
        .sm-tag,
        .sm-tag-line {
          animation: none !important;
          opacity: 1 !important;
          clip-path: none !important;
          transform: none !important;
        }
        .sm-tag {
          transform: translateY(-50%) !important;
        }
        .sm-connector-line {
          animation: none !important;
          stroke-dashoffset: 0 !important;
        }
      }
    `}</style>
  );
}
