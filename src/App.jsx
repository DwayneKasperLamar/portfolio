// import Hero from './sections/Hero'
import Navbar from './sections/Navbar'
import About from './sections/About'
import Projects from './sections/projects'
import Clients from './sections/Clients'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import Experince from './sections/Experince'

const App = () => {
    return (
        <main className="relative w-full h-screen">
            
                <Navbar/>
                {/* <Hero/> */}
                <About/>
                <Projects/>
                <Clients/>
                <Contact/>
                <Experince/>
                <Footer/>
            

        </main>
    )
}

export default App
