import  {useRef, useState} from 'react'

const Contact = () => {
    const formRef = useRef();

    const [loading, setloading] = useState(false)
    const [form, setform] = useState({

         namel: " ",
         email: " " ,
         message: " ",

    })


const handleChange = ({target: {name, value}}) => {
    setform({...form, [name]: value})
}
const handleSumbit = () => {}


  return (
    <section className='c-space my-20'>
        <div className='relative min-h-screen flex items-center justify-center flex-col'>
            <img src="/assets/terminal.png" 
            alt="terminal background" 
            className='absolute inset-0 min-h-screen'/>

            <div className='contact-container'>
                <h3 className='head-text'>let's Talk</h3>

                <p className='text-lg text-white-600 mt-3'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil vitae, tempore placeat facilis architecto mollitia dolor non cumque ex.</p>

                
              <form ref={formRef} onSubmit ={handleSumbit}
                className="mt-12 flex flex-col space-y-7">
                    <label className="space-y-3">
                      <span className='field-label'>
                        full name</span>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className='field-input'
                        placeholder='Gideon Dwayne Chimaobi'
                      />
                    </label>

                    <label className="space-y-3">
                      <span className='field-label'>
                        Email</span>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className='field-input'
                        placeholder='DwayneKasperlamar@gmail.com'
                      />
                    </label>

                    {/* <label className="space-y-3">
                      <span className='field-label'>
                        Your message</span>
                      <textarea
                        type="message"
                        name="name"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className='field-input'
                        placeholder="HI, I'm interested in working with you"
                      />
                    </label> */}


                    <button className='field-btn' type='submit diasbled={loading}'>
                      {loading ? 'Sending...' : 'Send Message'}
                      <img src="/assets/arrow-up.png"
                       alt="arrow-up"
                       className="field-btn_arrow"/>
                    </button>
              </form>
            </div >
        </div>
    </section>
  )
}

export default Contact