import React, { useState,useEffect,useRef} from 'react';
import './Popup.css'; // Import styles for the popup

const Popup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    specialInstructions: '',
  });
  const [locationOption, setLocationOption] = useState('current');
  const modalRef = useRef(null);

  // Close the modal if the user clicks outside of it
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (modalRef.current && !modalRef.current.contains(event.target)) {
              onClose();
          }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [onClose]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (e) => {
    setLocationOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // onSubmit(formData);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup" ref={modalRef}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Book Tiffin Service</h2>
        <p>Service: Mahadev</p>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone Number:
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>
          <div className="radio-group">
            <div className="radio-option">
            <label htmlFor="current-location">Current_Location</label>
              <input
                type="radio"
                name="locationOption"
                value="current"
                checked={locationOption === 'current'}
                onChange={handleLocationChange}
                id="current-location"
              />
             
            </div>
            <div className="radio-option">
            <label htmlFor="custom-address">Custom_Address</label>
              <input
                type="radio"
                name="locationOption"
                value="custom"
                checked={locationOption === 'custom'}
                onChange={handleLocationChange}
                id="custom-address"
              />
         
            </div>
          </div>
          {locationOption === 'custom' && (
            <label>
              Address:
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </label>
          )}
          <label>
            Special Instructions:
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Conform Booking</button>
        </form>
      </div>
    </div>
  );
};

export default Popup;