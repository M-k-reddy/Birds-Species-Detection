import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Search.css';

const RARE_BIRDS = [
    {
        name: "Philippine Eagle",
        scientific: "Pithecophaga jefferyi",
        rarity: "Critically Endangered",
        origin: "Philippines",
        description: "One of the rarest, largest, and most powerful raptors in the world. It is endemic to the Philippine rainforests.",
        fact: "Also known as the 'Monkey-eating Eagle', it has a magnificent shaggy crest and blue-grey eyes.",
        image: "http://localhost:5000/static/images/philippine_eagle.jpg"
    },
    {
        name: "Resplendent Quetzal",
        scientific: "Pharomachrus mocinno",
        rarity: "Near Threatened",
        origin: "Central America",
        description: "A magnificently colored bird in the trogon family, sacred to the ancient Mayans and Aztecs.",
        fact: "The males grow twin tail feathers up to three feet long that stream gracefully behind them in flight.",
        image: "http://localhost:5000/static/images/resplendent_quetzal.jpg"
    },
    {
        name: "Kakapo",
        scientific: "Strigops habroptilus",
        rarity: "Critically Endangered",
        origin: "New Zealand",
        description: "The world's only flightless, nocturnal parrot. It is famous for its moss-green plumage and friendly behavior.",
        fact: "It is exceptionally heavy and has a sweet, musty odor that helps it find other kakapos in the dark.",
        image: "http://localhost:5000/static/images/kakapo.jpg"
    },
    {
        name: "Marvelous Spatuletail",
        scientific: "Loddigesia mirabilis",
        rarity: "Endangered",
        origin: "Peru",
        description: "An exquisite hummingbird with only four tail feathers, endemic to a tiny region of the Andes.",
        fact: "The male's outer tail feathers end in large, brilliant-blue discs (spatules) which he webs to attract mates.",
        image: "http://localhost:5000/static/images/marvelous_spatuletail.jpg"
    },
    {
        name: "Ribbon-tailed Astrapia",
        scientific: "Astrapia mayeri",
        rarity: "Near Threatened",
        origin: "Papua New Guinea",
        description: "A spectacular bird-of-paradise endemic to the subalpine forests of the central highlands.",
        fact: "Males have the longest tail feathers in relation to body size of any bird—over three times their body length.",
        image: "http://localhost:5000/static/images/ribbon_tailed_astrapia.jpg"
    },
    {
        name: "King of Saxony Bird-of-Paradise",
        scientific: "Pteridophora alberti",
        rarity: "Least Concern (Highly Elusive)",
        origin: "New Guinea",
        description: "A bizarre bird-of-paradise famous for its long, enamel-blue head plumes.",
        fact: "The male has two scalloped head plumes that are twice as long as its body and can be moved independently.",
        image: "http://localhost:5000/static/images/king_of_saxony.jpg"
    }
];

const Search = () => {
    const [revealed, setRevealed] = useState({});

    const toggleReveal = (index) => {
        setRevealed(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="search-container">
            <div className="search-header-card">
                <h2>Rare Avian Secrets</h2>
                <p>Welcome to the Mystery Bird Album. Below are some of the rarest and most elusive bird species on Earth. Can you guess their names based on their appearance? Click a card to reveal their identity and secrets!</p>
            </div>
            
            <div className="album-grid">
                {RARE_BIRDS.map((bird, index) => {
                    const isRevealed = revealed[index];
                    return (
                        <div key={index} className={`album-card ${isRevealed ? 'revealed' : ''}`}>
                            <div className="card-image-wrapper">
                                <img src={bird.image} alt="Mystery Rare Bird" className="bird-image" />
                                {!isRevealed && (
                                    <div className="card-mystery-overlay">
                                        <span className="mystery-badge">Endangered / Rare</span>
                                        <button className="reveal-btn" onClick={() => toggleReveal(index)}>
                                            <FaEye className="eye-icon" /> Reveal Species
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className={`card-content ${!isRevealed ? 'blurred' : ''}`}>
                                <div className="card-header-row">
                                    <h3 className="bird-name">{isRevealed ? bird.name : "????? ?????"}</h3>
                                    <span className="bird-origin">{bird.origin}</span>
                                </div>
                                <span className="bird-scientific">{isRevealed ? bird.scientific : "Genus species"}</span>
                                <span className={`rarity-badge ${bird.rarity.toLowerCase().replace(' ', '-')}`}>
                                    {bird.rarity}
                                </span>
                                <p className="bird-description">{bird.description}</p>
                                <div className="bird-fact">
                                    <strong>Avian Fact:</strong> {bird.fact}
                                </div>
                                {isRevealed && (
                                    <button className="hide-btn" onClick={() => toggleReveal(index)}>
                                        <FaEyeSlash /> Hide Identity
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Search;