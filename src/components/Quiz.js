import React, { useState, useEffect, useCallback } from 'react';
import { FaCheck, FaTimes, FaTrophy, FaRedo, FaArrowRight, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import './Quiz.css';

// A list of 60 popular bird species from the 525-class classifier dataset
const BIRD_POOL = [
    "Bald Eagle", "American Crow", "Snowy Owl", "Peregrine Falcon", "Flamingo", 
    "Atlantic Puffin", "Emperor Penguin", "Barn Owl", "Red-tailed Hawk", "Blue Jay", 
    "Northern Cardinal", "Ruby-throated Hummingbird", "Great Blue Heron", "Mallard", 
    "Canada Goose", "Wild Turkey", "Golden Eagle", "Osprey", "Common Raven", 
    "Mourning Dove", "American Robin", "House Sparrow", "Tufted Titmouse", "Black-capped Chickadee",
    "Belted Kingfisher", "Pileated Woodpecker", "Great Horned Owl", "Harpy Eagle", "Scarlet Macaw",
    "Sulphur-crested Cockatoo", "Rainbow Lorikeet", "Toco Toucan", "Indian Peafowl", "Common Ostrich",
    "Emperor Goose", "Wood Duck", "American Goldfinch", "Red-winged Blackbird", "Brown Pelican",
    "California Condor", "Whooping Crane", "Ring-necked Pheasant", "Downy Woodpecker", "Peregrine Falcon",
    "Galah", "Cockatiel", "Budgerigar", "Atlantic Canary", "Zebra Finch", "Northern Mockingbird",
    "Eurasian Eagle-Owl", "Gyrfalcon", "Secretarybird", "Shoebill", "King Vulture", "Atlantic Puffin",
    "Kea", "Kakapo", "Little Blue Penguin", "Resplendent Quetzal"
];

const Quiz = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionData, setQuestionData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);

    // Shuffle helper
    const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    // Load next question in real-time from Wikipedia REST API
    const loadRealtimeQuestion = useCallback(async () => {
        setLoading(true);
        setQuestionData(null);
        
        let attempts = 0;
        while (attempts < 10) {
            attempts++;
            try {
                // 1. Pick a random correct bird
                const correctBird = BIRD_POOL[Math.floor(Math.random() * BIRD_POOL.length)];
                
                // 2. Query Wikipedia REST API for the summary (which contains image)
                const formattedName = correctBird.replace(/\s+/g, '_');
                const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${formattedName}`);
                
                // Check if page has a valid image
                if (response.data && response.data.originalimage && response.data.originalimage.source) {
                    const imageUrl = response.data.originalimage.source;
                    const extract = response.data.extract || "A unique bird species found in nature.";
                    
                    // 3. Generate 3 random distractors from BIRD_POOL
                    const distractors = BIRD_POOL.filter(b => b !== correctBird);
                    const chosenDistractors = shuffleArray(distractors).slice(0, 3);
                    
                    // 4. Combine and shuffle options
                    const options = shuffleArray([correctBird, ...chosenDistractors]);
                    
                    setQuestionData({
                        correctAnswer: correctBird,
                        image: imageUrl,
                        options: options,
                        fact: extract
                    });
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.warn("Retrying Wikipedia fetch due to error or missing image...");
            }
        }
        
        // Fallback if API fails repeatedly
        setQuestionData({
            correctAnswer: "Bald Eagle",
            image: "http://localhost:5000/static/images/philippine_eagle.jpg",
            options: ["Golden Eagle", "Bald Eagle", "Harpy Eagle", "Osprey"],
            fact: "The Bald Eagle is both the national bird and national animal of the United States of America."
        });
        setLoading(false);
    }, []);

    // Load first question on mount
    useEffect(() => {
        loadRealtimeQuestion();
    }, [loadRealtimeQuestion]);

    const handleOptionClick = (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);
        if (option === questionData.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        setSelectedOption(null);
        setIsAnswered(false);
        // We do 5 questions per quiz run
        if (currentQuestionIndex < 4) {
            setCurrentQuestionIndex(prev => prev + 1);
            loadRealtimeQuestion();
        } else {
            setShowResults(true);
        }
    };

    const handleRestartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
        loadRealtimeQuestion();
    };

    const getScoreMessage = () => {
        if (score === 5) return "Avian Mastermind! 100% correct!";
        if (score >= 4) return "Expert Bird Watcher! Brilliant score!";
        if (score >= 2) return "Ornithologist in training! Good try!";
        return "Keep exploring! The avian world has much to teach.";
    };

    return (
        <div className="quiz-section-container">
            <div className="quiz-header-card">
                <h2>Real-Time Avian Challenge</h2>
                <p>Test your knowledge on an infinite, dynamically generated quiz. All bird photos and facts are fetched in real-time from Wikipedia!</p>
            </div>

            {loading && (
                <div className="quiz-loading-card">
                    <FaSpinner className="quiz-spinner" />
                    <h3>Fetching Real-Time Avian Data...</h3>
                    <p>Connecting to Wikipedia API</p>
                </div>
            )}

            {!loading && questionData && !showResults && (
                <div className="quiz-play-card">
                    <div className="quiz-progress-bar-wrapper">
                        <div className="quiz-progress-text">
                            <span>Question {currentQuestionIndex + 1} of 5</span>
                            <span>Score: {score}</span>
                        </div>
                        <div className="quiz-progress-bar">
                            <div 
                                className="quiz-progress-fill" 
                                style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="quiz-body">
                        <div className="quiz-image-frame">
                            <img src={questionData.image} alt="Guess the bird" className="quiz-image" />
                        </div>

                        <div className="quiz-options-side">
                            <h3>Which species is this bird?</h3>
                            <div className="options-grid">
                                {questionData.options.map(option => {
                                    let btnClass = "";
                                    let icon = null;
                                    
                                    if (isAnswered) {
                                        if (option === questionData.correctAnswer) {
                                            btnClass = "correct-option";
                                            icon = <FaCheck className="option-icon" />;
                                        } else if (option === selectedOption) {
                                            btnClass = "wrong-option";
                                            icon = <FaTimes className="option-icon" />;
                                        } else {
                                            btnClass = "disabled-option";
                                        }
                                    } else {
                                        btnClass = "selectable-option";
                                    }

                                    return (
                                        <button 
                                            key={option} 
                                            className={`option-btn ${btnClass}`}
                                            onClick={() => handleOptionClick(option)}
                                            disabled={isAnswered}
                                        >
                                            <span>{option}</span>
                                            {icon}
                                        </button>
                                    );
                                })}
                            </div>

                            {isAnswered && (
                                <div className="quiz-fact-sheet">
                                    <h4>{selectedOption === questionData.correctAnswer ? "Correct!" : "Incorrect!"}</h4>
                                    <p>{questionData.fact}</p>
                                    
                                    <button className="quiz-next-btn" onClick={handleNextQuestion}>
                                        {currentQuestionIndex === 4 ? "View Results" : "Next Question"} <FaArrowRight />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showResults && (
                <div className="quiz-results-card">
                    <FaTrophy className="trophy-icon" />
                    <h2>Challenge Completed!</h2>
                    <div className="score-badge">
                        <span>{score} / 5 Correct</span>
                    </div>
                    <p className="score-message">{getScoreMessage()}</p>
                    
                    <button className="quiz-restart-btn" onClick={handleRestartQuiz}>
                        <FaRedo /> Try Another Challenge
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
