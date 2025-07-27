import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { HomeHeader, Footer } from '../components/HeaderFooter';
import { ContactInfoCard } from '../components/Contact/ContactInfoCard';
import { submitContactForm } from '../services/api';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' }); // idle | loading | success | error

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required.";
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStatus({ state: 'loading', message: '' });
    try {
      await submitContactForm(formData);
      setStatus({ state: 'success', message: 'Thank you for your message! We will get back to you soon.' });
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } catch (err) {
      setStatus({ state: 'error', message: 'Sorry, something went wrong. Please try again later.' });
      console.error("Contact form submission error:", err);
    }
  };
  
  return (
    <>
      <HomeHeader />
      <div className="bg-gray-50">
        
        {/* Section 1: Hero */}
        <section className="text-center py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Get In Touch</h1>
            <p className="mt-4 text-lg text-gray-600">
              We'd love to hear from you! Whether you have a question about our books, events, or anything else, our team is ready to answer all your questions.
            </p>
          </div>
        </section>

        {/* Section 2: Contact Info */}
        <section className="py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <ContactInfoCard icon={<FaMapMarkerAlt size={28}/>} title="Our Address">
                    <p>123 Book Lane</p>
                    <p>Phnom Penh, Cambodia 12000</p>
                </ContactInfoCard>
                <ContactInfoCard icon={<FaPhone size={28}/>} title="Call Us">
                    <p>General Inquiries:</p>
                    <a href="tel:+85512345678" className="text-red-500 hover:underline">(+855) 12 345 678</a>
                </ContactInfoCard>
                <ContactInfoCard icon={<FaEnvelope size={28}/>} title="Email Us">
                    <p>Customer Support:</p>
                    <a href="mailto:support@konkhmerbooks.com" className="text-red-500 hover:underline">support@konkhmerbooks.com</a>
                </ContactInfoCard>
            </div>
        </section>

        {/* Section 3: Form & Map */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                    <input type="text" id="name" value={formData.name} onChange={handleChange} className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500`} />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                    <input type="email" id="email" value={formData.email} onChange={handleChange} className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500`} />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                  <input type="text" id="subject" value={formData.subject} onChange={handleChange} className={`mt-1 block w-full border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500`} />
                  {errors.subject && <p className="text-red-600 text-xs mt-1">{errors.subject}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea id="message" rows="5" value={formData.message} onChange={handleChange} className={`mt-1 block w-full border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500`}></textarea>
                  {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message}</p>}
                </div>
                <div>
                  <button type="submit" disabled={status.state === 'loading'} className="w-full bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition disabled:bg-gray-400">
                    {status.state === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
              {status.message && (
                <p className={`mt-4 text-sm ${status.state === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.message}</p>
              )}
            </div>
            
            {/* Right: Map */}
            <div className="h-96 lg:h-full w-full">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.7712338275146!2d104.9221148757917!3d11.56839354433767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31095144f3659227%3A0x6b8d7c49f193132e!2sRoyal%20Palace!5e0!3m2!1sen!2skh!4v1714486515009!5m2!1sen!2skh" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen="" 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}