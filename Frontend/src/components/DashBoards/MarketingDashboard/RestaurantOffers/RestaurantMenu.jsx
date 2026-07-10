import { useEffect, useState } from "react";
import dummy from "../../../../data/dummy";
import RestaurantDetails from "./RestaurantDetails";

const RestaurantMenu = ({ SelectedRestaurant = [], offersList }) => { // Default to empty array
  const [restaurant, setRestaurant] = useState({ categories: [] });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [isSelectedRes, setIsSelectedRes] = useState(false);

  useEffect(() => {
    const mergeCategories = (restaurants) => {
      const categoryMap = new Map();
      (restaurants || []).forEach((r) => {
        (r.categories || []).forEach(category => {
          const existing = categoryMap.get(category.name) || new Set();
          category.items.forEach(item => existing.add(item));
          categoryMap.set(category.name, existing);
        });
      });
      return Array.from(categoryMap.entries()).map(([name, items]) => ({
        name,
        items: Array.from(items),
      }));
    };

    if (Array.isArray(SelectedRestaurant) && SelectedRestaurant.length > 0) {
      setRestaurant({
        name: SelectedRestaurant.map(r => r.name).join(', '),
        categories: mergeCategories(SelectedRestaurant)
      });
      setIsSelectedRes(true)
    } else {
      setRestaurant({
        name: "All Restaurants",
        categories: mergeCategories(dummy.restaurants)
      });
      setIsSelectedRes(false)
    }
  }, [SelectedRestaurant]);

  const displayedCategories = restaurant.categories;

  useEffect(() => {
    if (displayedCategories.length > 0) {
      setSelectedCategory(displayedCategories[0]);
    }
  }, [displayedCategories]);

  const handleCategorySelection = (category) => {
    const newSelectedItems = { ...selectedItems };
    const allItemsSelected = newSelectedItems[category.name]?.length === category.items.length;
    if (allItemsSelected) {
      delete newSelectedItems[category.name];
    } else {
      newSelectedItems[category.name] = [...category.items];
    }
    setSelectedItems(newSelectedItems);
  };

  const handleItemChange = (category, item) => {
    const newSelectedItems = { ...selectedItems };
    if (!newSelectedItems[category.name]) {
      newSelectedItems[category.name] = [];
    }
    if (newSelectedItems[category.name].includes(item)) {
      newSelectedItems[category.name] = newSelectedItems[category.name].filter(i => i !== item);
      if (newSelectedItems[category.name].length === 0) {
        delete newSelectedItems[category.name];
      }
    } else {
      newSelectedItems[category.name].push(item);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleCancel = () => {
    setSelectedItems({});
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
  };

  return (
    <div className="w-[70%] relative max-w-3xl mx-auto p-6 h-full shadow-md rounded-lg flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-2">
        <h2 className="text-2xl font-bold text-center">
          {/* {isSelectedRes ? `${restaurant.name} - Menu` : "Apply Offer on Menus"} */}
          Apply Offer on Menus
        </h2>
        <div>
          <label htmlFor="offers" className="text-lg mr-3">Select Offer:</label>
          <select name="offers" id="offers" className="p-1 rounded">
            <option value="" className="text-center">--Select--</option>
            {offersList.map((offer, offerIndex) => 
              (offer.status === "Active" || offer.status === "Upcoming") && (      // show only active and upcoming offers
                <option key={offerIndex} value={offer.name}>{offer.name}</option>
              )
            )}
          </select>
        </div>
      </div>

      {Array.isArray(SelectedRestaurant) && SelectedRestaurant.length === 1 && (
      <RestaurantDetails />
    )}

      {displayedCategories.length > 0 && (
        <div className="flex flex-1 min-h-0 w-full mt-4">
          {/* Left Panel - Categories */}
          <div className="w-1/3 border-r border-gray-300 px-4 overflow-y-auto">
            <ul className="space-y-2">
              {displayedCategories.map((category, index) => (
                <li
                  key={index}
                  className={`cursor-pointer p-2 rounded-md text-lg font-medium ${selectedCategory?.name === category.name
                      ? "bg-red-100 text-red-600 font-semibold"
                      : "text-gray-700"
                    }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.name} ({category.items.length})
                </li>
              ))}
            </ul>
          </div>

          {/* Right Panel - Items (Only shows selected category) */}
          <div className="w-2/3 px-4  overflow-y-auto">
            {selectedCategory && (
              <div className="">

                <div className="flex gap-2 items-center mb-4">

                    <input id="selectAll" 
                      type="checkbox"
                      className=""
                      checked={selectedItems[selectedCategory.name]?.length === selectedCategory.items.length}
                      onChange={() => handleCategorySelection(selectedCategory)}
                    />
                  <label htmlFor='selectAll' className="text-xl font-semibold">{selectedCategory.name}</label>
                </div>

                <ul className="text-gray-700 grid grid-cols-2 gap-2">
                  {selectedCategory.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-2">
                      <input
                      id={item}
                        type="checkbox"
                        checked={selectedItems[selectedCategory.name]?.includes(item)}
                        onChange={() => handleItemChange(selectedCategory, item)}
                      />
                      <label htmlFor={item}>{item}</label>
                    </div>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 mt-4">
        <button
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Edit
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={handleSave}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
        <button
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RestaurantMenu;