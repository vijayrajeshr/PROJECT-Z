import React, { useState } from "react";
import "./LanguageDropdown1.css";
import downArrow from '/icons/down-arrow.png';

const languages = [
    "English",
    "Türkçe",
    "हिंदी",
    "Português (BR)",
    "Indonesian",
    "Português (PT)",
    "Español",
    "Čeština",
    "Slovenčina",
    "Polish",
    "Italian",
    "Vietnamese",
];

const LanguageDropdown1 = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectLanguage = (language) => {
        console.log("Selected language:", language);
        setSelectedLanguage(language);
        setIsOpen(false);
    };

    return (
        <div className="language-selector">
            <button className="language-button" onClick={toggleDropdown}>
                <span>🌐</span>
                <span className="selected-language">{selectedLanguage}</span>
                <span className="arrow">
                    {!isOpen ? <img className="arrowimg" src={downArrow} alt="down Arrow" /> : <img className="arrowimg" style={{transform: 'rotate(180deg)'}} src={downArrow} alt="Down Arrow" />}
                </span>
            </button>
            {isOpen && (
                <div className="dropdown">
                    {languages.map((language, index) => (
                        <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => selectLanguage(language)}
                        >
                            {language}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageDropdown1;
