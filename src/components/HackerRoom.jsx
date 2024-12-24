import { Suspense, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import CanvasLoader from './CanvasLoader';

function Model(props) {
  const [error, setError] = useState(null);
  const modelPath = '/models/hackersRoom.glb';

  useEffect(() => {
    const loadModel = async () => {
      try {
        await useGLTF.preload(modelPath);
      } catch (err) {
        console.error('Error loading model:', err);
        setError('Failed to load model');
      }
    };

    loadModel();

    return () => {
      useGLTF.dispose(modelPath);
    };
  }, []);

  if (error) {
    console.error('Model loading error:', error);
    return null;
  }

  const { scene } = useGLTF(modelPath);
  
  // Apply default material settings
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return <primitive object={scene} {...props} />;
}

export function HackerRoom(props) {
  return (
    <Suspense fallback={<CanvasLoader />}>
      <Model {...props} />
    </Suspense>
  );
}

// Preload the model
useGLTF.preload('/models/hackersRoom.glb');

export default HackerRoom;