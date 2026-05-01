"use client";
import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Dental flagship R3F scene — tooth in BSDF porcelain.
 * Geometry + material PRESERVED from the original scene.
 * Wrapper container, background, and lighting tinted to the mint+coral palette
 * per dental brief (warm clinic, NOT cold sterile, NOT dark).
 */
function ToothGeometry() {
  const meshRef = React.useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // 0.15 rpm → slow, calm rotation (preserved from original scene)
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.01571 * 60 * (0.15 / 60) * Math.PI * 2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
      {/* Upper-incisor approximation — geometry preserved */}
      <cylinderGeometry args={[0.55, 0.65, 1.8, 6, 4]} />
      <MeshDistortMaterial
        color="#FFE9E0"
        roughness={0.08}
        metalness={0}
        transmission={0.4}
        thickness={1.2}
        ior={1.62}
        attenuationColor="#FFE9E0"
        attenuationDistance={0.6}
        distort={0.05}
        speed={0.4}
        envMapIntensity={1.2}
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
      {/* Mint-bone wash background — no longer the dark #1F1A14.
          Soft radial vignette so the porcelain tooth reads as the focal point
          and the mint floor recedes warmly behind it. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, #FFFFFF 0%, #F6FBFA 45%, #E4F1EE 100%)",
        }}
      />
      {/* Subtle coral wash, top-right — accent without becoming a candy site */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 88% 12%, rgba(255,138,107,0.10) 0%, rgba(255,138,107,0) 38%)",
        }}
      />
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Bright clinical-warm ambient — bone, not sterile blue */}
        <ambientLight intensity={0.55} color="#FFF8F2" />
        {/* Key light — soft daylight 4200K */}
        <pointLight position={[-2, 1.5, 3]} intensity={2.6} color="#FFEDD8" />
        {/* Mint rim — picks up the practice palette without staining the porcelain */}
        <pointLight position={[2.4, 1.0, 2.2]} intensity={0.8} color="#2BAE9D" />
        {/* Warm coral fill — operatory wood-tone bounce, very subtle */}
        <pointLight position={[0, -2, 2]} intensity={0.9} color="#FF8A6B" />
        <Environment preset="studio" />
        <React.Suspense fallback={null}>
          <ToothGeometry />
        </React.Suspense>
      </Canvas>
      {/* Soft floor shadow — gives the tooth weight without a hard line */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, rgba(15,42,46,0) 0%, rgba(15,42,46,0.04) 100%)",
        }}
        aria-hidden
      />
    </div>
  );
}
