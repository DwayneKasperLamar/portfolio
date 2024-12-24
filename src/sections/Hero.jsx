import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import HackerRoom from '../components/HackerRoom'
import { Suspense } from 'react'
import CanvasLoader from '../components/CanvasLoader'

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto">
        {/* Background color */}
        <div className="absolute inset-0 bg-[#010103]" />

        {/* Content */}
        <div className="absolute inset-0 top-[120px] max-w-7xl mx-auto sm:px-16 px-6 z-10">
            <div className="flex flex-col justify-center items-center mt-5">
                <p className="sm:text-3xl text-3xl font-medium text-white text-center font-generalsans">
                    Hi, I am Dwayne <span className="waving-hand">👋</span>
                </p>
                <p className="hero_tag text-gray_gradient mt-2">
                    From my Imaginations to Codes
                </p>
            </div>
        </div>

        {/* Canvas container with explicit dimensions */}
        <div className="absolute inset-0" style={{ height: '100vh', width: '100vw' }}>
            <Canvas
                style={{
                    width: '100%',
                    height: '100%',
                    background: '#010103'
                }}
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 2000,
                    position: [0, 2, 10]
                }}
                gl={{
                    antialias: true,
                    alpha: false
                }}
            >    
                <Suspense fallback={<CanvasLoader />}>
                    <Stage
                        environment="city"
                        intensity={0.6}
                        adjustCamera={false}
                    >
                        <HackerRoom />
                    </Stage>
                    <OrbitControls
                        enableZoom={false}
                        maxPolarAngle={Math.PI / 2}
                        minPolarAngle={Math.PI / 2}
                        target={[0, 0, 0]}
                    />
                </Suspense>
            </Canvas>
        </div>
    </section>
  )
}

export default Hero