import React, { useState } from "react";

const Menu = () => {
  // Menu categories and their items
  const menuCategories = [
    {
      name: "Appetizers",
      count: 3,
      items: [
        { name: "Spring Rolls", orders: 5 },
        { name: "Garlic Bread", orders: 2 },
        { name: "Bruschetta", orders: 3 },
      ],
    },
    {
      name: "Main Course",
      count: 3,
      items: [
        { name: "Grilled Salmon", orders: 4 },
        { name: "Steak", orders: 7 },
        { name: "Pasta Alfredo", orders: 6 },
      ],
    },
    {
      name: "Desserts",
      count: 3,
      items: [
        { name: "Chocolate Cake", orders: 8 },
        { name: "Cheesecake", orders: 5 },
        { name: "Ice Cream Sundae", orders: 6 },
      ],
    },
  ];

  // State to keep track of selected category
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="p-4">
      {/* Display Menu Categories */}
      {menuCategories.map((category, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-white border rounded-lg p-4 mb-2 shadow-sm cursor-pointer"
          onClick={() =>
            setSelectedCategory(
              selectedCategory === category.name ? null : category.name
            )
          }
        >
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 rounded-full">
            {category.count}
          </div>
        </div>
      ))}

      {/* Display Items if a Category is Selected */}
      {selectedCategory && (
        <div className="mt-4 bg-gray-50 border rounded-lg p-4 shadow-sm">
          <h3 className="text-xl font-bold mb-2">{selectedCategory} Items</h3>
          <ul className="space-y-2">
            {menuCategories
              .find((category) => category.name === selectedCategory)
              .items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between bg-white p-3 rounded-lg shadow-sm"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500">{item.orders} Orders</span>
                </li>
              ))}
          </ul>

          {/* Total Orders */}
          <div className="mt-4 text-right">
            <h4 className="text-lg font-bold">
              Total Orders:{" "}
              {menuCategories
                .find((category) => category.name === selectedCategory)
                .items.reduce((total, item) => total + item.orders, 0)}
            </h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
