import React from 'react';
import './About.css'; // Assuming you have a CSS file for styling

const About = () => {
    return (
        <div className="about-container">
            <div className="about-card">
                <h2>About Us</h2>
                <p>Welcome to our innovative bird detection platform, where cutting-edge technology meets nature.
                    Our project utilizes both audio and image recognition to accurately identify bird species from sounds and visual cues.
                    Whether you're a birdwatcher, nature enthusiast, or researcher, our platform offers a seamless experience for
                    detecting and learning about birds in real-time.
                </p>
                <p><strong>Our Mission:</strong></p>
                <p>
                    Our mission is to make birdwatching and conservation more accessible to everyone, by harnessing the power of technology. Whether you're in the field or at home, we aim to provide an intuitive tool to help you learn more about the fascinating birds around you. By combining audio and image detection, we’re building a comprehensive bird identification system that makes it easier than ever to explore avian life.
                </p>
                <p><strong>Why Audio and Images?</strong></p>
                <p>
                    Birds are often elusive, making it challenging to spot them. But through the power of audio and image recognition, we can capture their presence even when they’re hidden from sight. With our dual approach, users can engage with birds through both their sound and their appearance, opening up a world of discovery and learning.
                </p>
                <p><strong>Join Us on Our Journey:</strong></p>
                <p>
                    Whether you're here to identify a bird you've spotted, contribute to the growing database, or simply learn more about the bird species around you, we invite you to explore our platform and join the birdwatching community. With every bird you identify, you're contributing to a better understanding of our planet’s avian diversity.
                </p>
                <p>Happy birdwatching!</p>
            </div>
        </div>
    );
};

export default About;