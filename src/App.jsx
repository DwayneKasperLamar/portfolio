// import Hero from './sections/Hero'
import Navbar from './sections/Navbar'
import About from './sections/About'
import Projects from './sections/projects'
import Clients from './sections/Clients'

const App = () => {
    return (
        <main className="relative w-full h-screen">
            
                <Navbar/>
                {/* <Hero/> */}
                <About/>
                <Projects/>
                <Clients/>
            
        </main>
    )
}

export default App
