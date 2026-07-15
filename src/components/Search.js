import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaHeart, FaSpinner, FaBookOpen } from 'react-icons/fa';
import axios from 'axios';
import './Search.css';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState({});

    const toggleFavorite = (title) => {
        setFavorites(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearchResults([]);

        try {
            // Step 1: Query Wikipedia Search API for matching bird pages
            // Append "bird" to the query to ensure search returns avian species
            const searchQueryStr = searchQuery.toLowerCase().includes("bird") ? searchQuery : `${searchQuery} bird`;
            const searchResponse = await axios.get(`https://en.wikipedia.org/w/api.php`, {
                params: {
                    action: 'query',
                    list: 'search',
                    srsearch: searchQueryStr,
                    utf8: 1,
                    format: 'json',
                    origin: '*'
                }
            });

            const searchItems = searchResponse.data?.query?.search || [];
            if (searchItems.length === 0) {
                setSearchResults([]);
                setLoading(false);
                return;
            }

            // Step 2: Fetch summaries for the top 5 pages in parallel
            const summaryPromises = searchItems.slice(0, 5).map(async (item) => {
                try {
                    const pageTitle = item.title.replace(/\s+/g, '_');
                    const summaryResponse = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${pageTitle}`);
                    const data = summaryResponse.data;
                    
                    // We only want pages that have a valid thumbnail or image to show
                    if (data && data.originalimage && data.originalimage.source) {
                        return {
                            title: data.title,
                            displayTitle: data.displaytitle || data.title,
                            description: data.description || "Bird species",
                            extract: data.extract,
                            image: data.originalimage.source,
                            url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${pageTitle}`
                        };
                    }
                } catch (err) {
                    return null; // Ignore failed individual fetches
                }
                return null;
            });

            const results = await Promise.all(summaryPromises);
            // Filter out null responses
            const finalResults = results.filter(r => r !== null);
            setSearchResults(finalResults);

        } catch (error) {
            console.error("Error fetching real-time search results:", error);
            alert("Failed to fetch search results. Please check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container">
            <div className="wiki-search-box">
                <h2>Real-Time Avian Search Engine</h2>
                <p>Search for any bird species on Earth. The search engine queries Wikipedia dynamically in real-time to fetch photos, facts, and scientific descriptions.</p>
                
                <form onSubmit={handleSearchSubmit} className="search-bar-wrapper">
                    <FaSearch className="search-bar-icon" />
                    <input 
                        type="text" 
                        placeholder="Type a bird species (e.g. Eagle, Falcon, Owl, Hummingbird)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="wiki-search-input"
                    />
                    <button type="submit" className="wiki-search-btn">Search</button>
                </form>
            </div>

            {loading && (
                <div className="wiki-loading-state">
                    <FaSpinner className="wiki-spinner-icon" />
                    <h3>Searching Avian Databases...</h3>
                    <p>Fetching real-time species profiles & images</p>
                </div>
            )}

            {!loading && (
                <div className="wiki-grid">
                    {searchResults.map((bird, index) => {
                        const isFav = favorites[bird.title];
                        return (
                            <div key={index} className="wiki-card">
                                <div className="wiki-image-wrapper">
                                    <img src={bird.image} alt={bird.title} className="wiki-bird-image" />
                                    <button 
                                        className={`fav-btn ${isFav ? 'fav-active' : ''}`}
                                        onClick={() => toggleFavorite(bird.title)}
                                    >
                                        <FaHeart />
                                    </button>
                                </div>

                                <div className="wiki-content">
                                    <div className="wiki-header-row">
                                        <h3 className="wiki-name" dangerouslySetInnerHTML={{ __html: bird.displayTitle }}></h3>
                                    </div>
                                    <span className="wiki-scientific">{bird.description}</span>
                                    
                                    <p className="wiki-description-text">
                                        {bird.extract}
                                    </p>

                                    <div className="wiki-footer">
                                        <a href={bird.url} target="_blank" rel="noopener noreferrer" className="wiki-learn-more-link">
                                            <FaBookOpen /> Learn more on Wikipedia
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {searchResults.length === 0 && !loading && searchQuery && (
                        <div className="wiki-no-results">
                            <h3>No real-time results found for "{searchQuery}"</h3>
                            <p>Try searching another bird name or checking your spelling.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;