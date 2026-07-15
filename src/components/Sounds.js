import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import './Sounds.css';

const BIRD_CALLS = [
    {
        name: "American Crow",
        scientific: "Corvus brachyrhynchos",
        type: "Alarm / Contact Call",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Corvus_brachyrhynchos_-_American_Crow_call_-_XC147572.mp3",
        description: "The classic harsh 'caw-caw' sound. Crows use these calls to communicate locations, alert others to predators, or defend territory.",
        pitch: "Low-Medium (1 - 2 kHz)",
        pattern: "Repeated, short rhythmic bursts"
    },
    {
        name: "Bald Eagle",
        scientific: "Haliaeetus leucocephalus",
        type: "Chittering / Screaming Call",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/da/Haliaeetus_leucocephalus_-_Bald_Eagle_calls_-_XC306346.mp3",
        description: "Surprisingly high-pitched, weak, and chirping for such a massive bird. Often sounds like a series of whistles or staccato chirps.",
        pitch: "High (3 - 4 kHz)",
        pattern: "Rapid, descending series of whistles"
    },
    {
        name: "Great Horned Owl",
        scientific: "Bubo virginianus",
        type: "Territorial Hooting",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Bubo_virginianus_-_Great_Horned_Owl_call_-_XC441235.mp3",
        description: "A deep, resonant, and classic hoot: 'hoo-hoo-hoo, hoo-hoo'. Audible from long distances in forests.",
        pitch: "Very Low (200 - 400 Hz)",
        pattern: "Deep, spaced-out, rhythmic hoots"
    },
    {
        name: "Common Nightingale",
        scientific: "Luscinia megarhynchos",
        type: "Melodious Song",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Luscinia_megarhynchos_-_Common_Nightingale_song_-_XC276326.mp3",
        description: "One of the most beautiful and complex bird songs, featuring rich whistles, warbles, and rapid trills. Sung both day and night.",
        pitch: "Varied (1.5 - 6 kHz)",
        pattern: "Complex, continuous melodic variations"
    },
    {
        name: "European Robin",
        scientific: "Erithacus rubecula",
        type: "High Warbling Song",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Erithacus_rubecula_-_European_Robin_song_-_XC452932.mp3",
        description: "A sweet, high-pitched, silvery warble. It is a highly territorial song, used to mark nesting sites.",
        pitch: "High (2 - 7 kHz)",
        pattern: "Liquid, whistling phrases with pauses"
    }
];

const Sounds = () => {
    const [playingIndex, setPlayingIndex] = useState(null);
    const audioRef = useRef(null);

    const handlePlayPause = (index) => {
        if (playingIndex === index) {
            audioRef.current.pause();
            setPlayingIndex(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setPlayingIndex(index);
            audioRef.current = new Audio(BIRD_CALLS[index].audioUrl);
            audioRef.current.play().catch(err => {
                console.error("Audio playback error:", err);
                alert("Failed to load bird call audio. Please make sure you have internet access.");
                setPlayingIndex(null);
            });
            audioRef.current.onended = () => {
                setPlayingIndex(null);
            };
        }
    };

    // Clean up audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    return (
        <div className="sounds-section-container">
            <div className="sounds-header-card">
                <h2>Avian Acoustics Gallery</h2>
                <p>Listen to real bird calls and songs. Tap play to trigger calls and view the audio visualizer representation.</p>
            </div>

            <div className="sounds-grid">
                {BIRD_CALLS.map((call, index) => {
                    const isPlaying = playingIndex === index;
                    return (
                        <div key={index} className={`sound-card ${isPlaying ? 'playing' : ''}`}>
                            <div className="sound-card-left">
                                <button 
                                    className={`play-circle-btn ${isPlaying ? 'playing-btn' : ''}`}
                                    onClick={() => handlePlayPause(index)}
                                >
                                    {isPlaying ? <FaPause className="sound-icon" /> : <FaPlay className="sound-icon" />}
                                </button>
                                
                                {isPlaying && (
                                    <div className="visualizer-wave">
                                        <span className="wave-bar bar-1"></span>
                                        <span className="wave-bar bar-2"></span>
                                        <span className="wave-bar bar-3"></span>
                                        <span className="wave-bar bar-4"></span>
                                        <span className="wave-bar bar-5"></span>
                                    </div>
                                )}
                            </div>

                            <div className="sound-card-right">
                                <div className="sound-header">
                                    <h3 className="sound-bird-name">{call.name}</h3>
                                    <span className="sound-call-type">{call.type}</span>
                                </div>
                                <span className="sound-scientific">{call.scientific}</span>
                                <p className="sound-description">{call.description}</p>
                                
                                <div className="sound-metrics">
                                    <div className="metric-tag">
                                        <FaVolumeUp className="metric-icon" />
                                        <strong>Pitch:</strong> {call.pitch}
                                    </div>
                                    <div className="metric-tag">
                                        <strong>Pattern:</strong> {call.pattern}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Sounds;
