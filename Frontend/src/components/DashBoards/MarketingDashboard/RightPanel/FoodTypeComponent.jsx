import React from 'react';

const FoodTypeComponent = ({ isEditMode, selectedType, onTypeChange }) => {
  const foodTypes = ['Veg', 'Non-Veg', 'Egg'];

  return (
    <div className="mb-4">
      <label className="block text-gray-600 text-sm mb-2">Food Type</label>
      <div className="flex gap-4">
        {foodTypes.map((type) => (
          <button
            key={type}
            onClick={() => isEditMode && onTypeChange(type)}
            className={`px-4 py-2 rounded-md ${
              selectedType === type
                ? type === 'Veg'
                  ? 'bg-green-100 text-green-700'
                  : type === 'Non-Veg'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100'
            }`}
            disabled={!isEditMode}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FoodTypeComponent;
