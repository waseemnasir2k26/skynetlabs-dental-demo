"use client";
import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useCameraDrift, useMouseParallax } from "@/lib/r3f-helpers";

/**
 * Phase 5 — Dental flagship R3F scene.
 *  - floating molar/incisor with subsurface BSDF (MeshTransmissionMaterial)
 *  - soft caustic dust via Sparkles (≤8k tris budget)
 *  - 60s linear camera drift + mouse parallax ±5° (helpers handle reduced-motion)
 *  - warm cream stage (no dark frame) so the antique-gold accent + Cormorant
 *    headline can co-exist per brief
 */

function Stage() {
  // Camera drift (60s) + mouse parallax — both no-op on reduced-motion.
  useCameraDrift({ amplitude: 0.18, periodSeconds: 60 });
  useMouseParallax({ strength: 0.07, smoothing: 0.06 });
  return null;
}

function ToothGeometry() {
  const meshRef = React.useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // 0.15rpm ≈ 0.0157 rad/s
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.0157;
      // gentle floaty bob
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.45) * 0.06;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
      {/* Upper-incisor approximation — squarish cylinder, taller than wide.
          radialSegments=24 + heightSegments=6 keeps tris well under 8k. */}
      <cylinderGeometry args={[0.55, 0.7, 1.85, 24, 6]} />
      <MeshTransmissionMaterial
        color="#FFF4EA"
        roughness={0.08}
        thickness={1.4}
        ior={1.62}
        chromaticAberration={0.04}
        anisotropy={0.18}
        distortion={0.12}
        distortionScale={0.4}
        temporalDistortion={0.08}
        attenuationColor="#FFE9E0"
        attenuationDistance={0.7}
        backside={false}
      />
    </mesh>
  );
}

interface ToothMeshProps {
  posterSrc?: string;
}

export default function ToothMesh({ posterSrc: _posterSrc = "/hero/poster.jpg" }: ToothMeshProps) {
  return (
    <div className="absolute inset-0 -z-10">
      {/* Cream stage + soft radial glow centered on mesh, per brief. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 65% 50%, rgba(201,169,97,0.16) 0%, rgba(232,228,221,0.0) 55%), #F5F1EA",
        }}
      />
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.2], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Stage handles drift + parallax via helpers (reduced-motion gated) */}
        <Stage />

        <ambientLight intensity={0.35} />
        {/* Key light — warm 4200K, camera-left */}
        <pointLight position={[-2.4, 1.6, 3]} intensity={2.6} color="#FFD580" />
        {/* Rim light — cool, behind */}
        <pointLight position={[2.2, 1.0, -2.5]} intensity={1.4} color="#DCE6F2" />
        {/* Loupe fill from below */}
        <pointLight position={[0, -2, 2]} intensity={0.9} color="#FFF5E0" />

        <Environment preset="studio" environmentIntensity={0.4} />

        <React.Suspense fallback={null}>
          <ToothGeometry />
          {/* Soft caustic dust — kept tiny so it doesn't compete w/ headline */}
          <Sparkles
            count={28}
            scale={[3.5, 2.5, 1.8]}
            size={1.6}
            speed={0.2}
            opacity={0.55}
            color="#C9A961"
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
