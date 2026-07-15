import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaTrophy, FaRedo, FaArrowRight } from 'react-icons/fa';
import './Quiz.css';

const QUIZ_QUESTIONS = [
    {
        correctAnswer: "Philippine Eagle",
        image: "http://localhost:5000/static/images/philippine_eagle.jpg",
        options: ["Golden Eagle", "Philippine Eagle", "Harpy Eagle", "Bald Eagle"],
        fact: "The Philippine Eagle is one of the largest and most critically endangered eagles. It has a massive wingspan and a signature shaggy crest."
    },
    {
        correctAnswer: "Resplendent Quetzal",
        image: "http://localhost:5000/static/images/resplendent_quetzal.jpg",
        options: ["Crimson Chat", "Rainbow Lorikeet", "Resplendent Quetzal", "Bee Eater"],
        fact: "The Resplendent Quetzal was considered sacred by ancient Mayans. Males grow spectacular twin tail feathers up to 3 feet long."
    },
    {
        correctAnswer: "Kakapo",
        image: "http://localhost:5000/static/images/kakapo.jpg",
        options: ["Kea Parrot", "Alexandrine Parakeet", "Sulphur-crested Cockatoo", "Kakapo"],
        fact: "The Kakapo is New Zealand's famous flightless, nocturnal parrot. It is the heaviest parrot in the world and can live up to 95 years."
    },
    {
        correctAnswer: "Marvelous Spatuletail",
        image: "http://localhost:5000/static/images/marvelous_spatuletail.jpg",
        options: ["Ruby-throated Hummingbird", "Marvelous Spatuletail", "Bee Hummingbird", "Sunbird"],
        fact: "The Marvelous Spatuletail hummingbird is unique for having only four tail feathers, two of which end in large blue spatula-like discs."
    },
    {
        correctAnswer: "Ribbon-tailed Astrapia",
        scientific: "Astrapia mayeri",
        image: "http://localhost:5000/static/images/ribbon_tailed_astrapia.jpg",
        options: ["Ribbon-tailed Astrapia", "Victoria Crowned Pigeon", "Great Blue Heron", "Superb Bird-of-Paradise"],
        fact: "Male Ribbon-tailed Astrapias have the longest tail feathers in relation to body size of any bird, growing up to three times their body length."
    },
    {
        correctAnswer: "King of Saxony Bird-of-Paradise",
        image: "http://localhost:5000/static/images/king_of_saxony.jpg",
        options: ["Wilson's Bird-of-Paradise", "Red-billed Tropicbird", "King of Saxony Bird-of-Paradise", "Greater Bird-of-Paradise"],
        fact: "The King of Saxony Bird-of-Paradise is famous for its two long, scalloped, enamel-blue head plumes that can be moved independently."
    }
];

const Quiz = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

    const handleOptionClick = (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);
        if (option === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        setSelectedOption(null);
        setIsAnswered(false);
        if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
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
    };

    const getScoreMessage = () => {
        const percentage = (score / QUIZ_QUESTIONS.length) * 100;
        if (percentage === 100) return "Master Ornithologist! Perfect score!";
        if (percentage >= 70) return "Avian Expert! Great job!";
        if (percentage >= 50) return "Bird Watcher! Keep practicing!";
        return "Novice Observer! Try again to learn more.";
    };

    return (
        <div className="quiz-section-container">
            <div className="quiz-header-card">
                <h2>Avian Identification Challenge</h2>
                <p>Test your knowledge of the world's rarest and most unique bird species. Identify the bird from the image to score points!</p>
            </div>

            {!showResults ? (
                <div className="quiz-play-card">
                    <div className="quiz-progress-bar-wrapper">
                        <div className="quiz-progress-text">
                            <span>Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                            <span>Score: {score}</span>
                        </div>
                        <div className="quiz-progress-bar">
                            <div 
                                className="quiz-progress-fill" 
                                style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="quiz-body">
                        <div className="quiz-image-frame">
                            <img src={currentQuestion.image} alt="Guess the bird" className="quiz-image" />
                        </div>

                        <div className="quiz-options-side">
                            <h3>Which species is this bird?</h3>
                            <div className="options-grid">
                                {currentQuestion.options.map(option => {
                                    let btnClass = "";
                                    let icon = null;
                                    
                                    if (isAnswered) {
                                        if (option === currentQuestion.correctAnswer) {
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
                                    <h4>{selectedOption === currentQuestion.correctAnswer ? "Correct!" : "Not Quite!"}</h4>
                                    <p>{currentQuestion.fact}</p>
                                    
                                    <button className="quiz-next-btn" onClick={handleNextQuestion}>
                                        {currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? "View Results" : "Next Question"} <FaArrowRight />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="quiz-results-card">
                    <FaTrophy className="trophy-icon" />
                    <h2>Challenge Completed!</h2>
                    <div className="score-badge">
                        <span>{score} / {QUIZ_QUESTIONS.length} Correct</span>
                    </div>
                    <p className="score-message">{getScoreMessage()}</p>
                    
                    <button className="quiz-restart-btn" onClick={handleRestartQuiz}>
                        <FaRedo /> Take Quiz Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
