import React, { useState, useEffect } from 'react';
import { FaTrash, FaCalendarAlt, FaBook, FaPlus, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import './Journal.css';

const DEFAULT_SIGHTINGS = [
    {
        id: 1,
        name: "American Crow",
        date: "2026-07-15",
        notes: "Spotted this beautiful crow sitting on my garden fence. It was calling loudly to other crows in the area.",
        image: "http://localhost:5000/static/uploads/crow.jpg",
        location: "Backyard Garden"
    },
    {
        id: 2,
        name: "Blue Jay",
        date: "2026-07-14",
        notes: "Found this colorful jay nesting in the maple tree. Very active and foraging for acorns.",
        image: "http://localhost:5000/static/images/king_of_saxony.jpg",
        location: "Oakwood Park"
    }
];

const Journal = () => {
    const [sightings, setSightings] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBird, setNewBird] = useState("");
    const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
    const [newLocation, setNewLocation] = useState("");
    const [newNotes, setNewNotes] = useState("");
    const [newImage, setNewImage] = useState("");

    // Load sightings from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("avian_sightings");
        if (stored) {
            setSightings(JSON.parse(stored));
        } else {
            setSightings(DEFAULT_SIGHTINGS);
            localStorage.setItem("avian_sightings", JSON.stringify(DEFAULT_SIGHTINGS));
        }
    }, []);

    const saveSightings = (newItems) => {
        setSightings(newItems);
        localStorage.setItem("avian_sightings", JSON.stringify(newItems));
    };

    const handleAddSighting = (e) => {
        e.preventDefault();
        if (!newBird.trim()) return;

        const item = {
            id: Date.now(),
            name: newBird.trim(),
            date: newDate,
            location: newLocation.trim() || "Local Area",
            notes: newNotes.trim() || "Spotted in its natural habitat.",
            image: newImage.trim() || "http://localhost:5000/static/images/philippine_eagle.jpg"
        };

        const updated = [item, ...sightings];
        saveSightings(updated);
        
        // Reset form
        setNewBird("");
        setNewLocation("");
        setNewNotes("");
        setNewImage("");
        setShowAddForm(false);
    };

    const handleDeleteSighting = (id) => {
        if (window.confirm("Are you sure you want to delete this sighting from your journal?")) {
            const updated = sightings.filter(s => s.id !== id);
            saveSightings(updated);
        }
    };

    return (
        <div className="journal-section-container">
            <div className="journal-header-card">
                <h2>My Avian Journal</h2>
                <p>Keep a personal record of all the bird species you spot in the wild. Save new sightings locally with photos, locations, and custom notes.</p>
                <button className="add-sighting-btn" onClick={() => setShowAddForm(true)}>
                    <FaPlus /> Log New Sighting
                </button>
            </div>

            {showAddForm && (
                <div className="modal-backdrop">
                    <div className="form-modal-card">
                        <div className="modal-header">
                            <h3>Log New Bird Sighting</h3>
                            <button className="close-modal-btn" onClick={() => setShowAddForm(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleAddSighting} className="sighting-form">
                            <div className="form-group">
                                <label>Bird Species Name *</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="e.g. American Crow, Bald Eagle"
                                    value={newBird}
                                    onChange={(e) => setNewBird(e.target.value)}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date Spotted</label>
                                    <input 
                                        type="date" 
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location / Habitat</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Backyard, Oak Park"
                                        value={newLocation}
                                        onChange={(e) => setNewLocation(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Photo URL (Optional)</label>
                                <input 
                                    type="url" 
                                    placeholder="Paste image link, or leave blank for placeholder"
                                    value={newImage}
                                    onChange={(e) => setNewImage(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Sighting Notes / Description</label>
                                <textarea 
                                    rows="4" 
                                    placeholder="Describe its behavior, singing pattern, colors, etc..."
                                    value={newNotes}
                                    onChange={(e) => setNewNotes(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="submit-sighting-btn">
                                Save to Journal
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="journal-grid">
                {sightings.map((sighting) => (
                    <div key={sighting.id} className="journal-card">
                        <div className="journal-image-wrapper">
                            <img src={sighting.image} alt={sighting.name} className="journal-bird-img" />
                            <button 
                                className="delete-sighting-btn"
                                onClick={() => handleDeleteSighting(sighting.id)}
                                title="Delete from Journal"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        <div className="journal-content">
                            <div className="journal-card-header">
                                <h3 className="journal-bird-name">{sighting.name}</h3>
                                <div className="journal-date-tag">
                                    <FaCalendarAlt />
                                    <span>{sighting.date}</span>
                                </div>
                            </div>

                            <div className="journal-location-tag">
                                <FaMapMarkerAlt />
                                <span>{sighting.location}</span>
                            </div>

                            <p className="journal-notes">
                                <FaBook className="notes-icon" />
                                {sighting.notes}
                            </p>
                        </div>
                    </div>
                ))}

                {sightings.length === 0 && (
                    <div className="journal-empty-state">
                        <h3>Your journal is currently empty.</h3>
                        <p>Upload bird photos on the Home page and save them, or click "Log New Sighting" above to add one manually!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Journal;
