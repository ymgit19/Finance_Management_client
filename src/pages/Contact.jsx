import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import contactService from '../services/contactService';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'General'
  });
  const [loading, setLoading] = useState(false);

  const { name, email, subject, message, inquiryType } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !subject || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await contactService.submitContact(formData);
      toast.success('Your inquiry has been submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'General'
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>Have questions? We'd love to hear from you.</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Fill out the form and our team will get back to you within 24 hours.</p>
          
          <div className="contact-details">
            <div className="contact-detail-item">
              <div className="detail-icon">📧</div>
              <div>
                <h4>Email</h4>
                <p>support@financetracker.com</p>
              </div>
            </div>
            
            <div className="contact-detail-item">
              <div className="detail-icon">📞</div>
              <div>
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="contact-detail-item">
              <div className="detail-icon">📍</div>
              <div>
                <h4>Office</h4>
                <p>123 Finance Street<br />New York, NY 10001</p>
              </div>
            </div>
            
            <div className="contact-detail-item">
              <div className="detail-icon">🕒</div>
              <div>
                <h4>Business Hours</h4>
                <p>Monday - Friday: 9AM - 6PM<br />Saturday - Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <h2>Send us a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="inquiryType">Inquiry Type</label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={inquiryType}
                onChange={handleChange}
              >
                <option value="General">General Inquiry</option>
                <option value="Support">Technical Support</option>
                <option value="Feedback">Feedback</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={subject}
                onChange={handleChange}
                placeholder="Brief subject of your message"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry..."
                rows="6"
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
