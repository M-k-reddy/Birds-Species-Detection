import React, { useState, useEffect } from 'react';
import { FaDove, FaCamera, FaCloudUploadAlt, FaTimes, FaSpinner } from 'react-icons/fa';
import { pipeline, env } from '@huggingface/transformers';
import './MainContent.css';

// Curated list of 7 breathtaking, local, high-contrast bird images
const BIRD_IMAGES = [
    "/hero_bird.jpg",
    "/philippine_eagle.jpg",
    "/kakapo.jpg",
    "/king_of_saxony.jpg",
    "/marvelous_spatuletail.jpg",
    "/resplendent_quetzal.jpg",
    "/ribbon_tailed_astrapia.jpg"
];

// Module-level cache for the model
let classifierInstance = null;

const getClassifier = async (onProgress) => {
    if (!classifierInstance) {
        env.allowLocalModels = false;
        classifierInstance = await pipeline('image-classification', 'chriamue/bird-species-classifier', {
            progress_callback: onProgress,
        });
    }
    return classifierInstance;
};

const MainContent = () => {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [species, setSpecies] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // States for model loading progress
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');

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
        setDownloadProgress(0);
        setLoadingMessage('Loading AI model components...');

        // Create a local URL for the uploaded image so the browser can display it
        const localUrl = URL.createObjectURL(file);
        setImageUrl(localUrl);

        try {
            // Lazily get/initialize the classifier pipeline
            const classifier = await getClassifier((data) => {
                if (data.status === 'progress') {
                    setDownloadProgress(Math.round(data.progress));
                    setLoadingMessage(`Downloading model: ${Math.round(data.progress)}%`);
                } else if (data.status === 'ready') {
                    setLoadingMessage('Initializing model weights...');
                }
            });

            setLoadingMessage('Analyzing avian features...');
            
            // Run inference directly in browser
            const results = await classifier(localUrl);
            console.log('Inference Results:', results);

            if (results && results.length > 0) {
                const topResult = results[0];
                const speciesName = topResult.label.split(',')[0].trim().toUpperCase();
                const confidence = topResult.score;

                if (confidence < 0.35) {
                    setSpecies(`${speciesName} (Low Confidence: ${(confidence * 100).toFixed(1)}% — Try a clearer photo)`);
                } else {
                    setSpecies(speciesName);
                }
                setFileUploaded(true);
            } else {
                setSpecies('Could not identify the species. Please try another photo.');
                setFileUploaded(true);
            }
        } catch (error) {
            console.error('Classification error:', error);
            alert('Failed to run the bird classifier. Please try again with a different image.');
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
                        <span className="badge">Local AI Detection</span>
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
                                {downloadProgress > 0 && downloadProgress <= 100 && (
                                    <div className="progress-bar-container">
                                        <div 
                                            className="progress-bar-fill" 
                                            style={{ width: `${downloadProgress}%` }}
                                        ></div>
                                    </div>
                                )}
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

export default MainContent;ntent;