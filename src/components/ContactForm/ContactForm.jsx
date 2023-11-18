import React, { useState } from 'react';
import './contactForm.css';

const ContactForm = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const handleOnBlur = (e) => {
        const newForm = {...form}
        newForm[e.target.name] = e.target.value;
        setForm(newForm)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(form);
        e.target.reset()
      }

    return (
        <>
            <div className='contactForm'>
                <h3>Get in Touch</h3>
                <form className='mt-3' onSubmit={handleSubmit}>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Your Name</label>
                        <input type="text" class="form-control" id="name" name="name" onBlur={handleOnBlur} required/>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Your Email</label>
                        <input type="email" id="email" name="email" class="form-control" aria-describedby="emailHelp" onBlur={handleOnBlur} required/>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Subject</label>
                        <input type="text" class="form-control" id="subject" name="subject"  onBlur={handleOnBlur} required/>
                    </div>
                    <div class="mb-3">
                        <label for="" class="form-label">Your Message</label>
                        <textarea class="form-control" id="floatingTextarea2" name="message" style={{ height: "150px" }} onBlur={handleOnBlur} required></textarea>
                    </div>
                    <input type="submit" class="btn btn-primary" id='sendButton' value="SEND"/>
                </form>
            </div>
        </>
    );
};

export default ContactForm;