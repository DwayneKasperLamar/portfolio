import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Preload } from '@react-three/drei'
import HackerRoom from '../components/HackerRoom'
import { Suspense } from 'react'
import CanvasLoader from '../components/CanvasLoader'

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden">
        <div className="absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5 px-6">
            <div className="flex flex-col justify-center items-center mt-5 w-full">
                <p className="sm:text-3xl text-3xl font-medium text-white text-center font-generalsans">
                    Hi, I am Dwayne <span className="waving-hand">👋</span>
                </p>
                <p className="hero_tag text-gray_gradient mt-2">
                    From my Imaginations to Codes
                </p>
            </div>
        </div>

        <div className="absolute inset-0 w-full h-full">
            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{ 
                    preserveDrawingBuffer: true,
                    antialias: true,
                    alpha: true
                }}
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 200,
                    position: [-4, 3, 6]
                }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'transparent'
                }}
            >    
                <Suspense fallback={<CanvasLoader />}>
                    <OrbitControls
                        enableZoom={false}
                        maxPolarAngle={Math.PI / 2}
                        minPolarAngle={Math.PI / 2}
                        enablePan={false}
                        enableDamping
                        dampingFactor={0.05}
                        rotateSpeed={0.5}
                    />
                    <HackerRoom
                        scale={0.05}
                        position={[0, -2, 0]}
                        rotation={[0, -Math.PI / 2, 0]}
                    />
                    <Environment preset="city" />
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    </section>
  )
}

export default Hero