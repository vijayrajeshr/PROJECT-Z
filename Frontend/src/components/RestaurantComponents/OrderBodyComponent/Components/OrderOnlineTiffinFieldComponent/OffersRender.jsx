import React from 'react';

const MiniOfferMarquee = ({ offers }) => {
  const activeAndValidOffers = offers.filter((offer) => {
    const endDate = new Date(offer.endDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return offer.active && endDate >= currentDate;
  });

  if (activeAndValidOffers.length === 0) return null;

  // Combine all offers into a single string for marquee effect
  const marqueeText = activeAndValidOffers.map((offer) => {
    const discountValue = `${offer.discount}${offer.type === 'percentage' ? '%' : '$'}`;
    const mealTypeInfo =
      offer.scope === 'MealType-specific' && offer.mealTypes.length > 0
        ? ` on ${offer.mealTypes.map((mt) => mt.label).join(', ')}`
        : '';
    return `✨ ${offer.name}: Get ${discountValue} OFF${mealTypeInfo} [CODE: ${offer.code}]`;
  }).join('   •   '); // separator between offers

  return (
    <div className="w-full bg-yellow-50 py-1 border-b border-yellow-300 overflow-hidden mb-4">
      <div className="relative whitespace-nowrap">
        <div className="animate-marquee text-yellow-800 text-sm font-medium px-4">
          {marqueeText}
        </div>
      </div>
    </div>
  );
};

export default MiniOfferMarquee;
