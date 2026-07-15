import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaHeart, FaFilter } from 'react-icons/fa';
import './Search.css';

const BIRD_DATABASE = [
    {
        name: "Philippine Eagle",
        scientific: "Pithecophaga jefferyi",
        category: "Raptors",
        rarity: "Critically Endangered",
        habitat: "Tropical Rainforests",
        diet: "Monkeys, Lemurs, Snakes",
        lifespan: "30-40 years",
        origin: "Mindanao, Samar, Luzon",
        fact: "Also known as the monkey-eating eagle, it has a shaggy crest and blue-grey eyes, with a massive wingspan.",
        image: "http://localhost:5000/static/images/philippine_eagle.jpg"
    },
    {
        name: "Resplendent Quetzal",
        scientific: "Pharomachrus mocinno",
        category: "Forest Birds",
        rarity: "Near Threatened",
        habitat: "Cloud Forests",
        diet: "Wild Avocados, Fruits, Insects",
        lifespan: "10-15 years",
        origin: "Central America",
        fact: "Sacred to ancient Mayans, males grow twin tail feathers up to 3 feet long that stream behind them in flight.",
        image: "http://localhost:5000/static/images/resplendent_quetzal.jpg"
    },
    {
        name: "Kakapo",
        scientific: "Strigops habroptilus",
        category: "Parrots",
        rarity: "Critically Endangered",
        origin: "New Zealand",
        habitat: "Subalpine Scrublands",
        diet: "Seeds, Fruits, Plants",
        lifespan: "60-95 years",
        fact: "The world's only flightless parrot. Nocturnal and heavy, it emits a sweet, musty odor to find other birds.",
        image: "http://localhost:5000/static/images/kakapo.jpg"
    },
    {
        name: "Marvelous Spatuletail",
        scientific: "Loddigesia mirabilis",
        category: "Hummingbirds",
        rarity: "Endangered",
        origin: "Andes Mountains (Peru)",
        habitat: "Forest Edges & Scrub",
        diet: "Flower Nectar, Tiny Insects",
        lifespan: "3-5 years",
        fact: "Has only 4 tail feathers. The male's outer tail feathers end in large, brilliant-blue discs (spatules).",
        image: "http://localhost:5000/static/images/marvelous_spatuletail.jpg"
    },
    {
        name: "Ribbon-tailed Astrapia",
        scientific: "Astrapia mayeri",
        category: "Forest Birds",
        rarity: "Near Threatened",
        origin: "Papua New Guinea",
        habitat: "Montane Rainforests",
        diet: "Fruits, Frogs, Insects",
        lifespan: "15-20 years",
        fact: "Males have the longest tail feathers in relation to body size of any bird—over three times their body length.",
        image: "http://localhost:5000/static/images/ribbon_tailed_astrapia.jpg"
    },
    {
        name: "King of Saxony Bird-of-Paradise",
        scientific: "Pteridophora alberti",
        category: "Forest Birds",
        rarity: "Least Concern",
        origin: "New Guinea",
        habitat: "High Altitude Forests",
        diet: "Berries, Arthropods",
        lifespan: "10-15 years",
        fact: "Famous for its two long, bizarre, enamel-blue head plumes that it can move independently at will.",
        image: "http://localhost:5000/static/images/king_of_saxony.jpg"
    }
];

const CATEGORIES = ["All", "Raptors", "Forest Birds", "Parrots", "Hummingbirds"];

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [favorites, setFavorites] = useState({});

    const toggleFavorite = (index) => {
        setFavorites(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const filteredBirds = BIRD_DATABASE.filter(bird => {
        const matchesSearch = bird.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             bird.scientific.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             bird.origin.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || bird.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="search-container">
            <div className="wiki-search-box">
                <h2>Avian Wiki Catalog</h2>
                <p>Explore high-fidelity profiles of rare, endangered, and unique birds from across the globe.</p>
                
                <div className="search-bar-wrapper">
                    <FaSearch className="search-bar-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by name, scientific name, or region..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="wiki-search-input"
                    />
                </div>

                <div className="filter-chips">
                    <FaFilter className="filter-icon" />
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat} 
                            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="wiki-grid">
                {filteredBirds.map((bird, index) => {
                    const isFav = favorites[index];
                    return (
                        <div key={index} className="wiki-card">
                            <div className="wiki-image-wrapper">
                                <img src={bird.image} alt={bird.name} className="wiki-bird-image" />
                                <button 
                                    className={`fav-btn ${isFav ? 'fav-active' : ''}`}
                                    onClick={() => toggleFavorite(index)}
                                >
                                    <FaHeart />
                                </button>
                                <span className={`rarity-tag ${bird.rarity.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                                    {bird.rarity}
                                </span>
                            </div>

                            <div className="wiki-content">
                                <div className="wiki-header-row">
                                    <h3 className="wiki-name">{bird.name}</h3>
                                    <span className="wiki-category">{bird.category}</span>
                                </div>
                                <span className="wiki-scientific">{bird.scientific}</span>
                                
                                <div className="wiki-quick-facts">
                                    <div className="fact-item">
                                        <strong>Habitat:</strong> <span>{bird.habitat}</span>
                                    </div>
                                    <div className="fact-item">
                                        <strong>Diet:</strong> <span>{bird.diet}</span>
                                    </div>
                                    <div className="fact-item">
                                        <strong>Lifespan:</strong> <span>{bird.lifespan}</span>
                                    </div>
                                </div>

                                <p className="wiki-fact-box">
                                    <strong>Fascinating Fact:</strong> {bird.fact}
                                </p>

                                <div className="wiki-footer">
                                    <FaMapMarkerAlt className="map-marker" />
                                    <span className="wiki-location">{bird.origin}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredBirds.length === 0 && (
                    <div className="wiki-no-results">
                        <h3>No birds found matching your search.</h3>
                        <p>Try searching another keyword or clearing your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;