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
  partName: string;
  heading: string;
  description: string;
};

const CALLOUTS: Callout[] = [
  {
    key: "cockpit",
    partName: "Cockpit",
    heading: "Director of Photography / Visual Storyteller",
    description:
      "Every frame starts with a decision. I direct the eye, shape the emotion, and control the pace — whether behind a camera on location or building the sequence in post. 15 years of broadcast storytelling at Warner Bros. and CBS Paramount.",
  },
  {
    key: "nose",
    partName: "Nose",
    heading: "Editorial Judgment",
    description:
      "Editorial instincts built through thousands of deliverables on deadline. I know when to cut, when to hold, and how to use pacing to strengthen message and emotional impact.",
  },
  {
    key: "wingLeft",
    partName: "Wing_Left",
    heading: "Video Editing",
    description:
      "Expert-level video editing across broadcast, social, and marketing. From nightly late-night delivery to major studio theatrical campaigns, I cut content that performs.",
  },
  {
    key: "wingRight",
    partName: "Wing_Right",
    heading: "Motion Graphics",
    description:
      "15 years of advanced motion graphics for major broadcast networks and entertainment studios. After Effects, Cinema 4D, Redshift, Trapcode — the full pipeline.",
  },
  {
    key: "fuselage",
    partName: "Fuselage",
    heading: "Production Pipeline",
    description:
      "Full production lifecycle experience from pre-production and scripting through camera, post, motion graphics, sound integration, and final delivery.",
  },
  {
    key: "engineLeft",
    partName: "Engine_Left",
    heading: "Cinema 4D / 3D Animation",
    description:
      "Advanced Cinema 4D and Redshift for 3D modeling, rendering, and animation across broadcast and marketing productions.",
  },
];

const GOLD = "#C5A455";

// Default camera state
const DEFAULT_CAM = new THREE.Vector3(0, 1.2, 5.5);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

// Idle threshold before auto-rotate resumes (ms)
const IDLE_MS = 3000;

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

  // Compute local position of each named part once the scene is loaded
  const partPositions = useMemo(() => {
    const out: Partial<Record<CalloutKey, THREE.Vector3>> = {};
    for (const c of CALLOUTS) {
      const node = scene.getObjectByName(c.partName);
      if (!node) {
        console.warn(`[F35Viewer] Named part not found in GLB: "${c.partName}"`);
        continue;
      }
      const box = new THREE.Box3().setFromObject(node);
      out[c.key] = box.getCenter(new THREE.Vector3());
    }
    return out;
  }, [scene]);

  // Apply / restore emissive gold glow on focus changes
  useEffect(() => {
    const callout = CALLOUTS.find((c) => c.key === focusedKey);
    if (!callout) return;
    const node = scene.getObjectByName(callout.partName);
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

  // Camera + auto-rotation animation each frame
  const tmpVec = useRef(new THREE.Vector3());
  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (focusedKey) {
      // Focus mode: pause auto-rotate, animate camera to frame the part
      controls.autoRotate = false;
      const callout = CALLOUTS.find((c) => c.key === focusedKey);
      if (!callout) return;
      const node = scene.getObjectByName(callout.partName);
      if (!node) return;
      // Pull the part's WORLD position (post auto-rotation if any)
      const partWorld = tmpVec.current.set(0, 0, 0);
      node.getWorldPosition(partWorld);

      // Offset back from the part along view direction
      const offset = new THREE.Vector3(0, 0.6, 2.2);
      const targetCamPos = partWorld.clone().add(offset);

      camera.position.lerp(targetCamPos, 0.08);
      controls.target.lerp(partWorld, 0.12);
    } else {
      // Idle mode: resume auto-rotate if no recent interaction
      controls.autoRotate = !isInteracting;
      // Lerp back to default view
      camera.position.lerp(DEFAULT_CAM, 0.06);
      controls.target.lerp(DEFAULT_TARGET, 0.1);
    }
    controls.update();
  });

  return (
    <group ref={modelRef} onPointerDown={onUserInteract}>
      <primitive object={scene} />
      {CALLOUTS.map((c) => {
        const pos = partPositions[c.key];
        if (!pos) return null;
        const isActive = focusedKey === c.key;
        return (
          <Html
            key={c.key}
            position={pos.toArray()}
            center
            style={{ pointerEvents: "auto" }}
            zIndexRange={[10, 0]}
          >
            <CalloutButton
              label={c.partName.replace(/_/g, " ")}
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
        camera={{ position: DEFAULT_CAM.toArray(), fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        onPointerDown={handleUserInteract}
        onWheel={handleUserInteract}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        {/* Lighting — ambient fill + warm key + cool rim */}
        <ambientLight intensity={0.45} />
        <directionalLight position={[6, 6, 4]} intensity={1.4} color="#FFE9CC" />
        <directionalLight position={[-5, 3, -4]} intensity={0.8} color="#9DB6D8" />
        <pointLight position={[0, -4, 2]} intensity={0.25} color={GOLD} />

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
          target={DEFAULT_TARGET.toArray()}
          enablePan={false}
          enableZoom={true}
          minDistance={2.5}
          maxDistance={10}
          autoRotate={true}
          autoRotateSpeed={0.6}
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
              {focusedCallout.partName.replace(/_/g, " ")}
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
