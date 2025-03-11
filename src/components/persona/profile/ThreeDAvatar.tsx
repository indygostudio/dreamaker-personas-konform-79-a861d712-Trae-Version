
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDimensionalAvatarProps {
  imageUrl?: string;
  isHovering: boolean;
}

export const ThreeDAvatar = ({ imageUrl, isHovering }: ThreeDimensionalAvatarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 2;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const texture = new THREE.TextureLoader().load(imageUrl || '');
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 100,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Animation
    const animate = () => {
      if (!sphereRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

      sphereRef.current.rotation.y += 0.01;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [imageUrl]);

  return (
    <div 
      ref={containerRef} 
      className={`transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px'
      }}
    />
  );
};
