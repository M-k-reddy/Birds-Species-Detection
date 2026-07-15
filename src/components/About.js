import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-card">
                <h2>About Us</h2>
                <p>Welcome to our innovative bird species detection platform, where cutting-edge computer vision technology meets nature.
                    Our project utilizes state-of-the-art offline image classification models to instantly identify bird species from visual cues and photos.
                    Whether you're a birdwatcher, nature enthusiast, or researcher, our platform offers a seamless, beautiful experience for
                    detecting and learning about birds.
                </p>
                <p><strong>Our Mission:</strong></p>
                <p>
                    Our mission is to make birdwatching and conservation more accessible to everyone, by harnessing the power of artificial intelligence. We aim to provide an intuitive tool to help you learn more about the fascinating birds around you in real-time, completely offline.
                </p>
                <p><strong>Offline Image Intelligence:</strong></p>
                <p>
                    By combining general-purpose image verification and a highly specialized avian classification model, we've built a robust offline detection pipeline. The app first verifies that the photo indeed contains a bird before attempting species-level classification. This helps prevent misclassifications and provides real-time, helpful feedback.
                </p>
                <p><strong>Join Us on Our Journey:</strong></p>
                <p>
                    Whether you're here to identify a bird you've spotted, test your bird knowledge, or simply explore the diversity of bird species, we invite you to enjoy our platform. With every bird species you explore, you're contributing to a better appreciation of our planet’s avian diversity.
                </p>
                <p>Happy birdwatching!</p>
            </div>
        </div>
    );
};

export default About;