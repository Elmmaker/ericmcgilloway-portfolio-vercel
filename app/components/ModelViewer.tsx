"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div
          className="rounded-full border-2 border-gold border-t-transparent animate-spin"
          style={{ width: 32, height: 32 }}
        />
        <span className="font-mono text-[11px] tracking-[2px] uppercase text-gold">
          {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}

function Spacecraft() {
  const { scene } = useGLTF("/models/gateway-core.glb");
  const groupRef = useRef<THREE.Group>(null);

  // Compute bounding sphere (rotation-invariant) and scale to fit
  const { center, scaleFactor } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    // Scale so the bounding sphere radius = 2 units — big enough to zoom in on details
    const s = 4 / sphere.radius;
    return { center: sphere.center, scaleFactor: s };
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.075;
    }
  });

  return (
    <group ref={groupRef} scale={scaleFactor}>
      <primitive object={scene} position={[-center.x, -center.y, -center.z]} />
    </group>
  );
}

export default function ModelViewer() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
          gl.setClearColor(0x000000, 0);
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} />
        <directionalLight position={[-3, 4, -5]} intensity={0.6} color="#8090B0" />
        <pointLight position={[0, -3, 2]} intensity={0.3} color="#C5A455" />

        <Suspense fallback={<Loader />}>
          <Spacecraft />
        </Suspense>

        <OrbitControls
          target={[0, 0, 0]}
          enablePan={false}
          enableZoom={true}
          minDistance={1}
          maxDistance={12}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
