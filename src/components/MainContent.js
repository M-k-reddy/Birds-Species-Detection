import React, { useState, useEffect } from 'react';
import { FaDove, FaCamera, FaCloudUploadAlt, FaTimes, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import './MainContent.css';

// Curated list of 7 breathtaking, local, high-contrast bird images
const PUBLIC_PREFIX = process.env.PUBLIC_URL || '';
const BIRD_IMAGES = [
    `${PUBLIC_PREFIX}/hero_bird.jpg`,
    `${PUBLIC_PREFIX}/philippine_eagle.jpg`,
    `${PUBLIC_PREFIX}/kakapo.jpg`,
    `${PUBLIC_PREFIX}/king_of_saxony.jpg`,
    `${PUBLIC_PREFIX}/marvelous_spatuletail.jpg`,
    `${PUBLIC_PREFIX}/resplendent_quetzal.jpg`,
    `${PUBLIC_PREFIX}/ribbon_tailed_astrapia.jpg`
];

const MainContent = () => {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [species, setSpecies] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Analyzing avian features...');

    // States for rotating background bird images
    const [bgIndex, setBgIndex] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFadeIn(false);
            setTimeout(() => {
                setBgIndex((prevIndex) => (prevIndex + 1) % BIRD_IMAGES.length);
                setFadeIn(true);
            }, 800); // 800ms transition time
        }, 15000); // Change image every 15 seconds

        return () => clearInterval(interval);
    }, []);

    const uploadFile = async (file) => {
        setLoading(true);
        setLoadingMessage('Analyzing avian features with two-stage AI...');

        // Create a local preview immediately for fast UX
        const localUrl = URL.createObjectURL(file);
        setImageUrl(localUrl);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response.data.birds && response.data.birds.length > 0) {
                const detectedSpecies = response.data.birds.join(', ');
                setSpecies(detectedSpecies);
                if (response.data.image_url) {
                    setImageUrl(response.data.image_url);
                }
                setFileUploaded(true);
            } else {
                setSpecies('Could not identify the species. Please try another photo.');
                setFileUploaded(true);
            }
        } catch (error) {
            console.error('Classification error:', error);
            alert('Failed to analyze the bird image. Please ensure the server is running and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (event) => {
        if (event.target.files.length > 0) {
            uploadFile(event.target.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadFile(e.dataTransfer.files[0]);
        }
    };

    const handleClose = () => {
        setFileUploaded(false);
        setSpecies('');
        setImageUrl('');
    };

    return (
        <div className="home-section" id="home">
            <div className="split-layout-container">
                {/* Left Side: Content & Actions */}
                <div className="left-column">
                    <div className="hero-text-content">
                        <span className="badge">Two-Stage AI Detection</span>
                        <h1 className="hero-title">All About Birds</h1>
                        <p className="hero-subtitle">Detect Species by Image 🐦 📷</p>
                        <p className="hero-quote">"Capturing Birds in Every Frame"</p>
                    </div>

                    <div className="interactive-card">
                        {!fileUploaded && !loading && (
                            <div 
                                className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <label className="upload-label">
                                    <FaCloudUploadAlt className="upload-icon" />
                                    <span className="upload-title">Choose a bird image</span>
                                    <span className="upload-desc">or drag and drop it here</span>
                                    <span className="upload-limit">Supports JPG, PNG, WEBP</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        style={{ display: 'none' }} 
                                        onChange={handleFileUpload} 
                                    />
                                </label>
                            </div>
                        )}

                        {loading && (
                            <div className="loading-card">
                                <FaSpinner className="spinner-icon" />
                                <h3>{loadingMessage}</h3>
                                <p style={{ color: 'var(--text-secondary, #666)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                    Running MobileNetV2 verification & 525-species neural classification
                                </p>
                            </div>
                        )}

                        {fileUploaded && !loading && (
                            <div className="result-card">
                                <div className="result-header">
                                    <h3>Detection Completed</h3>
                                    <button className="close-btn" onClick={handleClose}>
                                        <FaTimes />
                                    </button>
                                </div>
                                
                                <div className="result-image-wrapper">
                                    {imageUrl && (
                                        <img 
                                            src={imageUrl} 
                                            alt="Uploaded Bird" 
                                            className="result-image"
                                        />
                                    )}
                                </div>

                                <div className="result-details">
                                    <span className="result-label">Detected Species</span>
                                    <span className="result-value">{species}</span>
                                </div>

                                <button className="reset-button" onClick={handleClose}>
                                    Identify Another Bird
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Beautiful Rotating Bird Background Image */}
                <div className="right-column">
                    <div 
                        className={`hero-bird-image-cover ${fadeIn ? 'fade-in' : ''}`} 
                        style={{ backgroundImage: `url('${BIRD_IMAGES[bgIndex]}')` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default MainContent;