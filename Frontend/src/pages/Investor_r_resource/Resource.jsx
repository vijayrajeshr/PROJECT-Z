import React from 'react';
import './Resource.css';
import Footer from '../../components/Footer/Footer';

const resources = [
  {
    title: "Annual Report 2025",
    description: "Comprehensive overview of our financials, performance highlights, and strategic progress throughout FY25."
  },
  {
    title: "Q1 FY25 Earnings Presentation",
    description: "Investor briefing covering financial performance, key metrics, and market trends for the first quarter."
  },
  {
    title: "Regulatory Filings",
    description: "Latest submissions to regulatory authorities, including disclosures and compliance reports."
  },
  {
    title: "Shareholder FAQs",
    description: "Clear and concise answers to frequently asked questions from our shareholders and prospective investors."
  },
  {
    title: "Sustainability Report 2025",
    description: "Our environmental, social, and governance (ESG) commitments and initiatives over the past year."
  },
  {
    title: "Press Releases",
    description: "Stay informed with our latest announcements, news, and strategic updates."
  }
];

const Resource = () => {
  return (
    <div className="resource-container bg-white">
      <h1 className="resource-title">Investor Resources</h1>
      <p className="resource-subtitle">
        Access financial reports, presentations, and key updates to stay informed about our business.
      </p>
      <div className="resource-list">
        {resources.map((item, index) => (
          <div key={index} className="resource-card">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      <div className="f"><Footer /></div>
    </div>
  );
};

export default Resource;
