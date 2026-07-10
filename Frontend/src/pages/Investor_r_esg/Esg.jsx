import React from 'react';
import './Esg.css';
import Footer from '../../components/Footer/Footer';

const Esg = () => {
  return (
    <div className="esg-container bg-white">
      <h1 className="esg-title">Environmental, Social, and Governance (ESG) Commitment</h1>
      <p className="esg-description">
        At Zomato, we are dedicated to fostering sustainable growth and long-term value creation. Our ESG strategy is
        integrated across all business functions to promote environmental stewardship, social responsibility, and strong
        corporate governance. These principles are core to our mission of building a responsible and resilient food ecosystem.
      </p>

      <div className="esg-cards">
        {/* Environmental */}
        <div className="esg-card horizontal">
          <div className="esg-heading">
            <h2>🌱 Environmental Stewardship</h2>
          </div>
          <div className="esg-content">
            <ul>
              <li><strong>Transition to Electric Vehicles:</strong> Zomato is on track to achieve a 100% electric delivery fleet by 2027.</li>
              <li><strong>Net Zero Emissions by 2030:</strong> Carbon neutrality through renewable energy and verified offset programs.</li>
              <li><strong>Water Resource Management:</strong> Water-efficient systems and recycling initiatives in partner kitchens.</li>
              <li><strong>Sustainable Packaging:</strong> Phasing out single-use plastics with compostable alternatives.</li>
            </ul>
          </div>
        </div>

        {/* Social */}
        <div className="esg-card horizontal">
          <div className="esg-heading">
            <h2>🤝 Social Impact</h2>
          </div>
          <div className="esg-content">
            <ul>
              <li><strong>Inclusive Workforce:</strong> 35% women representation and focus on underrepresented communities.</li>
              <li><strong>Partner Welfare:</strong> Insurance, mental wellness, and safety programs for 300,000+ delivery partners.</li>
              <li><strong>Feeding India Initiative:</strong> 10+ million meals served in 2024 to tackle food insecurity.</li>
              <li><strong>Restaurant Enablement:</strong> Digital tools, loans, and workshops for small restaurant partners.</li>
            </ul>
          </div>
        </div>

        {/* Governance */}
        <div className="esg-card horizontal">
          <div className="esg-heading">
            <h2>🏛️ Corporate Governance</h2>
          </div>
          <div className="esg-content">
            <ul>
              <li><strong>Board ESG Oversight:</strong> Monitored by a board-level committee chaired by an independent director.</li>
              <li><strong>Data Ethics & Privacy:</strong> GDPR and ISO 27001-compliant systems with strong data governance.</li>
              <li><strong>Responsible Supply Chain:</strong> Ethical practices and sustainability mandated across suppliers.</li>
              <li><strong>Whistleblower Protection:</strong> Anonymous reporting with a no-retaliation policy.</li>
            </ul>
          </div>
        </div>
      </div>

     <div className="f"> <Footer /></div>
    </div>
  );
};

export default Esg;
