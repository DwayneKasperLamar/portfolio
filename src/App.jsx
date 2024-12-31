// import Hero from './sections/Hero'
import Navbar from './sections/Navbar'
import About from './sections/About'
import Projects from './sections/projects'
import Clients from './sections/Clients'
import Contact from './sections/Contact'

const App = () => {
    return (
        <main className="relative w-full h-screen">
            
                <Navbar/>
                {/* <Hero/> */}
                <About/>
                <Projects/>
                <Clients/>
                <Contact/>
            
        </main>
    )
}

export default App
