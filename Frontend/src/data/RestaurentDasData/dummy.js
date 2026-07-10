export default {
  deliveryCategories: [
    {
      name: "Starters",
      subcategories: [
        {
          name: "Veg Starters",
          items: [
            {
              id: 1,
              name: "Paneer Tikka",
              type: "Veg",
              category: "Starters",
              subCategory: "Veg Starters",
              offer: "10% Off",
              serviceType: ["Delivery", "Takeaway"],
              pricing: 250,
              taxes: "5% GST",
              charges: "No Extra Charge",
              description:
                "Soft paneer marinated in spices and grilled to perfection.",
              dishDetails: {
                servingInfo: "1 Person",
                calorieCount: "250 kcal",
                portionSize: "Small",
                preparationTime: "15 mins",
              },
              images: ["https://via.placeholder.com/150"],
              video: null,
            },
            {
              id: 2,
              name: "Veg Spring Rolls",
              type: "Veg",
              category: "Starters",
              subCategory: "Veg Starters",
              offer: "No Offer",
              serviceType: ["Delivery"],
              pricing: 200,

              taxes: "5% GST",
              
              charges: "No Extra Charge",
              description: "Crispy rolls stuffed with fresh vegetables.",
              dishDetails: {
                servingInfo: "2 persons",
                calorieCount: "300 kcal",
                portionSize: "Medium",
                preparationTime: "20 mins",
              },
              images: ["https://via.placeholder.com/150"],
              video: null,
            },
          ],
        },
        {
          name: "Non-Veg Starters",
          items: [
            {
              id: 5,
              name: "Chicken Tikka",
              type: "Non-Veg",
              category: "Starters",
              subCategory: "Non-Veg Starters",
              offer: "No Offer",
              serviceType: ["Delivery"],
              pricing: 300,
              taxes: "5% GST",
              charges: "No Extra Charge",
              description:
                "Spiced and marinated chicken grilled to perfection.",
              dishDetails: {
                servingInfo: "4 person",
                calorieCount: "350 kcal",
                portionSize: "Large",
                preparationTime: "20 mins",
              },
              images: ["https://via.placeholder.com/150"],
              video: null,
            },
            {
              id: 6,
              name: "Tandoori Wings",
              type: "Non-Veg",
              category: "Starters",
              subCategory: "Non-Veg Starters",
              offer: "10% Off",
              serviceType: ["Delivery", "Takeaway"],
              pricing: 280,
              taxes: "5% GST",
              charges: "No Extra Charge",
              description:
                "Juicy wings marinated in tandoori spices and grilled in the clay oven.",
              dishDetails: {
                servingInfo: "4 person",
                calorieCount: "400 kcal",
                portionSize: "Large",
                preparationTime: "25 mins",
              },
              images: ["https://via.placeholder.com/150"],
              video: null,
            },
          ],
        },
      ],
    },
    {
      name: "Main Course",
      subcategories: [
        {
          name: "Non-Veg Main Course",
          items: [
            {
              id: 3,
              name: "Butter Chicken",
              type: "Non-Veg",
              category: "Main Course",
              subCategory: "Non-Veg Main Course",
              offer: "20% Off",
              serviceType: ["Takeaway"],
              pricing: 350,
              taxes: "5% GST",
              charges: "No Extra Charge",
              description: "Tender chicken cooked in creamy butter sauce.",
              dishDetails: {
                servingInfo: "4 person",
                calorieCount: "400 kcal",
                portionSize: "Large",
                preparationTime: "25 mins",
              },
              images: ["https://via.placeholder.com/150"],
              video: null,
            },
          ],
        },
        {
          name: "Veg Main Course",
          items: [
            {
              id: 7,
              name: "Paneer Butter Masala",
              type: "Veg",
              category: "Main Course",
              subCategory: "Veg Main Course",
              offer: "No Offer",
              serviceType: ["Delivery", "Takeaway"],
              pricing: 320,
              taxes: "5% GST",
              charges: "No Extra Charge",
              description: "Creamy tomato-based gravy with soft paneer cubes.",
              dishDetails: {
                servingInfo: "4 person",
                calorieCount: "380 kcal",
                portionSize: "Large",
                preparationTime: "20 mins",
              },
              images: ["https://via.placeholder.com/150"],
              video: null,
            },
            {
              id: 8,
              name: "Dal Makhani",
              type: "Veg",
              category: "Main Course",
              subCategory: "Veg Main Course",
              offer: "10% Off",
              serviceType: ["Delivery"],
              pricing: 260,
              taxes: "5% GST",
              charges: "No Extra Charge",
              description: "Slow-cooked lentils in a buttery, creamy sauce.",
              dishDetails: {
                servingInfo: "1 person",
                calorieCount: "300 kcal",
                portionSize: "Small",
                preparationTime: "25 mins",
              },
              images: ["https://via.placeholder.com/150"],
              video: null,
            },
          ],
        },
      ],
    },
  ],
  dineInCategories: [
    {
      name: "Appetizers",
      subcategories: [
        {
          name: "Veg Appetizers",
          items: [
            {
              id: 4,
              name: "Hara Bhara Kebab",
              type: "Veg",
              category: "Appetizers",
              subCategory: "Veg Appetizers",
              offer: "No Offer",
              serviceType: ["Dine-In"],
              pricing: 180,
              taxes: "5% GST",
              charges: "No Extra Charge",
              description: "Delicious kebabs made from spinach and peas.",
              dishDetails: {
                servingInfo: "4 person",
                calorieCount: "150 kcal",
                portionSize: "Large",
                preparationTime: "15 mins",
              },
              images: ["https://via.placeholder.com/150"],
              video: null,
            },
          ],
        },
        {
          name: "Non-Veg Appetizers",
          items: [
            {
              id: 9,
              name: "Chicken Lollipop",
              type: "Non-Veg",
              category: "Appetizers",
              subCategory: "Non-Veg Appetizers",
              offer: "No Offer",
              serviceType: ["Dine-In"],
              pricing: 220,
              taxes: "5% GST",
              charges: "No Extra Charge",
              description:
                "Chicken wings shaped like a lollipop and fried crisp.",
              dishDetails: {
                servingInfo: "2 person",
                calorieCount: "320 kcal",
                portionSize: "Medium",
                preparationTime: "15 mins",
              },
              images: ["https://via.placeholder.com/150"],
              video: null,
            },
            {
              id: 10,
              name: "Mutton Seekh Kebab",
              type: "Non-Veg",
              category: "Appetizers",
              subCategory: "Non-Veg Appetizers",
              offer: "20% Off",
              serviceType: ["Dine-In", "Takeaway"],
              pricing: 330,
              taxes: "5% GST",
              charges: "No Extra Charge",
              description: "Spicy ground mutton skewers cooked on a grill.",
              dishDetails: {
                servingInfo: "4 person",
                calorieCount: "450 kcal",
                portionSize: "Large",
                preparationTime: "25 mins",
              },
              images: ["https://via.placeholder.com/150"],
              video: null,
            },
          ],
        },
      ],
    },
  ],
  dropdownOptions: {
    categories: [
      "Starters",
      "Main Course",
      "Snacks",
      "Soups & Salads",
      "Breads",
      "Beverages",
    ],
    subCategories: [
      "Veg Starters",
      "Non-Veg Starters",
      "Veg Main Course",
      "Non-Veg Main Course",
    ],
    offers: ["No Offer", "10% Off", "20% Off"],
    foodTypes: ["Veg", "Non-Veg", "Egg"],
    serviceTypes: ["Delivery", "Takeaway"],
  },
};

export const dummyData = {
  notifications: [
    { id: 1, text: "New order received" },
    { id: 2, text: "Inventory needs replenishment" },
  ],
  outletInfo: {
    name: "Example Outlet",
    image: "path/to/profile-image.jpg",
    details: "Complete address and contact info",
  },
};

export const offersData = [
  {
    id: "offer1",
    name: "50% Off Your Next Purchase",
    description: "Get 50% off your next purchase with this exclusive offer.",
    validUntil: "2023-12-31",
    active: true,
  },
  {
    id: "offer2",
    name: "Free Shipping",
    description: "Enjoy free shipping on orders over $50.",
    validUntil: "2023-11-30",
    active: false,
  },
];

// src/data/dummy.js
export const outletData = {
  name: "My Outlet",
  resId: "RES123",
  address: "123 Main St, Anytown, AT 12345",
  image: "https://via.placeholder.com/150",
  contact: "123-456-7890",
  openingHours: "Mon-Sat: 9am-9pm",
};
// TiffinSettings