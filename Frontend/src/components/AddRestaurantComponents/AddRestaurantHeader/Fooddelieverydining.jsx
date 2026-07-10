import React, { useState } from "react";
import  css from "./Dining.module.css"; // Add your styles here

const Fooddeliverydining = () => {
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phoneNumber: "",
    location: "",
    area: "",
    city: "",
    referred: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
    alert("Registration submitted!");
  };

  return (
    <div className="registration-container">
      <div className="sidebar">
        <h3>Complete your registration</h3>
        <ul className="progress-list">
          <li className="active">Restaurant information</li>
          <li>Menu and operational details</li>
          <li>Restaurant documents</li>
          <li>Partner contract</li>
        </ul>
        <button className="documents-button">Documents required for registration</button>
      </div>

      <div className="form-content">
        <h1>Restaurant Information</h1>
        <form onSubmit={handleSubmit} className="dining-form">
          {/* Restaurant Name */}
          <div className="form-group">
            <label>Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              placeholder="Restaurant name"
              required
            />
          </div>

          {/* Owner Details */}
          <h2>Owner Details</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Full name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone number"
              required
            />
          </div>

          {/* Referral */}
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="referred"
                checked={formData.referred}
                onChange={handleChange}
              />
              Did someone refer you to this platform?
            </label>
          </div>

          <button type="submit" className="submit-button">
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default Fooddeliverydining;
