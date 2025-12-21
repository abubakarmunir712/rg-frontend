
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedTorus() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.015;
    }
  });

  return (
    <TorusKnot ref={meshRef} args={[1, 0.4, 128, 32]}>
      <meshStandardMaterial color="#6c63ff" roughness={0.1} metalness={0.5} />
    </TorusKnot>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
        <div style={{width: '150px', height:'150px'}}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <AnimatedTorus />
      </Canvas>
      </div>
      <p className="mt-4 text-lg text-muted">Searching for insights...</p>
    </div>
  );
}
