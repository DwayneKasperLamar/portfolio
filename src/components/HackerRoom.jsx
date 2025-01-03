import { Suspense, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Loader, useProgress, SpotLight, Clone, Center } from '@react-three/drei';

function LoadingManager() {
  const { progress, loaded, total } = useProgress();
  useEffect(() => {
    console.log(`Loading progress: ${progress}%, ${loaded}/${total} items loaded`);
  }, [progress, loaded, total]);
  return null;
}

function Model() {
  // Try loading a simpler model first
  const modelPath = '/models/computer.glb';
  console.log('Attempting to load model from:', modelPath);

  const gltf = useLoader(GLTFLoader, modelPath, (loader) => {
    loader.manager.onStart = (url) => console.log('Started loading:', url);
    loader.manager.onLoad = () => console.log('Loading complete!');
    loader.manager.onProgress = (url, loaded, total) => {
      console.log(`Loading file: ${url}. ${loaded} of ${total} files.`);
    };
    loader.manager.onError = (url) => console.error('Error loading:', url);
  });
  
  useEffect(() => {
    if (gltf) {
      console.log('Model loaded:', gltf);
      console.log('Scene:', gltf.scene);
      
      // Log model structure
      gltf.scene.traverse((child) => {
        console.log('Model child:', child.type, child.name, child);
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [gltf]);

  if (!gltf) {
    console.log('Model not loaded yet');
    return null;
  }

  return (
<<<<<<< HEAD
    <group {...props} dispose={null}>
      <mesh geometry={nodes.screen_screens_0.geometry} material={materials.screens}>
        <meshMatcapMaterial map={screenTxt} />
      </mesh>
      <mesh geometry={nodes.screen_glass_glass_0.geometry} material={materials.glass} />
      <mesh geometry={nodes.table_table_mat_0_1.geometry} material={materials.table_mat} />
      <mes geometry={nodes.table_table_mat_0_2.geometry} material={materials.computer_mat}>
        <meshMatcapMaterial map={monitortxt} />
      </mesh
      <mesh geometry={nodes.table_table_mat_0_3.geometry} material={materials.server_mat} />
      <mesh geometry={nodes.table_table_mat_0_4.geometry} material={materials.vhsPlayer_mat} />
      <mesh geometry={nodes.table_table_mat_0_5.geometry} material={materials.stand_mat} />
      <mesh geometry={nodes.table_table_mat_0_6.geometry} material={materials.mat_mat} />
      <mesh geometry={nodes.table_table_mat_0_7.geometry} material={materials.arm_mat} />
      <mesh geometry={nodes.table_table_mat_0_8.geometry} material={materials.tv_mat}>
        <meshMatcapMaterial map={monitortxt} />
      </mesh>
      <mesh geometry={nodes.table_table_mat_0_9.geometry} material={materials.cables_mat} />
      <mesh geometry={nodes.table_table_mat_0_10.geometry} material={materials.props_mat} />
      <mesh geometry={nodes.table_table_mat_0_11.geometry} material={materials.ground_mat} />
      <mesh geometry={nodes.table_table_mat_0_12.geometry} material={materials.key_mat} />
    </group>
=======
    <Center>
      <Clone object={gltf.scene} scale={2} />
    </Center>
>>>>>>> refs/remotes/origin/main
  );
}

export function HackerRoom() {
  return (
    <Suspense fallback={<Loader />}>
      <LoadingManager />
      <group>
        {/* Basic lighting setup */}
        <SpotLight
          castShadow
          intensity={1}
          angle={0.2}
          penumbra={1}
          position={[10, 10, 10]}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        
        {/* Add a simple box to verify scene is working */}
        <Center>
          <mesh scale={[1, 1, 1]}>
            <boxGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </Center>

        {/* Model */}
        <Model />
      </group>
    </Suspense>
  );
}

export default HackerRoom;