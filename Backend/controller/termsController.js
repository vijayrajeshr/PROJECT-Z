// const Firm = require("../models/Firm");
// const historyLogRecorder = require("../models/historyLog");

// // Controller to handle terms and conditions acceptance
// const acceptTerms = async (req, res) => {
//   try {
//     const { restaurantId, termsAccepted, formData } = req.body;
//     console.log(formData, "getting all the data ");
//     if (!restaurantId) {
//       return res.status(400).json({
//         success: false,
//         message: "Restaurant ID is required",
//       });
//     }

//     if (!termsAccepted) {
//       return res.status(400).json({
//         success: false,
//         message: "Terms must be accepted to complete registration",
//       });
//     }

//     // Find the restaurant
//     const restaurant = await Firm.findById(restaurantId);
//     if (!restaurant) {
//       return res.status(404).json({
//         success: false,
//         message: "Restaurant not found",
//       });
//     }
//     // Validate restaurant name
//     if (!firmName) {
//       return res.status(400).json({
//         success: false,
//         message: "Restaurant name is required",
//       });
//     }
//     // Constructing the full address
//     const fullAddress = `${shopNo ? `Shop ${shopNo}, ` : ""}${
//       floorLevel ? `Floor ${floorLevel}, ` : ""
//     }${area ? `${area}, ` : ""}${city ? `${city}` : ""}${
//       landmark ? `, near ${landmark}` : ""
//     }`;

//     // Create new restaurant document
//     const newRestaurant = new Firm({
//       ownerName,
//       ownerEmail,
//       ownerPhone,
//       newlyAdded: true,
//       termsAccepted: true, // Mark terms as accepted
//       termsAcceptedDate: new Date(), // Record acceptance date
//       registrationStatus: "completed", // Set status to completed
//       restaurantInfo: {
//         name: firmName,
//         phoneNo: phoneNo,
//         address: fullAddress,
//         area: area,
//         city: city,
//         category:
//           category === "Both"
//             ? ["veg", "non-veg"]
//             : [category?.toLowerCase() || "veg"],
//         cuisines: Array.isArray(cuisines)
//           ? cuisines
//           : cuisines
//           ? cuisines.split(",").map((c) => c.trim())
//           : [],
//         additionalInfo: {
//           diningStyle: req.body.diningStyle || "",
//           dressCode: req.body.dressCode || "",
//           executiveCheif: req.body.executiveCheif || "",
//           hoursOfOperation: req.body.hoursOfOperation || "",
//           parking: req.body.parking || "",
//           publicTransit: req.body.publicTransit || "",
//           paymentOptions: req.body.paymentOptions || "",
//           additionalDetails: req.body.additionalDetails || "",
//           ownerName: ownerName || "",
//           ownerEmail: ownerEmail || "",
//           ownerPhone: ownerPhone || "",
//         },
//       },
//       features: Array.isArray(services) ? services : services ? [services] : [],
//       popularity: 0,
//       source_url: "test_registration",
//       latitude,
//       longitude,
//       image_urls: req.body.image_urls || [],
//       menu_url: req.body.menu_url || "",
//       location: {
//         type: "Point",
//         coordinates: [-79.4276471, 43.6534627],
//       },
//     });
//     // Save to MongoDB database
//     const savedRestaurant = await newRestaurant.save();
//     // Update restaurant with terms acceptance
//     restaurant.termsAccepted = true;
//     restaurant.termsAcceptedDate = new Date();
//     restaurant.registrationStatus = "completed";

//     await restaurant.save();

//     // Log the terms acceptance
//     historyLogRecorder(
//       req,
//       "Firm",
//       "UPDATE",
//       restaurant._id,
//       `Terms and conditions accepted for restaurant ${
//         restaurant.restaurantInfo?.name || restaurant._id
//       }`
//     );

//     res.status(200).json({
//       success: true,
//       message: "Terms and conditions accepted. Registration complete!",
//       restaurant: {
//         id: restaurant._id,
//         name: restaurant.restaurantInfo?.name,
//         status: "complete",
//       },
//     });
//   } catch (error) {
//     console.error("Error accepting terms:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while processing terms acceptance",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   acceptTerms,
// };

// const Firm = require("../models/Firm");
// const historyLogRecorder = require("../models/historyLog");

// const acceptTerms = async (req, res) => {
//   try {
//     const { termsAccepted, formData, uploaddata } = req.body;
//     console.log(uploaddata, "getting the uploaddata....");

//     // Ensure terms are accepted
//     if (!termsAccepted || termsAccepted === "false") {
//       return res.status(400).json({
//         success: false,
//         message: "Terms must be accepted to complete registration",
//       });
//     }

//     if (!formData) {
//       return res.status(400).json({
//         success: false,
//         message: "Form data is required",
//       });
//     }

//     const {
//       restaurantName,
//       ownerName,
//       ownerPhoneNumber,
//       email,
//       ownerCountryCode,
//       shopNo,
//       floorLevel,
//       area,
//       city,
//       landmark,
//       category,
//       services,
//       cuisines,
//       longitude,
//       latitude,
//     } = formData;

//     if (!restaurantName) {
//       return res.status(400).json({
//         success: false,
//         message: "Restaurant name is required",
//       });
//     }

//     // Construct full address
//     const fullAddress = `${shopNo ? `Shop ${shopNo}, ` : ""}${
//       floorLevel ? `Floor ${floorLevel}, ` : ""
//     }${area ? `${area}, ` : ""}${city ? `${city}` : ""}${
//       landmark ? `, near ${landmark}` : ""
//     }`;

//     // Create new restaurant document
//     const newRestaurant = new Firm({
//       ownerName,
//       ownerEmail: email,
//       ownerPhoneNo: {
//         countryCode: ownerCountryCode,
//         number: ownerPhoneNumber,
//         fullNumber: ownerCountryCode + ownerPhoneNumber,
//       },
//       newlyAdded: true,
//       termsAccepted: termsAccepted, // Mark terms as accepted
//       termsAcceptedDate: new Date(), // Record acceptance date
//       registrationStatus: "completed", // Set status to completed
//       restaurantInfo: {
//         name: restaurantName,
//         phoneNo: ownerPhoneNumber,
//         address: fullAddress,
//         area: area,
//         city: city,
//         category:
//           category === "Both"
//             ? ["veg", "non-veg"]
//             : [category?.toLowerCase() || "veg"],
//         cuisines: Array.isArray(cuisines)
//           ? cuisines
//           : cuisines
//           ? cuisines.split(",").map((c) => c.trim())
//           : [],
//         additionalInfo: {
//           diningStyle: req.body.diningStyle || "",
//           dressCode: req.body.dressCode || "",
//           executiveCheif: req.body.executiveCheif || "",
//           hoursOfOperation: req.body.hoursOfOperation || "",
//           parking: req.body.parking || "",
//           publicTransit: req.body.publicTransit || "",
//           paymentOptions: req.body.paymentOptions || "",
//           additionalDetails: req.body.additionalDetails || "",
//         },
//       },
//       features: Array.isArray(services) ? services : services ? [services] : [],
//       popularity: 0,
//       source_url: "test_registration",
//       latitude,
//       longitude,
//       image_urls: req.body.image_urls || [],
//       menu_url: req.body.menu_url || "",
//       location: {
//         type: "Point",
//         coordinates: [-79.4276471, 43.6534627],
//       },
//     });

//     console.log("Received formData:", formData);

//     // Save restaurant
//     const savedRestaurant = await newRestaurant.save();

//     // Update terms and registration status
//     savedRestaurant.termsAccepted = true;
//     savedRestaurant.termsAcceptedDate = new Date();
//     savedRestaurant.registrationStatus = "completed";
//     await savedRestaurant.save();

//     // Log history
//     historyLogRecorder(
//       req,
//       "Firm",
//       "CREATE",
//       savedRestaurant._id,
//       `New restaurant ${restaurantName} created and terms accepted.`
//     );

//     historyLogRecorder(
//       req,
//       "Firm",
//       "UPDATE",
//       savedRestaurant._id,
//       `Registration status updated to 'completed' for ${restaurantName}`
//     );

//     res.status(201).json({
//       success: true,
//       message: "Restaurant created and terms accepted. Registration complete!",
//       restaurant: {
//         id: savedRestaurant._id,
//         name: savedRestaurant.restaurantInfo?.name,
//         status: savedRestaurant.restaurantStatus,
//         registrationStatus: savedRestaurant.registrationStatus,
//       },
//       nextStep: "/restaurant/documents",
//     });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error during registration",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   acceptTerms,
// };

const Firm = require("../models/Firm");
const Tiffin = require("../models/Tiffin");
const RestaurantDocument = require("../models/FirmDocuments");
const historyLogRecorder = require("../models/historyLog");
const mongoose = require("mongoose");
// const acceptTerms = async (req, res) => {
//   try {
//     // Log incoming request for debugging

//     const {
//       termsAccepted,
//       formData: formDataString,
//       productDescription,
//     } = req.body;
//     const documents = req.files || {};
//     const documentTypes = req.body.documentTypes
//       ? JSON.parse(req.body.documentTypes)
//       : Object.keys(documents).map((key) =>
//           key.replace("documents[", "").replace("]", "")
//         );
//     // Validate termsAccepted
//     if (!termsAccepted || termsAccepted === "false") {
//       return res.status(400).json({
//         success: false,
//         message: "Terms must be accepted to complete registration",
//         field: "termsAccepted",
//       });
//     }

//     // Validate formData
//     if (!formDataString) {
//       return res.status(400).json({
//         success: false,
//         message: "Form data is required",
//         field: "formData",
//       });
//     }

//     let formData;
//     try {
//       formData = JSON.parse(formDataString);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid formData JSON format",
//         error: error.message,
//       });
//     }

//     const {
//       restaurantName,
//       ownerName,
//       ownerPhoneNumber,
//       email,
//       ownerCountryCode,
//       shopNo,
//       floorLevel,
//       area,
//       city,
//       landmark,
//       services,
//       cuisines,
//       longitude,
//       latitude,
//       categoryVeg,
//       categoryNonVeg,
//       categoryBoth,
//     } = formData;

//     if (!restaurantName) {
//       return res.status(400).json({
//         success: false,
//         message: "Restaurant name is required",
//         field: "restaurantName",
//       });
//     }

//     console.log(
//       termsAccepted,
//       formData,
//       // req.body.hygieneCertificate.serviceType,
//       "getting data from the frontend"
//     );
//     // Validate mandatory documents
//     const mandatoryDocs = [
//       "businessRegistrationCertificate",
//       "hygieneCertificate",
//     ];
//     const missingDocs = mandatoryDocs.filter(
//       (doc) => !documents[`documents[${doc}]`]
//     );
//     if (missingDocs.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Missing mandatory documents: ${missingDocs.join(", ")}`,
//         field: "documents",
//       });
//     }

//     // Validate at least one KYC document
//     const kycDocs = [
//       "driverLicense",
//       "passport",
//       "militaryId",
//       "governmentId",
//       "permanentResidentCard",
//       "citizenshipCertificate",
//       "employmentAuthDocument",
//       "trustedTravellerID",
//       "tribalID",
//       "stateId",
//     ];
//     const hasKycDoc = kycDocs.some((doc) => documents[`documents[${doc}]`]);
//     if (!hasKycDoc) {
//       return res.status(400).json({
//         success: false,
//         message: "At least three KYC document is required",
//         field: "documents",
//       });
//     }

//     // // Validate productDescription
//     // if (!productDescription || productDescription.trim().length < 10) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "Product description must be at least 10 characters long",
//     //     field: "productDescription",
//     //   });
//     // }

//     // Determine category
//     let category;
//     let categoryWarning = null;
//     if (categoryBoth) {
//       category = "Both";
//     } else if (categoryVeg) {
//       category = "Veg";
//     } else if (categoryNonVeg) {
//       category = "Non-Veg";
//     } else {
//       category = "Veg"; // Default
//       categoryWarning = "No category selected; defaulting to Vegetarian.";
//     }

//     // Construct full address
//     const fullAddress = `${shopNo ? `Shop ${shopNo}, ` : ""}${
//       floorLevel ? `Floor ${floorLevel}, ` : ""
//     }${area ? `${area}, ` : ""}${city ? `${city}` : ""}${
//       landmark ? `, near ${landmark}` : ""
//     }`;

//     // Create new restaurant document
//     const newRestaurant = new Firm({
//       ownerName,
//       ownerEmail: email,
//       ownerPhoneNo: {
//         countryCode: ownerCountryCode,
//         number: ownerPhoneNumber,
//         fullNumber: ownerCountryCode + ownerPhoneNumber,
//       },
//       newlyAdded: true,
//       termsAccepted: true,
//       termsAcceptedDate: new Date(),
//       registrationStatus: "completed",
//       restaurantInfo: {
//         name: restaurantName,
//         phoneNo: ownerPhoneNumber,
//         address: fullAddress,
//         area: area,
//         city: city,
//         category:
//           category === "Both"
//             ? ["veg", "non-veg"]
//             : [category?.toLowerCase() || "veg"],
//         cuisines: Array.isArray(cuisines)
//           ? cuisines
//           : cuisines
//           ? cuisines.split(",").map((c) => c.trim())
//           : [],
//         additionalInfo: {
//           diningStyle: req.body.diningStyle || "",
//           dressCode: req.body.dressCode || "",
//           executiveCheif: req.body.executiveCheif || "",
//           hoursOfOperation: req.body.hoursOfOperation || "",
//           parking: req.body.parking || "",
//           publicTransit: req.body.publicTransit || "",
//           paymentOptions: req.body.paymentOptions || "",
//           additionalDetails: req.body.additionalDetails || "",
//         },
//       },
//       features: Array.isArray(services)
//         ? services
//         : services
//         ? services.split(",").map((s) => s.trim())
//         : [],
//       popularity: 0,
//       source_url: "test_registration",
//       latitude,
//       longitude,
//       image_urls: req.body.image_urls || [],
//       menu_url: req.body.menu_url || "",
//       location: {
//         type: "Point",
//         coordinates: [longitude || -79.4276471, latitude || 43.6534627],
//       },
//     });

//     // Save restaurant
//     const savedRestaurant = await newRestaurant.save();

//     // Handle document uploads
//     let documentRecord = await RestaurantDocument.findOne({
//       restaurantId: savedRestaurant._id,
//     });

//     if (!documentRecord) {
//       documentRecord = new RestaurantDocument({
//         restaurantId: savedRestaurant._id,
//         productDescription: productDescription || "",
//       });
//     } else {
//       documentRecord.productDescription = productDescription || "";
//     }

//     const filePaths = {};
//     for (const documentType of documentTypes) {
//       const file = documents[`documents[${documentType}]`]?.[0];
//       if (file) {
//         documentRecord[documentType] = file.path;
//         filePaths[documentType] = file.path;

//         // Log the document upload
//         historyLogRecorder(
//           req,
//           "RestaurantDocument",
//           "UPDATE",
//           documentRecord._id || savedRestaurant._id,
//           `Document ${documentType} uploaded for restaurant ${savedRestaurant._id}`
//         );
//       }
//     }

//     await documentRecord.save();

//     // Log history for restaurant creation
//     historyLogRecorder(
//       req,
//       "Firm",
//       "CREATE",
//       savedRestaurant._id,
//       `New restaurant ${restaurantName} created and terms accepted.`
//     );

//     historyLogRecorder(
//       req,
//       "Firm",
//       "UPDATE",
//       savedRestaurant._id,
//       `Registration status updated to 'completed' for ${restaurantName}`
//     );

//     res.status(201).json({
//       success: true,
//       message:
//         "Restaurant created, terms accepted, and documents uploaded. Registration complete!",
//       restaurant: {
//         id: savedRestaurant._id,
//         name: savedRestaurant.restaurantInfo?.name,
//         status: savedRestaurant.restaurantStatus,
//         registrationStatus: savedRestaurant.registrationStatus,
//       },
//       filePaths,
//       nextStep: "/restaurant/documents",
//       warnings: categoryWarning ? [categoryWarning] : [],
//     });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error during registration",
//       error: error.message,
//     });
//   }
// };

const acceptTerms = async (req, res) => {
  try {
    if (!req.session?.user?.id) {
      throw new Error("User must be logged in to register.");
    }

    const {
      termsAccepted,
      formData: formDataString,
      productDescription,
    } = req.body;
    const serviceType = req.params.serviceType;
    const documents = req.files || {};
    const documentTypes = req.body.documentTypes
      ? JSON.parse(req.body.documentTypes)
      : Object.keys(documents).map((key) =>
          key.replace("documents[", "").replace("]", "")
        );

    if (!termsAccepted || termsAccepted === "false") {
      return res.status(400).json({
        success: false,
        message: "Terms must be accepted to complete registration",
        field: "termsAccepted",
      });
    }

    if (!formDataString) {
      return res.status(400).json({
        success: false,
        message: "Form data is required",
        field: "formData",
      });
    }

    let formData;
    try {
      formData = JSON.parse(formDataString);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid formData JSON format",
        error: error.message,
      });
    }
    console.log(formData, "form data getting");

    /*** ---- Tiffin Service Logic ---- ***/
    if (serviceType === "tiffin") {
      const {
        restaurantName,
        email,
        ownerPhoneNumber,
        ownerCountryCode,
        cities,
        mealDays,
        flexibleOrderDates,
        category,
        cuisines,
      } = formData;

      if (!restaurantName) {
        return res.status(400).json({
          success: false,
          message: "Tiffin name is required",
        });
      }

      const newTiffin = new Tiffin({
        kitchenName: restaurantName,
        ownerMail: email,
        ownerPhoneNo: {
          countryCode: ownerCountryCode
            ? ownerCountryCode.substring(0, 3)
            : "+91",
          number: ownerPhoneNumber || "",
          fullNumber: ownerCountryCode + ownerPhoneNumber || "",
        },
        category: [
          category === "Both" ? "both" : category?.toLowerCase() || "veg",
        ],
        menu: {
          serviceDays: Array.isArray(mealDays) ? mealDays : [],
          isFlexibleDates: flexibleOrderDates || false,
          plans: [{ label: "Basic" }],
          mealTypes: Array.isArray(cuisines)
            ? cuisines.map((meal) => ({
                label: meal,
                description: `${meal} meal`,
                prices: new Map([["Basic", 0]]),
              }))
            : [],
          instructions: [],
        },
        deliveryCity:
          Array.isArray(cities) && cities.length > 0 ? cities[0] : "",
        ratings: 0,
        kitchenOwner: req.session?.user?.id ? [req.session.user.id] : [],
        newlyAdded: true,
        termsAccepted: true,
        termsAcceptedDate: new Date(),
        registrationStatus: "completed",
      });

      const savedTiffin = await newTiffin.save();

      // Log history
      historyLogRecorder(
        req,
        "Tiffin",
        "CREATE",
        savedTiffin._id,
        `New tiffin service '${savedTiffin.kitchenName}' created and terms accepted.`
      );

      return res.status(201).json({
        success: true,
        message:
          "Tiffin service created, terms accepted. Registration complete!",
        tiffin: {
          id: savedTiffin._id,
          name: savedTiffin.kitchenName,
          registrationStatus: savedTiffin.registrationStatus,
        },
        nextStep: "/tiffin/documents",
      });
    }

    /*** ---- Restaurant Logic ---- ***/
    const {
      restaurantName,
      ownerName,
      ownerPhoneNumber,
      email,
      ownerCountryCode,
      shopNo,
      floorLevel,
      area,
      city,
      landmark,
      services,
      cuisines,
      longitude,
      latitude,
      categoryVeg,
      categoryNonVeg,
      categoryBoth,
    } = formData;

    if (!restaurantName) {
      return res.status(400).json({
        success: false,
        message: "Restaurant name is required",
        field: "restaurantName",
      });
    }

    const mandatoryDocs = [
      "businessRegistrationCertificate",
      "hygieneCertificate",
    ];
    const missingDocs = mandatoryDocs.filter(
      (doc) => !documents[`documents[${doc}]`]
    );
    if (missingDocs.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing mandatory documents: ${missingDocs.join(", ")}`,
        field: "documents",
      });
    }

    const kycDocs = [
      "driverLicense",
      "passport",
      "militaryId",
      "governmentId",
      "permanentResidentCard",
      "citizenshipCertificate",
      "employmentAuthDocument",
      "trustedTravellerID",
      "tribalID",
      "stateId",
    ];
    const hasKycDoc = kycDocs.some((doc) => documents[`documents[${doc}]`]);
    if (!hasKycDoc) {
      return res.status(400).json({
        success: false,
        message: "At least three KYC document is required",
        field: "documents",
      });
    }

    let category;
    let categoryWarning = null;
    if (categoryBoth) {
      category = "Both";
    } else if (categoryVeg) {
      category = "Veg";
    } else if (categoryNonVeg) {
      category = "Non-Veg";
    } else {
      category = "Veg";
      categoryWarning = "No category selected; defaulting to Vegetarian.";
    }

    const fullAddress = `${shopNo ? `Shop ${shopNo}, ` : ""}${
      floorLevel ? `Floor ${floorLevel}, ` : ""
    }${area ? `${area}, ` : ""}${city ? `${city}` : ""}${
      landmark ? `, near ${landmark}` : ""
    }`;

    const newRestaurant = new Firm({
      ownerName,
      ownerEmail: email,
      ownerPhoneNo: {
        countryCode: ownerCountryCode,
        number: ownerPhoneNumber,
        fullNumber: ownerCountryCode + ownerPhoneNumber,
      },
      newlyAdded: true,
      termsAccepted: true,
      termsAcceptedDate: new Date(),
      registrationStatus: "completed",
      restaurantInfo: {
        name: restaurantName,
        phoneNo: ownerPhoneNumber,
        address: fullAddress,
        area: area,
        city: city,
        category:
          category === "Both"
            ? ["veg", "non-veg"]
            : [category?.toLowerCase() || "veg"],
        cuisines: Array.isArray(cuisines)
          ? cuisines
          : cuisines
          ? cuisines.split(",").map((c) => c.trim())
          : [],
        additionalInfo: {},
      },
      features: Array.isArray(services)
        ? services
        : services
        ? services.split(",").map((s) => s.trim())
        : [],
      popularity: 0,
      source_url: "test_registration",
      latitude,
      longitude,
      image_urls: req.body.image_urls || [],
      menu_url: req.body.menu_url || "",
      location: {
        type: "Point",
        coordinates: [longitude || -79.4276471, latitude || 43.6534627],
      },
    });

    const savedRestaurant = await newRestaurant.save();

    let documentRecord = await RestaurantDocument.findOne({
      restaurantId: savedRestaurant._id,
    });

    if (!documentRecord) {
      documentRecord = new RestaurantDocument({
        restaurantId: savedRestaurant._id,
        productDescription: productDescription || "",
      });
    } else {
      documentRecord.productDescription = productDescription || "";
    }

    const filePaths = {};
    for (const documentType of documentTypes) {
      const file = documents[`documents[${documentType}]`]?.[0];
      if (file) {
        documentRecord[documentType] = file.path;
        filePaths[documentType] = file.path;

        historyLogRecorder(
          req,
          "RestaurantDocument",
          "UPDATE",
          documentRecord._id || savedRestaurant._id,
          `Document ${documentType} uploaded for restaurant ${savedRestaurant._id}`
        );
      }
    }

    await documentRecord.save();

    historyLogRecorder(
      req,
      "Firm",
      "CREATE",
      savedRestaurant._id,
      `New restaurant ${restaurantName} created and terms accepted.`
    );

    historyLogRecorder(
      req,
      "Firm",
      "UPDATE",
      savedRestaurant._id,
      `Registration status updated to 'completed' for ${restaurantName}`
    );

    res.status(201).json({
      success: true,
      message:
        "Restaurant created, terms accepted, and documents uploaded. Registration complete!",
      restaurant: {
        id: savedRestaurant._id,
        name: savedRestaurant.restaurantInfo?.name,
        status: savedRestaurant.restaurantStatus,
        registrationStatus: savedRestaurant.registrationStatus,
      },
      filePaths,
      nextStep: "/restaurant/documents",
      warnings: categoryWarning ? [categoryWarning] : [],
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

module.exports = { acceptTerms };
