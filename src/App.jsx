// import Hero from './sections/Hero'
import Navbar from './sections/Navbar'
import About from './sections/About'
import Projects from './sections/projects'

const App = () => {
    return (
        <main className="relative w-full h-screen">
            
                <Navbar/>
                {/* <Hero/> */}
                <About/>
                <Projects/>
            
        </main>
    )
}

export default App
