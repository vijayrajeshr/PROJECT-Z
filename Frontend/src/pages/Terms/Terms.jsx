import React, { useState, useEffect } from 'react';
import styles from './Terms.module.css';

const Terms = () => {
  const [termsData, setTermsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTerms, setFilteredTerms] = useState([]);

  // Simulate fetching data from an API
  useEffect(() => {
    // Replace this with an actual API call if needed
    const fetchTerms = async () => {
      const data = [
        {
          id: 1,
          title: 'Acceptance of Terms',
          content:
            'By accessing or using our services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.',
        },
        {
          id: 2,
          title: 'User Responsibilities',
          content:
            'You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account.',
        },
        {
          id: 3,
          title: 'Service Modifications',
          content:
            'We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice.',
        },
        {
          id: 4,
          title: 'Privacy Policy',
          content:
            'Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your information.',
        },
        {
          id: 5,
          title: 'Limitation of Liability',
          content:
            'In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or use.',
        },
      ];
      setTermsData(data);
      setFilteredTerms(data); // Initialize filtered terms with all data
    };

    fetchTerms();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = termsData.filter(
      (term) =>
        term.title.toLowerCase().includes(query) ||
        term.content.toLowerCase().includes(query)
    );
    setFilteredTerms(filtered);
  };

  // Highlight searched text
  const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className={styles.highlight}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Toggle section visibility
  const toggleSection = (id) => {
    setFilteredTerms((prevTerms) =>
      prevTerms.map((term) =>
        term.id === id ? { ...term, isOpen: !term.isOpen } : term
      )
    );
  };

  return (
    <div className={styles.termsContainer}>
      <h1 className={styles.termsTitle}>Terms and Conditions</h1>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search terms..."
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      {/* Terms Content */}
      <div className={styles.termsContent}>
        {filteredTerms.length > 0 ? (
          filteredTerms.map((term) => (
            <div key={term.id} className={styles.termSection}>
              <h2
                className={styles.termTitle}
                onClick={() => toggleSection(term.id)}
              >
                {highlightText(term.title, searchQuery)}
                <span className={styles.toggleIcon}>
                  {term.isOpen ? '▼' : '▶'}
                </span>
              </h2>
              {term.isOpen && (
                <p className={styles.termText}>
                  {highlightText(term.content, searchQuery)}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className={styles.noResults}>No terms found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default Terms;