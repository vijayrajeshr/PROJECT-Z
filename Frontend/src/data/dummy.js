import moment from "moment";
export default {

  restaurants: [
    {
      id: 1,
      name: "Spice Delight",
      type: "Restaurants",
      categories: [
        {
          name: "Starters",
          items: ["Paneer Tikka", "Crispy Corn", "Spring Rolls"]
        },
        {
          name: "Main Course",
          items: ["Paneer Butter Masala", "Dal Makhani", "Veg Biryani"]
        }
      ]
    },

    {
      id: 3,
      name: "Flavors of India",
      type: "Restaurants",
      categories: [
        {
          name: "Starters",
          items: ["Samosa", "Chilli Paneer", "Dahi Ke Kebab", "Corn Cheese Balls", "Paneer Pakora", "Hakka Noodles", "Malai Kofta", "Mix Veg Curry", "Chana Masala"]
        },
        {
          name: "Main Course",
          items: ["Malai Kofta", "Mix Veg Curry", "Chana Masala"]
        }
      ]
    },

    {
      id: 4,
      name: "Royal Feast",
      type: "Restaurants",
      categories: [
        {
          name: "Starters",
          items: ["Corn Cheese Balls", "Paneer Pakora", "Hakka Noodles"]
        },
        {
          name: "Main Course",
              items: ["Palak Paneer", "Navratan Korma", "Kadhi Pakora"]
        }
      ]
    },
    {
      id: 5,
      name: "The Grand Kitchen",
      type: "Restaurants",
      categories: [
        {
          name: "Starters",
              items: ["Tandoori Broccoli", "Cheese Corn Nuggets", "Paneer Kurkure"]
        },
        {
          name: "Main Course",
              items: ["Kashmiri Dum Aloo", "Rajma Chawal", "Bhindi Masala"]
        }
      ]
    },
    {
      id: 6,
      name: "Tandoori Treats",
      type: "Restaurants",
      categories: [
        {
          name: "Starters",
              items: ["Stuffed Mushrooms", "Hara Bhara Kebab", "Aloo Tikki"]
        },
        {
          name: "Main Course",
              items: ["Shahi Paneer", "Baingan Bharta", "Jeera Aloo"]
        }
      ]
    },
    {
      id: 7,
      name: "Spice Delight",
      type: "Restaurants",
      categories: [
        {
          name: "Starters",
              items: ["Paneer Tikka", "Crispy Corn", "Spring Rolls"]
        },
        {
          name: "Main Course",
              items: ["Paneer Butter Masala", "Dal Makhani", "Veg Biryani"]
        }
      ]
    },

  ],

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
                servingInfo: "2 Pieces",
                calorieCount: "250 kcal",
                portionSize: "Medium",
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
                servingInfo: "4 Pieces",
                calorieCount: "300 kcal",
                portionSize: "Large",
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
                servingInfo: "6 Pieces",
                calorieCount: "350 kcal",
                portionSize: "Medium",
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
                servingInfo: "8 Pieces",
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
                servingInfo: "1 Portion",
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
                servingInfo: "1 Portion",
                calorieCount: "380 kcal",
                portionSize: "Medium",
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
                servingInfo: "1 Bowl",
                calorieCount: "300 kcal",
                portionSize: "Medium",
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
                servingInfo: "6 Pieces",
                calorieCount: "150 kcal",
                portionSize: "Small",
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
                servingInfo: "6 Pieces",
                calorieCount: "320 kcal",
                portionSize: "Small",
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
                servingInfo: "4 Kebabs",
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

export const restaurantReviews = [
  {
    id: 1,
    imgSrc: "https://randomuser.me/api/portraits/men/10.jpg",
    altText: "Profile of Michael Scott",
    rating: 4.5,
    reviewer: "Michael Scott",
    reviewContent:
      "The ambiance was amazing, and the food was delicious! The staff was friendly, and the service was quick. I’ll definitely come back again.The ambiance was amazing, and the food was delicious! The staff was friendly, and the service was quick. I’ll definitely come back again.The ambiance was amazing, and the food was delicious! The staff was friendly, and the service was quick. I’ll definitely come back again.The ambiance was amazing, and the food was delicious! The staff was friendly, and the service was quick. I’ll definitely come back again.The ambiance was amazing, and the food was delicious! The staff was friendly, and the service was quick. I’ll definitely come back again.",
  },
  {
    id: 2,
    imgSrc: "https://randomuser.me/api/portraits/women/12.jpg",
    altText: "Profile of Pam Beesly",
    rating: 4.0,
    reviewer: "Pam Beesly",
    reviewContent:
      "Great experience overall. The pasta was perfectly cooked, but the dessert options could use some variety. Still, a solid choice for dinner.",
  },
  {
    id: 3,
    imgSrc: "https://randomuser.me/api/portraits/men/15.jpg",
    altText: "Profile of Jim Halpert",
    rating: 3.8,
    reviewer: "Jim Halpert",
    reviewContent:
      "Decent food but slightly overpriced for the portion sizes. The location is convenient, though, and the atmosphere is cozy.",
  },
  {
    id: 4,
    imgSrc: "https://randomuser.me/api/portraits/women/20.jpg",
    altText: "Profile of Angela Martin",
    rating: 5.0,
    reviewer: "Angela Martin",
    reviewContent:
      "Absolutely loved it! The chef's special was out of this world, and the attention to detail in every dish was impressive. Highly recommend!",
  },
  {
    id: 5,
    imgSrc: "https://randomuser.me/api/portraits/men/30.jpg",
    altText: "Profile of Dwight Schrute",
    rating: 4.2,
    reviewer: "Dwight Schrute",
    reviewContent:
      "Great selection of farm-to-table dishes. The beet salad was the highlight of my meal. Would definitely visit again.",
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

function getRandomDate(start, end) {
  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return randomDate.toISOString().split("T")[0];
}

// Helper function to generate daily sub-statuses based on plan
const initializeSubStatus = (order) => {
  const startDate = moment(order.time, "YYYY-MM-DD");
  const days = parseInt(order.plan, 10) || 0;
  const subStatus = [];

  for (let i = 0; i < days; i++) {
    const date = moment(startDate).add(i, "days").format("YYYY-MM-DD");
    subStatus.push({ date, status: "Pending" });
  }

  return subStatus;
};

export const initialRecentActivity = [
  {
    id: "#1423",
    customer: "John Doe",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, AN 12345",
    total: "$450",
    status: "Plan Completed",
    time: getRandomDate(new Date(2025, 0, 22), new Date()),
    specialInstructions: "Leave the package at the doorstep.",
    plan: "7",
    distance: "10 KM",
    mealType: "Basic",
    quantity: 1,
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    flexiblePlan: {
      type: "date-range",
      startDate: new Date(2024, 0, 2),
      endDate: new Date(2024, 0, 10),
    },
    subStatus: [],
  },
  {
    id: "#1422",
    customer: "Jane Smith",
    phone: "+1 (555) 987-6543",
    address: "456 Maple Ave, Somecity, SC 54321",
    total: "$1200",
    status: "Processing",
    time: getRandomDate(new Date(2025, 0, 22), new Date()),
    specialInstructions: "Ring the doorbell upon arrival.",
    plan: "7",
    distance: "10 KM",
    mealType: "Premium",
    quantity: 2,
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    flexiblePlan: {
      type: "flexi-dates",
      flexiDates: [
        new Date(2024, 0, 3),
        new Date(2024, 0, 5),
        new Date(2024, 0, 8),
      ],
    },
    subStatus: [],
  },
  {
    id: "#1421",
    customer: "Ravi Kumar",
    phone: "+91 98765 43210",
    address: "789 Elm St, New Delhi, DL 110001",
    total: "$800",
    status: "Plan Completed",
    time: getRandomDate(new Date(2025, 0, 22), new Date()),
    specialInstructions: "Do not include onions.",
    plan: "7",
    distance: "10 KM",
    mealType: "Basic",
    quantity: 3,
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    flexiblePlan: {
      type: "date-range",
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 0, 31),
    },
    subStatus: [],
  },
  {
    id: "#1420",
    customer: "Ayesha Khan",
    phone: "+91 99876 54321",
    address: "123 Cherry Lane, Mumbai, MH 400001",
    total: "$650",
    status: "Rejected",
    time: getRandomDate(new Date(2025, 0, 22), new Date()),
    specialInstructions: "Deliver between 6-7 PM.",
    plan: "7",
    distance: "10 KM",
    mealType: "Vegetarian",
    quantity: 1,
    avatar: "https://randomuser.me/api/portraits/women/20.jpg",
    flexiblePlan: {
      type: "flexi-dates",
      flexiDates: [new Date(2024, 0, 4), new Date(2024, 0, 9)],
    },
    subStatus: [],
  },
  {
    id: "#1424",
    customer: "Mohit Sharma",
    phone: "+91 98700 12345",
    address: "101 Palm Street, Jaipur, RJ 302001",
    total: "$1000",
    status: "New Order",
    time: getRandomDate(new Date(2025, 0, 22), new Date()),
    specialInstructions: "Extra spicy food requested.",
    plan: "7",
    distance: "10 KM",
    mealType: "Deluxe",
    quantity: 2,
    avatar: "https://randomuser.me/api/portraits/men/25.jpg",
    flexiblePlan: {
      type: "date-range",
      startDate: new Date(2024, 0, 5),
      endDate: new Date(2024, 0, 15),
    },
    subStatus: [],
  },
  {
    id: "#1425",
    customer: "Emily Davis",
    phone: "+1 (555) 456-7890",
    address: "222 Broadway, New York, NY 10007",
    total: "$750",
    status: "New Order",
    time: getRandomDate(new Date(2025, 0, 22), new Date()),
    specialInstructions: "Add extra cutlery.",
    plan: "7",
    distance: "10 KM",
    mealType: "Non-Vegetarian",
    quantity: 2,
    avatar: "https://randomuser.me/api/portraits/women/16.jpg",
    flexiblePlan: {
      type: "flexi-dates",
      flexiDates: [new Date(2024, 0, 6), new Date(2024, 0, 10)],
    },
    subStatus: [],
  },
  {
    id: "#1426",
    customer: "Sanjay Mehta",
    phone: "+91 87654 32109",
    address: "88 MG Road, Pune, MH 411001",
    total: "$1400",
    status: "Plan Completed",
    time: getRandomDate(new Date(2025, 0, 22), new Date()),
    specialInstructions: "Deliver to the office reception.",
    plan: "7",
    distance: "10 KM",
    mealType: "Deluxe",
    quantity: 4,
    avatar: "https://randomuser.me/api/portraits/men/30.jpg",
    flexiblePlan: {
      type: "date-range",
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 0, 31),
    },
    subStatus: [],
  },
  {
    id: "#1427",
    customer: "Priya Nair",
    phone: "+91 98987 65432",
    address: "202 Greenfields, Kochi, KL 682001",
    total: "$550",
    status: "New Order",
    time: getRandomDate(new Date(2025, 0, 22), new Date()),
    specialInstructions: "Do not include garlic.",
    plan: "7",
    distance: "10 KM",
    mealType: "Vegetarian",
    quantity: 1,
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    flexiblePlan: {
      type: "date-range",
      startDate: new Date(2024, 0, 10),
      endDate: new Date(2024, 0, 15),
    },
    subStatus: [],
  },
].map((order) => ({
  ...order,
  subStatus: initializeSubStatus(order),
}));
