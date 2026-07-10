// const mongoose = require("mongoose");

// const menuIntemSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     price: String,
//     description: String,
//     variations: [
//       {
//         name: String,
//         price: String,
//       },
//     ],
//     // dietary: [
//     //   {
//     //     type: String,
//     //     enum: [
//     //       "vegetarian",
//     //       "vegan",
//     //       "halal",
//     //       "gluten-free",
//     //       "dairy-free",
//     //       "nut-free",
//     //     ],
//     //     _id: false,
//     //   },
//     // ],
//     isTrashed: {
//       type: Boolean,
//       default: false,
//     },

//     category: {
//       type: String,
//       enum: ["veg", "non-veg", "both"],
//     },
//     group: String,
//     // images: [
//     //   {
//     //     filename: String,
//     //     url: String,
//     //     _id: false,
//     //   },
//     // ],
//     bestSeller: {
//       type: Boolean,
//       default: false,
//     },
//     firm: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Firm",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const MenuItem = mongoose.model("MenuItem", menuIntemSchema);
// module.exports = MenuItem;

// const mongoose = require("mongoose");

// const menuIntemSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     price: String,
//     description: String,
//     variations: [
//       {
//         name: String,
//         price: String,
//       },
//     ],
//     // dietary: [
//     //   {
//     //     type: String,
//     //     enum: [
//     //       "vegetarian",
//     //       "vegan",
//     //       "halal",
//     //       "gluten-free",
//     //       "dairy-free",
//     //       "nut-free",
//     //     ],
//     //     _id: false,
//     //   },
//     // ],
//     isTrashed: {
//       type: Boolean,
//       default: false,
//     },

//     category: {
//       type: String,
//       enum: ["veg", "non-veg", "both"],
//     },
//     group: String,
//     // images: [
//     //   {
//     //     filename: String,
//     //     url: String,
//     //     _id: false,
//     //   },
//     // ],
//     bestSeller: {
//       type: Boolean,
//       default: false,
//     },
//     firm: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Firm",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const MenuItem = mongoose.model("MenuItem", menuIntemSchema);
// module.exports = MenuItem;

// const mongoose = require("mongoose");

// const menuItemSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     price: {
//       type: String,
//       required: true,
//     },

//     description: {
//       type: String,
//       default: "",
//     },

//     variations: [
//       {
//         name: String,
//         price: String,
//       },
//     ],

//     type: {
//       type: String,
//       enum: ["Veg", "Non-Veg", "Egg", ""],
//       default: "",
//     },

//     categoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//     },

//     subcategoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//     },

//     category: {
//       type: String,
//       enum: ["veg", "non-veg", "both"],
//     },

//     group: {
//       type: String,
//       default: "",
//     },

//     pricing: {
//       type: String,
//     },

//     taxes: {
//       type: String,
//       default: "5% GST",
//     },

//     serviceType: {
//       type: [String],
//       enum: ["Dine-in", "Takeaway"],
//       default: [],
//     },

//     dishDetails: {
//       servingInfo: {
//         type: String,
//         default: "",
//       },
//       calorieCount: {
//         type: String,
//         default: "",
//       },
//       portionSize: {
//         type: String,
//         enum: ["", "Small", "Medium", "Large", "Extra Large"],
//         default: "",
//       },
//       preparationTime: {
//         type: String,
//         default: "",
//       },
//     },

//     images: {
//       type: [String],
//       default: [],
//     },

//     isTrashed: {
//       type: Boolean,
//       default: false,
//     },

//     bestSeller: {
//       type: Boolean,
//       default: false,
//     },

//     firm: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Firm",
//     },
//   },
//   {
//     timestamps: true, // auto handles createdAt and updatedAt
//   }
// );

// // No need for manual updatedAt pre-save hook as `timestamps: true` handles it
// const MenuItem = mongoose.model("MenuItem", menuItemSchema);
// module.exports = MenuItem;

const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: String,
    description: String,
    variations: [
      {
        name: String,
        price: String,
      },
    ],
    // dietary: [
    //   {
    //     type: String,
    //     enum: [
    //       "vegetarian",
    //       "vegan",
    //       "halal",
    //       "gluten-free",
    //       "dairy-free",
    //       "nut-free",
    //     ],
    //     _id: false,
    //   },
    // ],
    isTrashed: {
      type: Boolean,
      default: false,
    },

    category: {
      type: String,
      enum: ["veg", "non-veg", "both"],
    },
    group: String,
    // images: [
    //   {
    //     filename: String,
    //     url: String,
    //     _id: false,
    //   },
    // ],
    bestSeller: {
      type: Boolean,
      default: false,
    },
    firm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Firm",
    },
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
module.exports = MenuItem;
