import React from 'react';
import './Contact.css'; // Assuming you have a CSS file for styling

const Contact = () => {
    return (
        <div className="contact-container">
            <div className="contact-card">
                <h2>Contact Us</h2>
                <p>This application helps you detect bird species by analyzing visual image content locally.</p>
                <p>For questions, support, or collaboration, feel free to reach out:</p>
                <div className="email-box">
                    challamanikethanreddy@gmail.com
                </div>
            </div>
        </div>
    );
};

export default Contact;