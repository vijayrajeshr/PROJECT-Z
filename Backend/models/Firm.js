const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    email: String,
    days: String,
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    comments: [String],
    ownerReply: {
      reply: String,
      username: String,
      createdAt: Date,
    },
    usercomments: [
      {
        commentId: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        username: String,
        comment: String,
        date: {
          type: Date,
          default: Date.now,
        },
        replies: [
          {
            reply: String,
            username: String,
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [String],
    followers: {
      type: Number,
      default: 0,
    },
    followBy: [String],
    reviewType: {
      type: String,
      enum: ["takeaway", "dining", null],
      required: true,
      default: null,
    },
    aspects: {
      pricePerPerson: String,
      food: { type: Number, min: 0, max: 5 },
      service: { type: Number, min: 0, max: 5 },
      atmosphere: { type: Number, min: 0, max: 5 },
      noiseLevel: String,
      groupSize: String,
      waitTime: String,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    author_name: {
      type: String,
      required: true,
    },
    date: String, // optional user-provided string date
  },
  { timestamps: true } // << adds createdAt and updatedAt
);

const firmSchema = new mongoose.Schema(
  {
    // Add top-level fields for owner information
    ownerName: {
      type: String,
      trim: true,
    },
    ownerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    ownerPhoneNo: {
      countryCode: {
        type: String,
        // required: true,
      },
      number: {
        type: String,
        // required: true,
      },
      fullNumber: {
        type: String,
        // required: true,
        unique: true,
      },
    },
    ownerPhone: {
      type: String,
      trim: true,
    },

    restaurantInfo: {
      name: {
        type: String,
        required: [true, "Firm name is required"],
        unique: true,
        trim: true,
      },

      cuisines: {
        type: [String],
        default: null,
      },

      priceRange: String,

      price_range: String,

      phoneNo: String,

      website: String,

      address: String,

      instagram: String,

      additionalInfo: {
        neighbourhood: String,
        diningStyle: String,
        dressCode: String,
        executiveCheif: String,
        hoursOfOperation: String,
        parking: String,
        publicTransit: String,
        paymentOptions: String,
        additionalDetails: String,

        // Keep these for backwards compatibility
        ownerName: String,
        ownerEmail: String,
        ownerPhone: String,
      },

      overview: String,

      category: {
        type: [
          {
            type: String,
            enum: ["veg", "non-veg"],
          },
        ],
      },

      isBookMarked: {
        type: Boolean,
        default: false,
      },

      isFlaged: {
        type: Boolean,
        default: false,
      },
      isBanned: {
        type: Boolean,
        default: false,
      },

      city: {
        type: String,
      },

      area: {
        type: String,
      },

      ratings: {
        overall: {
          type: Number,
          min: 0,
          max: 5,
          default: 0,
        },
        food: {
          type: Number,
          min: 0,
          max: 5,
          default: 0,
        },
        service: {
          type: Number,
          min: 0,
          max: 5,
          default: 0,
        },
        ambience: {
          type: Number,
          min: 0,
          max: 5,
          default: 0,
        },
        value: {
          type: Number,
          min: 0,
          max: 5,
          default: 0,
        },
        totalReviews: {
          type: Number,
          default: 0,
        },
        noiseLevel: String,
      },
      SocialMediaLinks: {
        type: Map,
        of: {
          type: String,
          validate: {
            validator: (v) => /^https?:\/\//.test(v),
            message: "Link must be a valid URL",
          },
        },
      },
    },

    termsAccepted: {
      type: Boolean,
      default: false,
    },
    termsAcceptedDate: {
      type: Date,
    },
    registrationStatus: {
      type: String,
      enum: ["incomplete", "pending", "completed"],
      default: "incomplete",
    },

    insights: [
      {
        name: String,
        class: {
          type: String,
        },
        category: String,
      },
    ],

    opening_hours: {
      SundaySun: String,
      MondayMon: String,
      TuesdayTue: String,
      WednesdayWed: String,
      ThursdayThu: String,
      FridayFri: String,
      SaturdaySat: String,
    },
    serviceClouserDay: {
      type: [Date],
      default: [],
    },
    operatingTimes: {
      type: {
        Monday: { open: String, close: String },
        Tuesday: { open: String, close: String },
        Wednesday: { open: String, close: String },
        Thursday: { open: String, close: String },
        Friday: { open: String, close: String },
        Saturday: { open: String, close: String },
        Sunday: { open: String, close: String },
      },
      default: {
        Monday: { open: "", close: "" },
        Tuesday: { open: "", close: "" },
        Wednesday: { open: "", close: "" },
        Thursday: { open: "", close: "" },
        Friday: { open: "", close: "" },
        Saturday: { open: "", close: "" },
        Sunday: { open: "", close: "" },
      },
    },
    additionalSettings: {
      type: {
        catering: { type: Boolean, default: false },
        houseParty: { type: Boolean, default: false },
        specialEvents: { type: Boolean, default: false },
        freeDelivery: { type: String, default: "" },
        deliveryDetails: { type: String, default: "" },
        deliveryCity: { type: String, default: "" },
        specialMealDay: { type: String, default: "" },
      },
      default: {
        catering: false,
        houseParty: false,
        specialEvents: false,
        freeDelivery: "",
        deliveryDetails: "",
        deliveryCity: "",
        specialMealDay: "",
      },
    },
    reviewSummary: String,

    image_urls: [String],

    menu_url: String,

    menu_images: [String],

    faqs: [
      {
        question: String,
        answer: String,
      },
    ],

    source_url: String,
    menu_text_user: {
      type: {
        menuTabs: [
          {
            // _id: { type: mongoose.Schema.Types.ObjectId },
            name: { type: String },
            sections: [
              {
                // _id: { type: mongoose.Schema.Types.ObjectId },
                name: { type: String },
                description: { type: String, default: "" },
                items: [
                  {
                    _id: {
                      type: mongoose.Schema.Types.ObjectId,
                      default: () => new mongoose.Types.ObjectId(),
                    },
                    //   type: mongoose.Schema.Types.ObjectId,
                    //   ref: "MenuItem",
                    name: { type: String },
                    price: { type: String },
                    description: { type: String },
                    veg: { type: Boolean },
                  },
                ],
              },
            ],
          },
        ],
        // default: {}, // Ensure menu is an object
      },
      default: { menuTabs: [] }, // Default to an object with an empty menuTabs array
    },
    menu: {
      type: {
        menuTabs: [
          {
            // _id: { type: mongoose.Schema.Types.ObjectId },
            name: { type: String },
            sections: [
              {
                // _id: { type: mongoose.Schema.Types.ObjectId },
                name: { type: String },
                description: { type: String, default: "" },
                items: [
                  // {
                  //   _id: {
                  //     type: mongoose.Schema.Types.ObjectId,
                  //     default: () => new mongoose.Types.ObjectId(),
                  //   },
                  //   type: mongoose.Schema.Types.ObjectId,
                  //   ref: "MenuItem",
                  // name: { type: String },
                  // price: { type: String },
                  // description: { type: String },
                  // veg: { type: Boolean },
                  // },
                ],
              },
            ],
          },
        ],
        // default: {}, // Ensure menu is an object
      },
      default: { menuTabs: [] }, // Default to an object with an empty menuTabs array
    },

    features: {
      type: [String],
      default: [],
    },

    offer: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RestaurantOffers",
      },
    ],

    dietary: {
      type: [
        {
          type: String,
        },
      ],
    },

    popularity: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    reviews: [reviewSchema],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    vendor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    restaurantStatus: {
      type: String,
      enum: ["Pending", "Claimed", "Unclaimed", "Revoked", "Approved","completed"],
      default: "Pending",
    },
    outletStatus: {
      type: String,
      enum: ["Open", "Close"],
      default: "Close",
    },

    newlyAdded: {
      type: Boolean,
      default: false,
    },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
  },
  {
    timestamps: true,
  }
);
firmSchema.index({ location: "2dsphere" });

firmSchema.index({ "restaurantInfo.address": 1 });
const Firm = mongoose.model("Firm", firmSchema);
module.exports = Firm;
