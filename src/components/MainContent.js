import React, { useState, useEffect } from 'react';
import { FaDove, FaCamera, FaCloudUploadAlt, FaTimes, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import './MainContent.css';

// Curated list of 10 breathtaking, high-contrast, colorful bird images from Wikipedia's public CDN
const BIRD_IMAGES = [
    "/hero_bird.jpg", // Start with our gorgeous generated Cedar Waxwing berry image
    "https://upload.wikimedia.org/wikipedia/commons/c/cc/Common_kingfisher_Alcedo_atthis.jpg", // Common Kingfisher
    "https://upload.wikimedia.org/wikipedia/commons/e/e4/Pharomachrus_mocinno_-Costa_Rica-8.jpg", // Resplendent Quetzal
    "https://upload.wikimedia.org/wikipedia/commons/9/9e/Aix_galericulata_-_Richmond_Park_-_London.jpg", // Mandarin Duck
    "https://upload.wikimedia.org/wikipedia/commons/c/c4/Puffin_Latrabjarg_Iceland.jpg", // Atlantic Puffin
    "https://upload.wikimedia.org/wikipedia/commons/c/c5/Peacock_Plumage.jpg", // Indian Peafowl
    "https://upload.wikimedia.org/wikipedia/commons/5/53/Chrysolophus_pictus_-_Cincinnati_Zoo.jpg", // Golden Pheasant
    "https://upload.wikimedia.org/wikipedia/commons/5/51/Red-crested_Cardinal_on_Hawaii.jpg", // Red-crested Cardinal
    "https://upload.wikimedia.org/wikipedia/commons/b/b8/Flickr_-_Koshy_Koshy_-_Flamingos.jpg", // Greater Flamingo
    "https://upload.wikimedia.org/wikipedia/commons/b/b3/Lilac-breasted_roller_%28Coracias_caudatus%29_crop.jpg" // Lilac-breasted Roller
];

const MainContent = () => {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [species, setSpecies] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

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
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response.data);
            if (response.data.birds) {
                setSpecies(response.data.birds.join(', '));
                setImageUrl(response.data.image_url);
                setFileUploaded(true);
            } else {
                console.error('No species detected in response:', response.data);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to connect to the backend server. Please make sure the Flask server is running.');
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
                        <span className="badge">AI-Powered Detection</span>
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
                                <h3>Analyzing Avian Pixels...</h3>
                                <p>Running local two-stage hybrid model classification</p>
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
                                            src={`http://localhost:5000/${imageUrl}`} 
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