import React, { useState } from 'react';
import { FaDove, FaCamera, FaCloudUploadAlt, FaTimes, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import './MainContent.css';

const MainContent = () => {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [species, setSpecies] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [saved, setSaved] = useState(false);

    const uploadFile = async (file) => {
        setLoading(true);
        setSaved(false);
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
        setSaved(false);
    };

    const handleSaveToJournal = () => {
        try {
            const stored = localStorage.getItem("avian_sightings");
            const sightingsList = stored ? JSON.parse(stored) : [];
            
            const newSighting = {
                id: Date.now(),
                name: species,
                date: new Date().toISOString().split('T')[0],
                location: "Identified via AI Upload",
                notes: "Spotted and identified using the offline AI Bird Species Detector.",
                image: `http://localhost:5000/${imageUrl}`
            };
            
            localStorage.setItem("avian_sightings", JSON.stringify([newSighting, ...sightingsList]));
            setSaved(true);
            alert(`${species} has been saved to your Bird Journal!`);
        } catch (error) {
            console.error("Error saving sighting to journal:", error);
        }
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

                                <div className="button-group-row">
                                    <button className="reset-button" onClick={handleClose}>
                                        Identify Another
                                    </button>
                                    <button 
                                        className={`save-journal-btn ${saved ? 'saved' : ''}`}
                                        onClick={handleSaveToJournal}
                                        disabled={saved || species.startsWith("Not a Bird")}
                                    >
                                        {saved ? "Saved!" : "Save Sighting"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Beautiful Crisp Bird Background Image */}
                <div className="right-column">
                    <div className="hero-bird-image-cover"></div>
                </div>
            </div>
        </div>
    );
};

export default MainContent;