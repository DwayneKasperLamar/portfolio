import { useState } from "react"
import Globe from "react-globe.gl"
import Button from "../components/Button"

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
        <div className='grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-col-1 gap-5'>
            <div className='col-span-1 xl:row-span-3'>
                <div className='grid-container w-[276px]'>
                  <img src="assets/grido.png" alt="grid1" className="sm:h-[156px] object-contain rounded-lg"/>
                        <div>
                            <p className='grid-headtext'>Hello, I&apos;m Dwayne</p>
                            <p className='grid-subtext'>
                                with 3 years of Experience , 
                                I have honed my skills in frontend and backend development, with a focus on  solving real world problems
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
                         <p className='grid-subtext'>I specialize in javaScript/Typescript with a focus on React and Next.js ecosystems including a variety of frameworks, tools and technologies. </p>
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
                            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
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
                            I&apos;m based in Nigeria, and open to work remotely and collabrate with people from around the world.
                            i love immersive work and work on max 15 hours daily
                        </p>
                        <Button name="Contact Me" isBeam containerClass="w-full mt-10"/>
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
                                the idea that i can create solutions and innovate existing solutions through programming and technology seems Godlike to me, building products and brands that enhacne humans and life  is what drives me.
                            </p>
                        </div>
                    </div>
                </div>
            <div className="xl:col-span-1 xl:row-span-2">
                <div className="grid-container">
                    <img src="/assets/grid4.png" 
                    alt="grid-4"
                    className="w-full md:h-[126px] sm:[276px] h-fit object-cover sm:object-top" />
                    <div className="space-y-2">
                        <p className="grid-subtext text-center">
                            Contact Me
                        </p>
                        <div className="copy-container" onClick={handleCopy}>
                            <img src={hasCopied ? "/assets/tick.svg" : "/assets/copy.svg"} alt="copy" />
                            <p className="lg:text-1xl md:text-xl font-medium text-white">
                                Dwaynekasperlamar@gmail.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default About