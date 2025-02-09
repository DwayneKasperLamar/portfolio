
const Footer = () => {
  return (
    <section className="c-space pt-7 pb-3 border-t border-black-300 flex justify-between itesm-center flex-wrap gap-5">
        <div className="text-white-500 flex gap-2">
            <p> Terms & conditions</p>
            <p>|</p>
            <p>privacy Policy</p>
        </div>

        q   <div className="flex gap-3">
            <div className="social-icon">
            <a href="https://github.com/DwaynekasperLamar" target="_blank" rel="noreferrer"> </a>
            <img src="/assets/github.svg" 
            alt="github"
            className="w-1/2 h-1/2" />
            </div>
        </div>


         <div className="flex gap-3">
            <div className="social-icon">
            <a href="https://twitter.com/Dwaynekasper_" target="_blank" rel="noreferrer"> </a>
            <img src="/assets/twitter.svg" 
            alt="github"
            
            className="w-1/2 h-1/2" />
            </div>
        </div>



         <div className="flex gap-3">
            <div className="social-icon">
            <img src="/assets/instagram.svg" 
            alt="github"
            className="w-1/2 h-1/2" />
            </div>
        </div>


        <p className="text-white-500">
            © 2025. Dwayne@
            All rights reserved
        </p>
        </section>
  )
}

export default Footer