const initialData = {
  // Stats for top cards
  stats: {
    dailyOrders: {
      value: 78,
      trend: 12.5,
      isUp: true,
      breakdown: {
        dineIn: 45,
        takeaway: 33,
      },
    },
    revenue: {
      value: 14500,
      trend: 8.2,
      isUp: true,
      breakdown: {
        cash: 4350,
        card: 5800,
        upi: 4350,
      },
    },
    activeItems: {
      value: 112,
      trend: -3.1,
      isUp: false,
      outOfStock: 8,
    },
    pendingOrders: {
      value: 9,
      trend: 2.4,
      isUp: true,
      urgentOrders: 3,
    },
    customerSatisfaction: {
      value: 4.5, // Out of 5
      trend: 0.3,
      isUp: true,
      feedbackCount: 120,
    },
    averageOrderValue: {
      value: 450, // In INR
      trend: 5.0,
      isUp: true,
    },
  },

  // Live order queue
  liveOrders: [
    {
      id: "#1423",
      customer: "John Doe",
      tableNo: "T5",
      items: [
        {
          name: "Butter Chicken",
          quantity: 1,
          price: 350,
          notes: "Extra spicy",
        },
        { name: "Naan", quantity: 2, price: 50, notes: "Butter" },
      ],
      status: "Preparing",
      orderTime: "14:30",
      preparationTime: "25 mins",
      total: 450,
      paymentStatus: "Paid",
      type: "Dine-in",
    },
    {
      id: "#1424",
      customer: "Jane Smith",
      tableNo: "T2",
      items: [
        { name: "Veg Biryani", quantity: 1, price: 300, notes: "Less spicy" },
        { name: "Raita", quantity: 1, price: 50 },
      ],
      status: "Pending",
      orderTime: "14:35",
      preparationTime: "20 mins",
      total: 350,
      paymentStatus: "Pending",
      type: "Takeaway",
    },
  ],

  // Menu performance
  menuPerformance: {
    topSellers: [
      {
        name: "Butter Chicken",
        orders: 45,
        revenue: 15750,
        rating: 4.8,
        trend: 5.2,
      },
      {
        name: "Veg Biryani",
        orders: 38,
        revenue: 11400,
        rating: 4.6,
        trend: 3.8,
      },
      {
        name: "Paneer Tikka",
        orders: 30,
        revenue: 9000,
        rating: 4.7,
        trend: 4.5,
      },
    ],
    categories: {
      "Main Course": { items: 40, active: 36 },
      Starters: { items: 25, active: 22 },
      Breads: { items: 12, active: 12 },
      Desserts: { items: 15, active: 14 },
      Beverages: { items: 20, active: 18 },
    },
    lowPerformingItems: [
      {
        name: "Chocolate Mousse",
        orders: 5,
        revenue: 1500,
        rating: 3.8,
        trend: -2.0,
      },
      {
        name: "French Fries",
        orders: 8,
        revenue: 1200,
        rating: 3.9,
        trend: -1.5,
      },
    ],
  },

  // Revenue analytics
  revenueAnalytics: {
    hourly: [
      { hour: "10:00", orders: 5, revenue: 1500 },
      { hour: "11:00", orders: 8, revenue: 2400 },
      { hour: "12:00", orders: 12, revenue: 3600 },
      { hour: "13:00", orders: 15, revenue: 4500 },
      { hour: "14:00", orders: 10, revenue: 3000 },
      { hour: "15:00", orders: 7, revenue: 2100 },
    ],
    daily: [
      { day: "Mon", orders: 70, revenue: 12500 },
      { day: "Tue", orders: 75, revenue: 13200 },
      { day: "Wed", orders: 82, revenue: 14800 },
      { day: "Thu", orders: 77, revenue: 13900 },
      { day: "Fri", orders: 90, revenue: 16500 },
      { day: "Sat", orders: 98, revenue: 18900 },
      { day: "Sun", orders: 78, revenue: 14500 },
    ],
    monthly: [
      { month: "Jan", orders: 2100, revenue: 735000 },
      { month: "Feb", orders: 2200, revenue: 770000 },
      { month: "Mar", orders: 2300, revenue: 805000 },
      { month: "Apr", orders: 2400, revenue: 840000 },
      { month: "May", orders: 2500, revenue: 875000 },
    ],
  },

  // Table status
  tables: {
    total: 20,
    occupied: 12,
    reserved: 3,
    available: 5,
    details: [
      {
        number: "T1",
        capacity: 4,
        status: "Occupied",
        orderTotal: 1200,
        timeSpent: "45 mins",
      },
      {
        number: "T2",
        capacity: 6,
        status: "Reserved",
        orderTotal: 0,
        timeSpent: "0 mins",
      },
      {
        number: "T3",
        capacity: 4,
        status: "Available",
        orderTotal: 0,
        timeSpent: "0 mins",
      },
    ],
  },

  // Customer feedback
  customerFeedback: [
    {
      id: 1,
      customer: "John Doe",
      rating: 4.5,
      comment: "Great food and service!",
      date: "2023-10-01",
    },
    {
      id: 2,
      customer: "Jane Smith",
      rating: 3.8,
      comment: "Food was good, but the wait time was long.",
      date: "2023-10-02",
    },
  ],

  // Staff performance
  staffPerformance: [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Waiter",
      ordersServed: 120,
      customerRating: 4.7,
      attendance: "95%",
    },
    {
      id: 2,
      name: "Priya Singh",
      role: "Chef",
      dishesPrepared: 200,
      customerRating: 4.9,
      attendance: "98%",
    },
  ],

  // Inventory status
  inventory: {
    totalItems: 150,
    lowStockItems: 12,
    outOfStockItems: 5,
    details: [
      {
        name: "Chicken",
        currentStock: 50,
        minStock: 30,
        status: "In Stock",
      },
      {
        name: "Paneer",
        currentStock: 20,
        minStock: 25,
        status: "Low Stock",
      },
      {
        name: "Tomatoes",
        currentStock: 0,
        minStock: 10,
        status: "Out of Stock",
      },
    ],
  },
};
