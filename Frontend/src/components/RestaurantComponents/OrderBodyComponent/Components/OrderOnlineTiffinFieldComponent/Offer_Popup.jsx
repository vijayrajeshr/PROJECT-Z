import React, { useState, useEffect } from 'react';
import { FaTimes, FaTag, FaInfoCircle } from 'react-icons/fa';
import './OfferPopup.css';

const OfferPopup = ({ offers, onClose, applyOffer, isOpen, mealTypes, planTypes }) => {
    const [offerCode, setOfferCode] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    console.log(offers)
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const getOfferScopeDetails = (offer) => {
        const applicableMeals = offer.mealPlans.map(mealTypeId => mealTypeId)

        // console.log("Applicable", applicableMeals)
        switch (offer.scope) {
            case 'Tiffin-wide':
                return {
                    label: 'Valid on all orders',
                    details: null
                };
            case 'MealType-specific':
                const applicableMeals = offer.mealTypes.map(selectedMealType => {
                    const mealType = mealTypes.find(m => m.mealTypeId === selectedMealType.mealTypeId);
                    return mealType ? mealType.label : '';
                }).filter(Boolean);
                return {
                    label: 'Valid on specific meal types',
                    details: applicableMeals.join(', ')
                };
            case 'MealPlan-Specific':
                const applicablePlans = offer.mealPlans.map(selectedPlan => {
                    const plan = planTypes.find(p => p._id === selectedPlan);
                    return plan ? plan.label : '';
                }).filter(Boolean);
                return {
                    label: 'Valid on specific plans',
                    details: applicablePlans.join(' days, ') + ' days'
                };
            default:
                return {
                    label: 'Valid on all orders',
                    details: null
                };
        }
    };

    return (
        <div className={`offer-popup ${isVisible ? 'open' : ''}`}>
            <div className="offer-popup-header">
                <div className="offer-title">
                    <FaTag className="offer-icon" />
                    <h2>Available Offers</h2>
                </div>
                <FaTimes className="close-icon" onClick={handleClose} />
            </div>

            <div className="offer-search">
                <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={offerCode}
                    onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                    className="offer-input"
                />
                <button onClick={() => applyOffer(offerCode)} className="apply-button">
                    Apply
                </button>
            </div>

            <div className="offers-container">
                {offers.map((offer, index) => {
                    const scopeDetails = getOfferScopeDetails(offer);
                    return (
                        <div key={index} className="offer-card">
                            <div className="offer-card-header">
                                <span className="offer-tag">
                                    {offer.type === "percentage" ? "%" : "₹"}
                                </span>
                                <div>
                                    <h3>{offer.name}</h3>
                                    <p className="offer-discount">
                                        {offer.type === "percentage"
                                            ? `Get ${offer.discount}% off`
                                            : `Flat ₹${offer.discount} off`}
                                    </p>
                                </div>
                            </div>

                            <div className="offer-details">
                                <div className="offer-scope">
                                    <FaInfoCircle className="scope-icon" />
                                    <div className="scope-info">
                                        <p className="scope-label">{scopeDetails.label}</p>
                                        {scopeDetails.details && (
                                            <p className="scope-specifics">{scopeDetails.details}</p>
                                        )}
                                    </div>
                                </div>
                                <p className="offer-code">Use code: <span>{offer.code}</span></p>
                                <button
                                    onClick={() => applyOffer(offer.code)}
                                    className="apply-offer-btn"
                                >
                                    Apply Offer
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OfferPopup;