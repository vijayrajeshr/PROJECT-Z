// src/components/OfferCard.jsx

import React from 'react';

const OfferCard = ({ offers }) => {
    const offer = offers.filter(offer => offer.active);
    // Helper function to format dates
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleCodeClick = (code) => {
        navigator.clipboard.writeText(code)
            .then(() => {
                alert(`Coupon code "${code}" copied to clipboard!`);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy code. Please copy manually: ' + code);
            });
    };

    return (
        <div className="bg-white border-l-4 border-green-500 rounded-lg p-5 mb-5 shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 relative">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {offer.name === "code" && '💸 Flat ₹5 Off Your Entire Tiffin Order!'}
                {offer.name === "MealPlan" && '✨ Special Discount on Deluxe & Extra Kathod!'}
                {offer.name === "codePlan" && '🚀 Exclusive 5% Off on Select Meal Plans!'}
                {/* Fallback if name doesn't match predefined titles */}
                {!['code', 'MealPlan', 'codePlan'].includes(offer.name) && offer.name}
            </h3>

            <p className="text-gray-600 leading-relaxed mb-4">
                {offer.scope === "Tiffin-wide" && `Get a flat ₹${offer.discount} off on your entire Tiffin order. Limited time!`}
                {offer.scope === "MealType-specific" && `Get a flat ₹${offer.discount} off when you order our ${offer.mealTypes.map(mt => mt.label).join(' or ')} meal types.`}
                {offer.scope === "MealPlan-Specific" && `Enjoy an additional ${offer.discount}% discount on your favorite meal plans. Look out for eligible plans at checkout!`}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-3">
                <div
                    className="inline-block bg-orange-600 text-white px-4 py-2 rounded-md font-bold tracking-wide cursor-pointer select-all active:bg-orange-700"
                    onClick={() => handleCodeClick(offer.code)}
                    title="Click to copy"
                >
                    {offer.code}
                </div>
                <div className="text-sm text-gray-500 mt-2 sm:mt-0">
                    Expires: {formatDate(offer.endDate)}
                </div>
            </div>
        </div>
    );
};

export default OfferCard;