import React, { useState } from 'react';
import styles from './CountryDropdown.module.css';
import downArrow from '/icons/down-arrow.png';

const CountryDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState({
    name: 'India',
    flag: '🇮🇳'
  });

  const countries = [
    { name: 'India', flag: '🇮🇳' },
    { name: 'UAE', flag: '🇦🇪' }
  ];

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev)
  }

  const handleSelectRegion = (country) => {
    setSelectedRegion(country)
    setShowDropdown(false)
  }

  return (
    <div className={styles['region-selector']}>
      <button className={styles.button} onClick={toggleDropdown}>
        <span>{selectedRegion.flag}</span>
        {selectedRegion.name}
        {!showDropdown ? (
        <img className={styles.downArrow} src={downArrow} alt="downarrow" />
        ) : (
        <img className={styles.downArrow} style={{transform: 'rotate(180deg)'}} src={downArrow} alt="downarrow" />
        )
      }
      </button>

      {showDropdown && (
        <div className={styles.dropdown}>
          {countries.map((country) => (
            <div
              key={country.name}
              className={styles['country-item']}
              onClick={() => handleSelectRegion(country)}
            >
              <span>{country.flag}</span>
              {country.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountryDropdown;
