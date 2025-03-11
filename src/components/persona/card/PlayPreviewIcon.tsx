
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PlayPreviewIconProps {
  isHovering: boolean;
  onClick: () => void;
}

export const PlayPreviewIcon = ({ isHovering, onClick }: PlayPreviewIconProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const iconRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(50, 50);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create play icon geometry (triangle)
    const geometry = new THREE.ConeGeometry(1, 2, 3);
    geometry.rotateZ(-Math.PI / 2);
    
    const material = new THREE.MeshPhongMaterial({
      color: 0x10b981, // Emerald color to match theme
      shininess: 100,
    });

    const icon = new THREE.Mesh(geometry, material);
    scene.add(icon);
    iconRef.current = icon;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      if (!iconRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

      requestAnimationFrame(animate);

      if (isHovering) {
        iconRef.current.rotation.y += 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [isHovering]);

  return (
    <div 
      ref={containerRef}
      onClick={onClick}
      className="absolute bottom-4 right-4 w-[50px] h-[50px] cursor-pointer z-10 hover:scale-110 transition-transform"
    />
  );
};
