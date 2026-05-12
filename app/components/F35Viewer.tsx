"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const MODEL_PATH = "/models/f35_v3.glb";

type CalloutKey =
  | "cockpit"
  | "nose"
  | "wingLeft"
  | "wingRight"
  | "fuselage"
  | "engineLeft";

type Callout = {
  key: CalloutKey;
  // Prefix that the named GLB node starts with — resilient to em-dash /
  // suffix variations in C4D-exported names.
  nodePrefix: string;
  // Short label shown on the model
  label: string;
  // Panel heading shown after clicking
  heading: string;
  description: string;
};

const CALLOUTS: Callout[] = [
  {
    key: "cockpit",
    nodePrefix: "Cockpit",
    label: "Cockpit",
    heading: "Director of Photography / Visual Storyteller",
    description:
      "Every frame starts with a decision. I direct the eye, shape the emotion, and control the pace — whether behind a camera on location or building the sequence in post. 15 years of broadcast storytelling at Warner Bros. and CBS Paramount.",
  },
  {
    key: "nose",
    nodePrefix: "Nose",
    label: "Nose",
    heading: "Editorial Judgment",
    description:
      "Editorial instincts built through thousands of deliverables on deadline. I know when to cut, when to hold, and how to use pacing to strengthen message and emotional impact.",
  },
  {
    key: "wingLeft",
    nodePrefix: "Wing_Left",
    label: "Wing Left",
    heading: "Video Editing",
    description:
      "Expert-level video editing across broadcast, social, and marketing. From nightly late-night delivery to major studio theatrical campaigns, I cut content that performs.",
  },
  {
    key: "wingRight",
    nodePrefix: "Wing_Right",
    label: "Wing Right",
    heading: "Motion Graphics",
    description:
      "15 years of advanced motion graphics for major broadcast networks and entertainment studios. After Effects, Cinema 4D, Redshift, Trapcode — the full pipeline.",
  },
  {
    key: "fuselage",
    nodePrefix: "Fuselage",
    label: "Fuselage",
    heading: "Production Pipeline",
    description:
      "Full production lifecycle experience from pre-production and scripting through camera, post, motion graphics, sound integration, and final delivery.",
  },
  {
    key: "engineLeft",
    nodePrefix: "Engine_Left",
    label: "Engine Left",
    heading: "Cinema 4D / 3D Animation",
    description:
      "Advanced Cinema 4D and Redshift for 3D modeling, rendering, and animation across broadcast and marketing productions.",
  },
];

// Forgiving lookup: case-insensitive contains, ignoring underscores, em-dashes,
// and other punctuation. We log all candidates plus the chosen one so any
// remaining mismatch is easy to diagnose.
function normalizeNameForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/[_\s\-—–.:/[\]]+/g, "");
}

function findNodeByPrefix(scene: THREE.Object3D, prefix: string): THREE.Object3D | null {
  const target = normalizeNameForMatch(prefix);
  let found: THREE.Object3D | null = null;
  scene.traverse((node) => {
    if (found) return;
    const name = node.name ?? "";
    if (!name) return;
    if (normalizeNameForMatch(name).startsWith(target)) {
      found = node;
    }
  });
  return found;
}

const GOLD = "#C5A455";

// Idle threshold before auto-rotate resumes (ms)
const IDLE_MS = 3000;

// ---------- F-35 Afterburner ----------
// Custom shader: white-yellow core fading to orange to deep blue at the tail,
// with bright shock diamonds along the length and a high-frequency flicker.
const AFTERBURNER_VERT = /* glsl */ `
  varying float vY;
  varying float vRadialT;
  uniform float uLength;
  uniform float uRadius;
  void main() {
    vY = position.y;
    vRadialT = length(position.xz) / uRadius;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const AFTERBURNER_FRAG = /* glsl */ `
  varying float vY;
  varying float vRadialT;
  uniform float uLength;
  uniform float uTime;

  // Realistic jet exhaust: hottest at the nozzle (white-blue core),
  // cooling outward through yellow, orange, and dissipating into a deep
  // red glow before fading to nothing. No "cold blue" at the tail — that's
  // what made it look like a rainbow.
  vec3 plumeGradient(float t) {
    if (t < 0.08)  return mix(vec3(0.85, 0.95, 1.0), vec3(1.0, 1.0, 0.95), t / 0.08);   // hot blue-white → white
    if (t < 0.28)  return mix(vec3(1.0, 1.0, 0.95), vec3(1.0, 0.85, 0.30), (t - 0.08) / 0.20); // white → yellow
    if (t < 0.60)  return mix(vec3(1.0, 0.85, 0.30), vec3(1.0, 0.45, 0.08), (t - 0.28) / 0.32); // yellow → orange
    return            mix(vec3(1.0, 0.45, 0.08), vec3(0.55, 0.10, 0.02), (t - 0.60) / 0.40);   // orange → deep red
  }

  void main() {
    // Normalize along the cone: 0 at the nozzle, 1 at the tail.
    float t = clamp((vY + uLength * 0.5) / uLength, 0.0, 1.0);

    vec3 color = plumeGradient(t);

    // Shock diamonds — bright white-cyan bands, only in the hot inner stretch
    // where the gas is still supersonic. Outside that range, they vanish.
    float bands = pow(0.5 + 0.5 * sin(t * 24.0 + uTime * 0.6), 6.0);
    float diamondMix = bands * (1.0 - smoothstep(0.0, 0.42, t)) * 0.55;
    color = mix(color, vec3(0.85, 0.95, 1.0), diamondMix);

    // Radial alpha — strong center, very soft edge
    float radial = 1.0 - vRadialT;
    radial = smoothstep(0.0, 0.85, radial);

    // Longitudinal alpha — bright near the nozzle, fading off completely
    // before the tail so there's no hard end.
    float longitudinal = pow(1.0 - t, 1.6);

    // Subtle flicker — softened so it reads as "alive," not strobing
    float flicker = 0.88 + 0.12 * sin(uTime * 32.0 + vY * 8.0 + vRadialT * 10.0);

    float alpha = radial * longitudinal * flicker;

    // Slight extra brightness boost at the nozzle for a hot-core look
    color *= 0.95 + 0.5 * pow(1.0 - t, 3.0);

    gl_FragColor = vec4(color, alpha);
  }
`;

function Afterburner({
  position,
  exhaustDir,
  sphereRadius,
}: {
  position: THREE.Vector3;
  exhaustDir: THREE.Vector3;
  sphereRadius: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // Scale the flame to the model size — looks consistent regardless of GLB scale
  const length = sphereRadius * 0.55;
  const radius = sphereRadius * 0.075;

  // Orient the cone so +Y aligns with the exhaust direction. ConeGeometry has
  // its apex at +Y, so the tip naturally points "out the back."
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), exhaustDir.clone().normalize());
    return q;
  }, [exhaustDir]);

  // Place the cone's base at the engine position, tip extending out the back
  const localOffset = useMemo(
    () => new THREE.Vector3(0, length * 0.5, 0),
    [length],
  );

  // Animate the shader uniforms + a subtle scale pulse
  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (groupRef.current) {
      const pulse =
        1 +
        Math.sin(state.clock.elapsedTime * 14) * 0.025 +
        Math.sin(state.clock.elapsedTime * 23) * 0.015;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position.toArray()} quaternion={quaternion}>
      <group ref={groupRef}>
        <mesh
          position={localOffset.toArray()}
          frustumCulled={false}
          renderOrder={2}
          raycast={() => null}
        >
          <coneGeometry args={[radius, length, 32, 24, true]} />
          <shaderMaterial
            ref={matRef}
            args={[
              {
                vertexShader: AFTERBURNER_VERT,
                fragmentShader: AFTERBURNER_FRAG,
                uniforms: {
                  uTime: { value: 0 },
                  uLength: { value: length },
                  uRadius: { value: radius },
                },
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
              },
            ]}
          />
        </mesh>
        {/* Small bright core puck right at the nozzle — reads as the hot
            burn point and helps anchor the effect visually */}
        <mesh
          position={[0, radius * 0.4, 0]}
          frustumCulled={false}
          renderOrder={2}
          raycast={() => null}
        >
          <sphereGeometry args={[radius * 0.7, 24, 24]} />
          <meshBasicMaterial
            color="#FFF4D6"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

// Generates an offline HDR environment from a procedural room and applies
// it to scene.environment so PBR metals/glass actually catch reflections.
function EnvironmentSetup() {
  const { scene, gl } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;
    return () => {
      envMap.dispose();
      pmrem.dispose();
      scene.environment = null;
    };
  }, [scene, gl]);
  return null;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: `2px solid ${GOLD}`,
            borderTopColor: "transparent",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: GOLD,
          }}
        >
          Loading {progress.toFixed(0)}%
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

// Stores original material props so we can restore on un-focus
type MatBackup = Map<
  THREE.MeshStandardMaterial,
  { emissive: THREE.Color; emissiveIntensity: number }
>;

function F35Model({
  focusedKey,
  onPickCallout,
  controlsRef,
  isInteracting,
  onUserInteract,
}: {
  focusedKey: CalloutKey | null;
  onPickCallout: (key: CalloutKey) => void;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  isInteracting: boolean;
  onUserInteract: () => void;
}) {
  const { scene } = useGLTF(MODEL_PATH);
  const modelRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const matBackup = useRef<MatBackup>(new Map());

  // Auto-fit: compute bounding sphere, set camera distance + return-to-default
  // dynamically based on model size. Also log all named nodes so we can debug
  // missing callouts.
  const { defaultCamPos, defaultTarget, partPositions, sphereRadius, modelCenter, engineAnchor } = useMemo(() => {
    // Log every named node in the GLB so missing callouts are easy to debug
    const allNames: string[] = [];
    scene.traverse((node) => {
      if (node.name) allNames.push(`${node.name}  (${node.type})`);
    });
    console.log(
      `[F35Viewer] Loaded GLB. ${allNames.length} named nodes:\n` +
        allNames.join("\n"),
    );

    // Force matrices up-to-date before any bounding box math
    scene.updateMatrixWorld(true);

    // Bounding sphere of the whole model — drives camera distance
    const box = new THREE.Box3().setFromObject(scene);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);

    // Load in TIGHT — roughly 4× larger on screen than a strict fit.
    // Zoom-in is allowed for detail; zoom-out gives a full overview.
    const fovRad = (38 * Math.PI) / 180;
    const fitDistance = sphere.radius / Math.sin(fovRad / 2);
    const distance = fitDistance * 0.25;

    const defaultTarget = sphere.center.clone();
    const defaultCamPos = sphere.center
      .clone()
      .add(new THREE.Vector3(0, sphere.radius * 0.35, distance));

    // Robust per-part anchor: bounding-box center of all meshes under
    // the named node. Falls back to node's own world position for empty
    // groups so we never get NaN positions.
    const out: Partial<Record<CalloutKey, THREE.Vector3>> = {};
    for (const c of CALLOUTS) {
      const node = findNodeByPrefix(scene, c.nodePrefix);
      if (!node) {
        console.warn(
          `[F35Viewer] Named part not found in GLB: prefix "${c.nodePrefix}"`,
        );
        continue;
      }

      const partBox = new THREE.Box3();
      let hasGeometry = false;
      node.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh && mesh.geometry) {
          mesh.geometry.computeBoundingBox();
          if (mesh.geometry.boundingBox) {
            const childBox = mesh.geometry.boundingBox
              .clone()
              .applyMatrix4(mesh.matrixWorld);
            partBox.union(childBox);
            hasGeometry = true;
          }
        }
      });

      const anchor = new THREE.Vector3();
      if (hasGeometry && !partBox.isEmpty()) {
        partBox.getCenter(anchor);
      } else {
        node.getWorldPosition(anchor);
      }
      out[c.key] = anchor;
      console.log(
        `[F35Viewer] Anchor for "${c.label}":`,
        anchor.toArray().map((n) => n.toFixed(2)).join(", "),
        hasGeometry ? "(from geometry)" : "(from node origin, empty group)",
      );
    }
    return {
      defaultCamPos,
      defaultTarget,
      partPositions: out,
      sphereRadius: sphere.radius,
      modelCenter: sphere.center.clone(),
      engineAnchor: out.engineLeft ?? null,
    };
  }, [scene]);

  // Initial camera + target setup once we know the model size
  useEffect(() => {
    camera.position.copy(defaultCamPos);
    const controls = controlsRef.current;
    if (controls) {
      controls.target.copy(defaultTarget);
      // Zoom-in for detail; zoom-out generously so the whole jet still fits
      // when the user pulls back.
      const dist = defaultCamPos.distanceTo(defaultTarget);
      controls.minDistance = dist * 0.6;
      controls.maxDistance = dist * 7.0;
      controls.update();
    }
  }, [camera, controlsRef, defaultCamPos, defaultTarget]);


  // Apply / restore emissive gold glow on focus changes
  useEffect(() => {
    const callout = CALLOUTS.find((c) => c.key === focusedKey);
    if (!callout) return;
    const node = findNodeByPrefix(scene, callout.nodePrefix);
    if (!node) return;

    const goldColor = new THREE.Color(GOLD);
    const localBackup: MatBackup = new Map();

    node.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat || !("emissive" in mat)) return;
      localBackup.set(mat, {
        emissive: mat.emissive.clone(),
        emissiveIntensity: mat.emissiveIntensity ?? 1,
      });
      mat.emissive.copy(goldColor);
      mat.emissiveIntensity = 0.55;
    });

    matBackup.current = localBackup;

    return () => {
      localBackup.forEach((orig, mat) => {
        mat.emissive.copy(orig.emissive);
        mat.emissiveIntensity = orig.emissiveIntensity;
      });
    };
  }, [focusedKey, scene]);

  // Camera is fully owned by OrbitControls. We only toggle auto-rotate
  // (off while a panel is open or while the user is interacting).
  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.autoRotate = !focusedKey && !isInteracting;
    controls.update();
  });

  return (
    <group ref={modelRef} onPointerDown={onUserInteract}>
      <primitive object={scene} />

      {/* Afterburner plume — emitted from the engine, blasted out the back */}
      {engineAnchor && (
        <Afterburner
          position={engineAnchor}
          exhaustDir={engineAnchor.clone().sub(modelCenter)}
          sphereRadius={sphereRadius}
        />
      )}

      {/* Hide all callouts while a panel is open — keeps them from overlapping
          the info text and from cluttering the focused-on view. */}
      {!focusedKey && CALLOUTS.map((c) => {
        const pos = partPositions[c.key];
        if (!pos) return null;
        const isActive = focusedKey === c.key;
        return (
          <Html
            key={c.key}
            position={pos.toArray()}
            center
            style={{ pointerEvents: "auto" }}
            zIndexRange={[1000, 100]}
          >
            <CalloutButton
              label={c.label}
              active={isActive}
              onClick={(e) => {
                e.stopPropagation();
                onPickCallout(c.key);
              }}
            />
          </Html>
        );
      })}
    </group>
  );
}

function CalloutButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`f35-callout ${active ? "f35-callout--active" : ""}`}
      aria-label={`Focus on ${label}`}
      type="button"
    >
      <span className="f35-callout-dot" />
      <span className="f35-callout-line" />
      <span className="f35-callout-text">{label}</span>
    </button>
  );
}

useGLTF.preload(MODEL_PATH);

export default function F35Viewer() {
  const [focusedKey, setFocusedKey] = useState<CalloutKey | null>(null);
  const [lastInteract, setLastInteract] = useState<number>(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const focusedCallout = useMemo(
    () => CALLOUTS.find((c) => c.key === focusedKey) ?? null,
    [focusedKey],
  );

  // Track idle state — resume auto-rotate after IDLE_MS of no interaction
  useEffect(() => {
    if (lastInteract === 0) {
      setIsInteracting(false);
      return;
    }
    setIsInteracting(true);
    const t = setTimeout(() => setIsInteracting(false), IDLE_MS);
    return () => clearTimeout(t);
  }, [lastInteract]);

  // Escape closes panel
  useEffect(() => {
    if (!focusedKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocusedKey(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusedKey]);

  const handleUserInteract = () => setLastInteract(Date.now());

  return (
    <div
      className="f35-wrap"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        background: "#0D0C0A",
        border: "1px solid #2A251F",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 1, 12], fov: 38, near: 0.05, far: 5000 }}
        gl={{ antialias: true, alpha: true }}
        onPointerDown={handleUserInteract}
        onWheel={handleUserInteract}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.4;
        }}
      >
        {/* Procedural HDR environment — gives PBR materials real reflections */}
        <EnvironmentSetup />

        {/* Lighting — ambient fill + warm key + cool rim + gold underglow */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 6, 4]} intensity={2.4} color="#FFE9CC" />
        <directionalLight position={[-5, 3, -4]} intensity={1.4} color="#9DB6D8" />
        <directionalLight position={[0, 6, -6]} intensity={1.0} color="#FFFFFF" />
        <pointLight position={[0, -4, 2]} intensity={0.4} color={GOLD} />

        <Suspense fallback={<Loader />}>
          <F35Model
            focusedKey={focusedKey}
            onPickCallout={(k) => setFocusedKey(k)}
            controlsRef={controlsRef}
            isInteracting={isInteracting}
            onUserInteract={handleUserInteract}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          autoRotate={true}
          autoRotateSpeed={0.6}
          enableDamping
          dampingFactor={0.08}
          makeDefault
        />
      </Canvas>

      {/* Slide-in info panel */}
      <div
        className={`f35-panel ${focusedCallout ? "f35-panel--open" : ""}`}
        role="dialog"
        aria-hidden={!focusedCallout}
        aria-label={focusedCallout?.heading ?? ""}
      >
        <button
          type="button"
          className="f35-panel-close"
          aria-label="Close info panel"
          onClick={() => setFocusedKey(null)}
        >
          ✕
        </button>
        {focusedCallout && (
          <>
            <div className="f35-panel-eyebrow">
              {focusedCallout.label}
            </div>
            <h3 className="f35-panel-heading">{focusedCallout.heading}</h3>
            <p className="f35-panel-body">{focusedCallout.description}</p>
          </>
        )}
      </div>

      <style jsx global>{`
        /* Callout marker on the model */
        .f35-callout {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0;
          padding: 0;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: var(--font-dm-sans), sans-serif;
          color: #f0ede6;
          white-space: nowrap;
          transform: translate(0, 0);
          pointer-events: auto;
          transition: transform 0.25s ease;
        }
        .f35-callout:hover {
          transform: translate(0, -1px);
        }
        .f35-callout-dot {
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: ${GOLD};
          box-shadow: 0 0 0 0 rgba(197, 164, 85, 0.55);
          transition: box-shadow 0.3s ease, transform 0.25s ease;
          flex-shrink: 0;
        }
        .f35-callout:hover .f35-callout-dot,
        .f35-callout--active .f35-callout-dot {
          animation: f35-pulse 1.4s ease-in-out infinite;
        }
        @keyframes f35-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(197, 164, 85, 0.55);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(197, 164, 85, 0);
            transform: scale(1.18);
          }
        }
        .f35-callout-line {
          display: inline-block;
          width: 22px;
          height: 1px;
          background: ${GOLD};
          opacity: 0.7;
          margin: 0 6px;
        }
        .f35-callout-text {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.5px;
          color: #f0ede6;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.9);
        }
        .f35-callout--active .f35-callout-text {
          color: ${GOLD};
        }

        /* Slide-in info panel */
        .f35-panel {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(420px, 88%);
          background: rgba(13, 12, 10, 0.94);
          backdrop-filter: blur(10px);
          border-left: 1px solid ${GOLD};
          padding: clamp(36px, 5vw, 56px) clamp(24px, 4vw, 40px);
          color: #f0ede6;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 20;
          overflow-y: auto;
          box-shadow: -12px 0 36px rgba(0, 0, 0, 0.55);
        }
        .f35-panel--open {
          transform: translateX(0);
        }
        .f35-panel-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          background: transparent;
          color: ${GOLD};
          border: 1px solid ${GOLD};
          border-radius: 2px;
          font-size: 14px;
          cursor: pointer;
          font-family: var(--font-jetbrains), monospace;
          transition: background 0.2s ease;
        }
        .f35-panel-close:hover {
          background: rgba(197, 164, 85, 0.12);
        }
        .f35-panel-eyebrow {
          font-family: var(--font-jetbrains), monospace;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: ${GOLD};
          margin-bottom: 12px;
        }
        .f35-panel-heading {
          font-family: var(--font-playfair), serif;
          font-size: clamp(22px, 2.4vw, 28px);
          font-weight: 700;
          color: #f0ede6;
          line-height: 1.2;
          margin: 0 0 18px;
        }
        .f35-panel-body {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: #c2bdb1;
          margin: 0;
        }
        @media (max-width: 600px) {
          .f35-callout-text {
            font-size: 10px;
          }
          .f35-callout-line {
            width: 14px;
            margin: 0 4px;
          }
        }
      `}</style>
    </div>
  );
}
