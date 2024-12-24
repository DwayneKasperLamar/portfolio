import Hero from './sections/Hero'
import Navbar from './sections/Navbar'
import About from './sections/About'


const App = () => {
    return (
        <main className="max-w-7xl max-auto">

        <Navbar/>
        <Hero/>
        <About/>
        </main>
    )
}
export default App
