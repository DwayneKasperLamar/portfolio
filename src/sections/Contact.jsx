import  {useRef, useState} from 'react'

const Contact = () => {
    const formRef = useRef();

    const [loading, setloading] = useState(false)
    const [form, setform] = useState({

         namel: " ",
         email: " " ,
         message: " ",

    })


const handleChange = () => {}
const handleSumbit = () = {}


  return (
    <section className='c-space my-20'>
        <div className='relative min-h-screen flex items-center justify-center flex-col'>
            <img src="/assets/terminal.png" 
            alt="terminal background" className='absolute inset-0 min-h-screen' />
            <div className='contact-container'>
                <h3 className='head-text'>let's Talk</h3>
                <p className='text-lg text-white-600'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil vitae, tempore placeat facilis architecto mollitia dolor non cumque ex. Nemo, odio incidunt quod sit suscipit ducimus possimus explicabo earum aspernatur!</p>

                
              <form action="">

              </form>

            </div>


        </div>

    </section>
  )
}

export default Contact