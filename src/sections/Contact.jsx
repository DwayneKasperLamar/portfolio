import { useState } from 'react';
import  emailjs from "@emailjs/browser";

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        'service_06qw94h',
        'template_fwcnx3s',
        {
          from_name: form.name,
          to_name: 'Gideon',
          from_email: form.email,
          to_email: 'dwaynekasperlamar@gmail.com',
          message: form.message
        },
        '3rNzuYONljMkHDPaF' // Public key
      );

      setLoading(false);
      alert('Your message to Dwayne was a success!');
      setForm({
        name: '',
        email: '',
        message: ''
      });

    } catch (error) {
      setLoading(false);
      console.error(error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <section className="c-space my-20">
      <div className="container">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>
              <span>Your name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="field-input"
                placeholder="Your name"
              />
            </label>
            <label>
              <span>Your email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="field-input"
                placeholder="Your email"
              />
            </label>
            <label>
              <span>Your message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="field-input"
                placeholder="Hi, I'm interested in working with you"
              />
            </label>

            <button className='field-btn' type='submit' disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
              <img src="/assets/arrow-up.png" alt="arrow-up" className="field-btn_arrow" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;