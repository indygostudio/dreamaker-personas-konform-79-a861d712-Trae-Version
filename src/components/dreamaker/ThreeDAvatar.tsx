
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDProps {
  modelUrl?: string | null;
  animationPreset?: string;
  fallbackImageUrl?: string | null;
}

export const ThreeDAvatar = ({ modelUrl, animationPreset = 'rotate', fallbackImageUrl }: ThreeDProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current || !modelUrl) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Create a simple sphere as placeholder
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x00ff00,
      opacity: 0.8,
      transparent: true
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (animationPreset === 'rotate') {
        sphere.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl, animationPreset]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full absolute inset-0"
      style={{ 
        background: 'transparent',
        pointerEvents: 'none' 
      }}
    >
      {!modelUrl && fallbackImageUrl && (
        <img 
          src={fallbackImageUrl} 
          alt="Avatar"
          className="w-full h-full object-cover absolute inset-0"
        />
      )}
    </div>
  );
};
