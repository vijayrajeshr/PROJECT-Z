import React from 'react';
import './Governance.css';
import Footer from '../../components/Footer/Footer';
import { motion } from 'framer-motion';

const Governance = () => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.2 }
    })
  };

  const sections = [
    {
      title: 'Board of Directors',
      description: 'Our experienced board drives long-term value and sustainability.'
    },
    {
      title: 'Audit & Risk Committee',
      description: 'Responsible for overseeing financial integrity and risk control.'
    },
    {
      title: 'Code of Ethics',
      description: 'Defines integrity, respect, and accountability across operations.'
    },
    {
      title: 'Whistleblower Policy',
      description: 'Encourages safe reporting of misconduct without fear of retaliation.'
    },
    {
      title: 'ESG Practices',
      description: 'Our commitment to environmental, social, and governance sustainability.'
    },
    {
      title: 'Investor Transparency',
      description: 'Open and timely communication with stakeholders and investors.'
    }
  ];

  return (
    <div className="governance-container bg-white">
      <h1 className="governance-title">Corporate Governance</h1>
      <p className="governance-description">
        At Zomato, we adhere to the highest standards of corporate governance, ensuring transparency, fairness,
        and ethical decision-making at all levels of our organization.
      </p>

      <div className="governance-sections">
        {sections.map((section, index) => (
          <motion.div
            className="governance-card"
            key={index}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </motion.div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Governance;
