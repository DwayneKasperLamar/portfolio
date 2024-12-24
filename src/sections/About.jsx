import { useState } from "react"
import Globe from "react-globe.gl"
// import { button } from "../components/"

const About = () => {
    const [hasCopied, sethasCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('Dwaynekasperlamar@gmail.com');
        sethasCopied(true);
        
        setTimeout(() => {
            sethasCopied(false);
        }, 2000);
    }

  return (
    <section className="c-space my-20"> 
        <div  className='grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-col-1 gap-5'>
            <div className='col-span-1 xl:row-span-3'>
                <div className='grid-container'>
                    <img src='/assets/grid1.png'
                    alt='grid-1' className='w-full sm:h-[276px] h-fit object-contain'/>
                        <div>
                            <p className='grid-headtext'>Hello, I'm Dwayne</p>
                            <p className='grid-subtext'>
                                with 3 years of Experience , 
                                I have honed my skills in frontend and backend development, with a focus on animated 3D Projects 
                            </p>
                        </div>
                </div>
            </div>
            
            <div className='col-span-1 xl:row-span-3'>
                <div className='grid-container'>
                    <img src="/assets/grid2.png" 
                    alt="grid-2"
                    className='w-full sm:w-[276px] h-fit object-contain' />
                    <div>
                        <p className='grid-headtext'>Tech Stack</p>
                         <p className='grid-subtext'>I specialize in javaScript/Typescript with a focus on React and Next.js ecosystems </p>
                    </div>
                </div>
            </div>


            <div className='col-span-1 xl:row-span-4'>
                <div className='grid-container'>
                    <div className='rounded-3xl w-full sm:h-[326px] h-fit flex justify-center items-center'>
                        <Globe
                            height={326}
                            width={326}
                            backgroundColor="rgba(0,0,0,0)"
                            backgroundImageOpacity={0.5}
                            showGraticules
                            showAtmosphere
                            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topologu/png"
                            labelsData={[
                                {
                                    lat: 40,
                                    lng: -100,
                                    text: "I am Here,",
                                    color: "white",
                                    size: 20,
                                }
                            ]}
                        />
                    </div>
                    <div>
                        <p className="grid-headtext">
                            I work remotely across most timezones.
                        </p>
                        <p className="grid-subtext">
                            I'm based in Croatia, with remote work available
                        </p>
                        {/* <Button name="Contact Me" isBeam containerClass="w-full mt-10"/> */}
                    </div>
                </div>
            </div>

            <div className="xl:col-span-2 xl:row-span-3">
                    <div className="grid-container">
                        <img src="/assets/grid3.png" alt="grid-3"
                        className="w-full sm:h-[266px] h-fit object-contain" />
                        <div>
                            <p className="grid-headtext">
                                Why i code
                            </p>
                            <p className="grid-subtext">
                                Professional Neccesity
                            </p>
                        </div>
                    </div>
                </div>
            <div className="xl:col-span-1 xl:row-span-2">
                <div className="grid-container">
                    <img src="assets/grid4.png" 
                    alt="grid-4"
                    className="w-full md:h-[126px] sm:[276px] h-fit object-cover sm:object-top" />
                    <div className="space-y-2">
                        <p className="grid-subtext text-center">
                            Contact Me
                        </p>
                        <div className="copy-container" onClick={handleCopy}>
                            <img src={hasCopied ? "assets/tick.svg" : "assets/copy.svg"} alt="copy" />
                            <p className="lg:text-1xl md:text-xl font-medium text-gray_gradient text-white"
                            >Dwaynekasperlamar@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default About