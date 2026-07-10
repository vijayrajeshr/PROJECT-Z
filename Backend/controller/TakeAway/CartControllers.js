const mongoose = require("mongoose");
const Cart = require("../../models/TakeAwayOrder"); // Adjust path if your Cart model is named differently
const Firm = require("../../models/Firm");
const Tiffin = require("../../models/Tiffin");
const TaxesAndChargesModel = require("../../models/TaxAndCharges");
const historyLogRecorder = require("../../utils/historyLogRecorder"); // Ensure this path is correct
const DeliveryCharge = require("../../models/RestaurantsDasModel/DeliveryCharges");
const Charges = require("../../models/RestaurantsDasModel/Charges");
const Tax = require("../../models/RestaurantsDasModel/Taxes");

// Helper function to calculate tax amount, handling percentage vs decimal rates
const calculateTaxAmount = (subtotal, rate) => {
  const parsedRate = parseFloat(rate);
  if (isNaN(parsedRate) || parsedRate <= 0) return 0;
  // Handle rates like "5%" or "0.05"
  const actualRate = parsedRate >= 1 ? parsedRate / 100 : parsedRate;
  return subtotal * actualRate;
};

// -----------------------------------------------------------------------------
// 1. addItemToCart Function
// -----------------------------------------------------------------------------
/**
 * @desc Add an item to the user's cart or update its quantity if it already exists.
 * @route POST /api/cart/add
 * @access Private (requires user authentication)
 * @param {Object} req.body.itemToAdd - The item details to add to the cart.
 * @param {string} req.body.itemToAdd.productId - The ID of the product.
 * @param {string} req.body.itemToAdd.name - The name of the product.
 * @param {string} req.body.itemToAdd.description - The description of the product.
 * @param {string} req.body.itemToAdd.sourceEntityId - The ID of the source entity (restaurant/kitchen).
 * @param {string} req.body.itemToAdd.itemType - The type of item ('restaurantMenu' or 'tiffin').
 * @param {string} req.body.itemToAdd.sourceEntityName - The name of the source entity.
 * @param {number} req.body.itemToAdd.quantity - The quantity of the item.
 * @param {number} req.body.itemToAdd.price - The price per unit of the item.
 * @param {string} [req.body.itemToAdd.foodType] - The food type (e.g., 'veg', 'non-veg').
 * @param {string} [req.body.itemToAdd.img] - URL of the item image.
 * @param {Object} [req.body.itemToAdd.mealType] - For tiffin, { id: string, name: string }.
 * @param {Object} [req.body.itemToAdd.selectedPlan] - For tiffin, { id: string, name: string } (name can be duration in days).
 * @param {string} [req.body.itemToAdd.startDate] - For tiffin, start date string (e.g., 'YYYY-MM-DD').
 * @param {string} [req.body.itemToAdd.endDate] - For tiffin, end date string (e.g., 'YYYY-MM-DD'), if not provided, calculated from plan.
 * @param {Object} [req.body.itemToAdd.deliverySlot] - For tiffin, the selected delivery time slot.
 * @param {string} req.body.itemToAdd.subcategoryId - The ID of the subcategory the item belongs to.
 * @param {string} req.body.itemToAdd.productModelType - The Mongoose model name for the product ('Menu' or 'TiffinProduct').
 */
const addItemToCart = async (req, res) => {
  try {
    const { itemToAdd } = req.body;

    // User authentication check: prioritize req.session.user.id if available
    const userId = req.session?.user?.id || itemToAdd.userId;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    console.log(
      "Incoming itemToAdd from frontend:",
      JSON.stringify(itemToAdd, null, 2)
    );

    let {
      productId,
      name,
      description,
      sourceEntityId,
      itemType,
      sourceEntityName,
      quantity,
      price,
      foodType,
      img,
      mealType, // Expected: { id: '...', name: '...' } for tiffin
      selectedPlan, // Expected: { id: '...', name: '...' } for tiffin
      startDate,
      endDate,
      deliverySlot, // New field
      subcategoryId, // New field
      categoryId,
      productModelType,
    } = itemToAdd;
    // --- Common Field Validations ---
    if (
      !sourceEntityId ||
      !itemType ||
      !quantity ||
      !price ||
      !sourceEntityName ||
      !productModelType
    ) {
      return res.status(400).json({
        message:
          "Missing required common item fields (sourceEntityId, itemType, quantity, price, sourceEntityName, productModelType).",
      });
    }

    // Additional validation if it's not a tiffin OR categoryId/productId is expected
    if (itemType === "tiffin") {
      if (!productId) {
        return res.status(400).json({
          message: "Missing required field 'productId' for tiffin item.",
        });
      }
    } else {
      if (!productId || !categoryId) {
        return res.status(400).json({
          message:
            "Missing required fields (productId, categoryId) for non-tiffin item.",
        });
      }
    }

    // Validate subcategoryId
    if (subcategoryId && !mongoose.Types.ObjectId.isValid(subcategoryId)) {
      return res
        .status(400)
        .json({ message: "Invalid 'subcategoryId' format." });
    }
    // Validate categoryId
    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid 'categoryId' format." });
    }
    // SubcategoryId is not strictly required for all productModelTypes (e.g., Tiffin does not have a subcategoryId on product level)
    if (productModelType === "Menu" && !subcategoryId) {
      return res
        .status(400)
        .json({ message: "Missing 'subcategoryId' for Menu item type." });
    }

    const formattedPrice = parseFloat(price);
    if (isNaN(formattedPrice) || formattedPrice <= 0 || quantity <= 0) {
      return res.status(400).json({ message: "Invalid price or quantity." });
    }

    let calculatedStartDate = null;
    let calculatedEndDate = null;

    // --- Tiffin-Specific Validations and Date Calculations ---
    if (itemType === "tiffin") {
      // Validate mealType object structure
      if (
        !mealType ||
        typeof mealType !== "object" ||
        !mealType.name ||
        typeof mealType.id === "undefined"
      ) {
        return res.status(400).json({
          message:
            "Invalid or missing 'mealType' object (expected {id, name}) for tiffin item.",
        });
      }
      // Validate selectedPlan object structure
      if (
        !selectedPlan ||
        typeof selectedPlan !== "object" ||
        !selectedPlan.name ||
        typeof selectedPlan.id === "undefined"
      ) {
        return res.status(400).json({
          message:
            "Invalid or missing 'selectedPlan' object (expected {id, name}) for tiffin item.",
        });
      }

      // Validate and parse startDate
      if (startDate) {
        calculatedStartDate = new Date(startDate);
        if (isNaN(calculatedStartDate.getTime())) {
          return res
            .status(400)
            .json({ message: "Invalid 'startDate' format for tiffin item." });
        }
      } else {
        return res
          .status(400)
          .json({ message: "Missing 'startDate' for tiffin item." });
      }

      // Calculate endDate if not provided (based on selectedPlan.name as duration)
      if (!endDate) {
        const duration = Number(selectedPlan.name); // Assuming selectedPlan.name holds the duration in days
        if (isNaN(duration) || duration <= 0) {
          return res.status(400).json({
            message:
              "Invalid or missing plan 'duration' (selectedPlan.name) for tiffin item.",
          });
        }

        calculatedEndDate = new Date(calculatedStartDate);
        calculatedEndDate.setDate(calculatedEndDate.getDate() + duration);
      } else {
        // Validate and parse provided endDate
        calculatedEndDate = new Date(endDate);
        if (isNaN(calculatedEndDate.getTime())) {
          return res
            .status(400)
            .json({ message: "Invalid 'endDate' format for tiffin item." });
        }
      }

      // Final date logic validation
      if (!calculatedStartDate || !calculatedEndDate) {
        return res.status(400).json({
          message:
            "Failed to calculate valid start or end dates for tiffin item.",
        });
      }

      if (calculatedStartDate.getTime() >= calculatedEndDate.getTime()) {
        return res
          .status(400)
          .json({ message: "Tiffin 'startDate' must be before 'endDate'." });
      }

      console.log(
        `Tiffin Item Details: Meal Type: ${mealType.name} (ID: ${
          mealType.id
        }), Plan: ${selectedPlan.name} (ID: ${
          selectedPlan.id
        }), Start Date: ${calculatedStartDate.toISOString()}, End Date: ${calculatedEndDate.toISOString()}`
      );
    }

    // --- Find or Create Cart ---
    let cart = await Cart.findOne({ userId: userId });

    const newItem = {
      productId: new mongoose.Types.ObjectId(productId),
      name,
      description,
      img,
      foodType,
      quantity,
      price: formattedPrice,
      itemType,
      categoryId: new mongoose.Types.ObjectId(categoryId),
      productModelType: productModelType,
      sourceEntityId: new mongoose.Types.ObjectId(sourceEntityId),
      sourceEntityName,
      subcategoryId: new mongoose.Types.ObjectId(subcategoryId),
      selectedDeliveryTimeSlot: deliverySlot,
    };

    // Add tiffin-specific fields to newItem if applicable
    if (itemType === "tiffin") {
      newItem.mealType = mealType; // Assigns { id: '...', name: '...' }
      newItem.selectedPlan = selectedPlan; // Assigns { id: '...', name: '...' }
      newItem.startDate = calculatedStartDate;
      newItem.endDate = calculatedEndDate;
    }

    if (!cart) {
      // Create a new cart if one doesn't exist for the user
      cart = new Cart({
        userId: userId,
        items: [newItem],
        subtotal: newItem.price * newItem.quantity,
        deliveryFee: 0, // Will be calculated by fetchCart
        platformFee: 0, // Will be calculated by fetchCart
        gstCharges: 0, // Will be calculated by fetchCart
        totalOtherCharges: 0,
        otherTaxes: 0,
        totalPrice: 0,
      });
    } else {
      // Check if the item already exists in the cart to update quantity
      const existingItem = cart.items.find((item) => {
        // Common criteria for matching items
        const commonMatch =
          item.productId.toString() === newItem.productId.toString() &&
          item.sourceEntityId.toString() ===
            newItem.sourceEntityId.toString() &&
          item.itemType === newItem.itemType &&
          item.productModelType === newItem.productModelType &&
          // Ensure subcategoryId is compared only if both items have it
          ((!item.subcategoryId && !newItem.subcategoryId) ||
            (item.subcategoryId &&
              newItem.subcategoryId &&
              item.subcategoryId.toString() ===
                newItem.subcategoryId.toString()));

        if (item.itemType === "tiffin" && newItem.itemType === "tiffin") {
          // For tiffin items, also match on mealType, selectedPlan, and dates
          return (
            commonMatch &&
            item.mealType &&
            newItem.mealType &&
            item.mealType.id === newItem.mealType.id &&
            item.mealType.name === newItem.mealType.name &&
            item.selectedPlan &&
            newItem.selectedPlan &&
            item.selectedPlan.id === newItem.selectedPlan.id &&
            item.selectedPlan.name === newItem.selectedPlan.name &&
            new Date(item.startDate).getTime() ===
              new Date(newItem.startDate).getTime() &&
            new Date(item.endDate).getTime() ===
              new Date(newItem.endDate).getTime()
          );
        }
        // For non-tiffin items, commonMatch is sufficient
        return commonMatch;
      });

      if (existingItem) {
        // If item exists, increase its quantity
        existingItem.quantity += newItem.quantity;
      } else {
        // If item is new, add it to the cart
        cart.items.push(newItem);
      }
    }
    // Save the updated or new cart. Totals will be fully calculated by fetchCart
    await cart.save();
    // After adding/updating, call fetchCart internally to get full calculations and return
    // This makes sure the response always has up-to-date totals and details.
    req.session.user = req.session.user || {};
    req.session.user.id = userId; // Ensure userId is set for fetchCart
    await fetchCart(req, res); // Pass req and res to fetchCart for response handling directly.
    // The original res.status(200).json(cart) from addItemToCart is replaced by fetchCart's response.

    // Log history (optional, if you want to log before fetchCart sends response)
    historyLogRecorder(
      req,
      Cart.modelName,
      "CREATE_OR_UPDATE",
      cart._id,
      `Item added/updated in cart for user ${userId}.`
    );
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

// -----------------------------------------------------------------------------
// 2. fetchCart Function
// -----------------------------------------------------------------------------
/**
 * @desc Fetches the user's cart, calculates subtotals, taxes, delivery, and platform fees.
 * @route GET /api/cart/fetch
 * @access Private (requires user authentication)
 */
const fetchCart = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    console.log("User ID from session for fetchCart:", userId);
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      refPath: "items.productModelType",
      select: "name description price priceINR foodType category isAvailable",
    });

    if (!cart) {
      // If cart is empty or not found, return empty cart details
      return res.status(200).json({
        userId: userId,
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        platformFee: 0,
        gstCharges: 0,
        otherTaxes: 0,
        totalOtherCharges: 0,
        totalPrice: 0,
        taxDetails: [],
        overallDeliveryFee: 0,
        overallPlatformFee: 0,
        overallGstCharges: 0,
        overallOtherTaxes: 0,
        overallOtherCharges: 0,
        allOtherChargesDetails: [],
        overallTotalPrice: 0,
        avgFirmSubcategoryTax: "0.00%",
        message: "Cart not found or is empty.",
      });
    }

    // --- Step 1: Fetch all unique source entities (Firms/Tiffins) ---
    const uniqueSourceEntities = new Map(); // Using a Map for efficient lookup
    cart.items.forEach((item) => {
      if (item.sourceEntityId && item.sourceEntityName) {
        const key = `${
          item.sourceEntityName
        }-${item.sourceEntityId.toString()}`;
        if (!uniqueSourceEntities.has(key)) {
          uniqueSourceEntities.set(key, {
            id: item.sourceEntityId,
            model: item.sourceEntityName,
          });
        }
      }
    });

    const fetchedEntitiesData = {};
    let primarySourceEntity = null; // Used for delivery/platform fees

    for (const [key, { id, model }] of uniqueSourceEntities.entries()) {
      let entity = null;
      if (model === "Firm") {
        entity = await Firm.findById(id).lean();
      } else if (model === "Tiffin") {
        entity = await Tiffin.findById(id).lean();
      }

      if (entity) {
        fetchedEntitiesData[key] = entity;
        // Set the primary source entity if not already set (arbitrarily takes the first one)
        if (!primarySourceEntity) {
          primarySourceEntity = { data: entity, modelType: model };
        }
      } else {
        console.warn(`Source entity ${model} with ID ${id} not found.`);
      }
    }

    // --- Step 2: Group cart items by their source entity and calculate subtotals ---
    const entityGroups = {};
    cart.items.forEach((item) => {
      const key = `${item.sourceEntityName}-${item.sourceEntityId?.toString()}`;
      const sourceEntityData = fetchedEntitiesData[key];

      if (!sourceEntityData) {
        console.warn(
          `Item '${item.name}' source entity data not found. Skipping item in grouping.`
        );
        return;
      }

      const entityId = sourceEntityData._id?.toString();
      if (!entityId) {
        console.warn(
          `Fetched source entity for '${item.name}' has no ID. Skipping item.`
        );
        return;
      }

      // Determine entity-specific display info
      let name = "";
      let address = "";
      let country = "default";
      let imageUrl = "";

      if (item.sourceEntityName === "Firm") {
        name = sourceEntityData.restaurantInfo?.name || "Unknown Restaurant";
        address = sourceEntityData.restaurantInfo?.address || "";
        country = sourceEntityData.restaurantInfo?.city || "India"; // Default to India if city is missing
        imageUrl = sourceEntityData?.image_urls?.[0] || "";
      } else if (item.sourceEntityName === "Tiffin") {
        name = sourceEntityData.kitchenName || "Unknown Tiffin Service";
        address = sourceEntityData.address || "";
        imageUrl = sourceEntityData?.images?.[0] || "";
      }

      // Initialize group if it doesn't exist
      if (!entityGroups[entityId]) {
        entityGroups[entityId] = {
          items: [],
          subtotal: 0,
          name: name,
          address: address,
          country: country,
          imageUrl: imageUrl,
          sourceEntityName: item.sourceEntityName,
        };
      }

      // Add item to group and update subtotal
      entityGroups[entityId].items.push(item);
      const itemPrice = item.price || 0;
      const itemQuantity = item.quantity || 0;
      entityGroups[entityId].subtotal += itemQuantity * itemPrice;
    });

    // --- Step 3: Calculate taxes per entity group ---
    let totalGst = 0;
    let totalOtherTaxes = 0;
    const entityTaxDetails = [];
    let firmSubcategoryRates = []; // For calculating average subcategory tax for Firms

    const currentDate = new Date(); // Define currentDate once for efficiency

    for (const entityId in entityGroups) {
      const group = entityGroups[entityId];
      const subtotal = isNaN(group.subtotal) ? 0 : group.subtotal;
      const country = group.country;
      const sourceEntityKey = `${group.sourceEntityName}-${entityId}`;
      const currentEntityFetched = fetchedEntitiesData[sourceEntityKey];

      let entityGstAmount = 0;
      let entityOtherTaxAmount = 0;
      const appliedTaxes = [];
      const itemTaxBreakdown = []; // For Firm items

      if (group.sourceEntityName === "Tiffin") {
        // Tiffin-specific taxes from the Tiffin model's 'tax' array
        if (currentEntityFetched?.tax && currentEntityFetched.tax.length > 0) {
          currentEntityFetched.tax.forEach((t) => {
            if (
              t.isApplicable === true &&
              t.rate !== undefined &&
              t.rate !== null
            ) {
              const currentTaxAmount = calculateTaxAmount(subtotal, t.rate);
              if (currentTaxAmount > 0) {
                if (t.name && t.name.toLowerCase() === "gst") {
                  entityGstAmount += currentTaxAmount;
                } else {
                  entityOtherTaxAmount += currentTaxAmount;
                }
                appliedTaxes.push({
                  name: t.name,
                  rate: parseFloat(t.rate), // Store original rate for display
                  amount: parseFloat(currentTaxAmount.toFixed(2)),
                });
              }
            }
          });
        }
      } else if (group.sourceEntityName === "Firm") {
        // For Firms, iterate through items to apply subcategory-specific taxes or global fallback
        // const taxSummaryMap = {}; // { "Municipal Tax": { rate: 2, amount: 5.0 }, ... }

        // for (const item of group.items) {
        //   const itemSubtotal = item.quantity * item.price;
        //   let itemTaxRate = 0;
        //   let itemGstAmount = 0;

        //   const subTax = await Tax.find({
        //     firm: item.sourceEntityId,
        //     subCategory: item.subcategoryId,
        //     applicableFor: { $in: ["takeaway", "all"] },
        //     isApplicable: true,
        //     effectiveFrom: { $lte: currentDate },
        //     effectiveTo: { $gte: currentDate },
        //   });

        //   if (subTax && subTax.length > 0) {
        //     for (const tax of subTax) {
        //       const rateValue =
        //         parseFloat(tax.rate.toString().replace("%", "")) / 100;
        //       const taxAmount = itemSubtotal * rateValue;

        //       // Accumulate tax amount in taxSummaryMap
        //       if (!taxSummaryMap[tax.name]) {
        //         taxSummaryMap[tax.name] = {
        //           rate: parseFloat(tax.rate),
        //           amount: 0,
        //         };
        //       }
        //       taxSummaryMap[tax.name].amount += taxAmount;

        //       if (tax.name.toLowerCase() === "gst") {
        //         entityGstAmount += taxAmount;
        //       } else {
        //         entityOtherTaxAmount += taxAmount;
        //       }

        //       itemTaxBreakdown.push({
        //         itemName: item.name,
        //         quantity: item.quantity,
        //         price: item.price,
        //         subcategoryId: item.subcategoryId,
        //         taxRate: rateValue,
        //         taxAmount: parseFloat(taxAmount.toFixed(2)),
        //       });
        //     }
        //   } else {
        //     // Fallback GST logic
        //     const globalTax = await TaxesAndChargesModel.findOne({
        //       countryName: country,
        //       taxType: "GST",
        //     });
        //     if (globalTax?.rate) {
        //       itemTaxRate =
        //         parseFloat(globalTax.rate.toString().replace("%", "")) / 100;
        //     } else {
        //       itemTaxRate = 0.05;
        //     }

        //     itemGstAmount = itemSubtotal * itemTaxRate;
        //     entityGstAmount += itemGstAmount;

        //     // Push fallback GST to item breakdown
        //     itemTaxBreakdown.push({
        //       itemName: item.name,
        //       quantity: item.quantity,
        //       price: item.price,
        //       subcategoryId: item.subcategoryId,
        //       taxRate: itemTaxRate,
        //       taxAmount: parseFloat(itemGstAmount.toFixed(2)),
        //     });

        //     // Also accumulate in taxSummaryMap
        //     const fallbackRate = itemTaxRate * 100;
        //     if (!taxSummaryMap["GST"]) {
        //       taxSummaryMap["GST"] = { rate: fallbackRate, amount: 0 };
        //     }
        //     taxSummaryMap["GST"].amount += itemGstAmount;
        //   }
        // }

        const taxSummaryMap = {}; // { "Municipal Tax": { rate: 2, amount: 5.0 }, ... }

        for (const item of group.items) {
          const itemSubtotal = item.quantity * item.price;
          let itemGstAmount = 0;
          let gstApplied = false;
          let itemHasTax = false;

          const subTax = await Tax.find({
            firm: item.sourceEntityId,
            subCategory: item.subcategoryId,
            applicableFor: { $in: ["takeaway", "all"] },
            isApplicable: true,
            effectiveFrom: { $lte: currentDate },
            effectiveTo: { $gte: currentDate },
          });

          if (subTax && subTax.length > 0) {
            itemHasTax = true;
            for (const tax of subTax) {
              const rateValue =
                parseFloat(tax.rate.toString().replace("%", "")) / 100;
              const taxAmount = itemSubtotal * rateValue;

              // Accumulate tax amount in taxSummaryMap
              if (!taxSummaryMap[tax.name]) {
                taxSummaryMap[tax.name] = {
                  rate: parseFloat(tax.rate),
                  amount: 0,
                };
              }
              taxSummaryMap[tax.name].amount += taxAmount;

              if (tax.name.toLowerCase() === "gst") {
                entityGstAmount += taxAmount;
                gstApplied = true;
              } else {
                entityOtherTaxAmount += taxAmount;
              }

              itemTaxBreakdown.push({
                itemName: item.name,
                quantity: item.quantity,
                price: item.price,
                subcategoryId: item.subcategoryId,
                taxRate: rateValue,
                taxAmount: parseFloat(taxAmount.toFixed(2)),
              });
            }
          }

          if (!gstApplied) {
            let defaultGstRate = 0.05; // 5%
            const globalTax = await TaxesAndChargesModel.findOne({
              countryName: country,
              taxType: "GST",
            });

            if (globalTax?.rate) {
              defaultGstRate =
                parseFloat(globalTax.rate.toString().replace("%", "")) / 100;
            }

            itemGstAmount = itemSubtotal * defaultGstRate;
            entityGstAmount += itemGstAmount;

            // Update taxSummaryMap
            const fallbackRate = defaultGstRate * 100;
            if (!taxSummaryMap["GST"]) {
              taxSummaryMap["GST"] = { rate: fallbackRate, amount: 0 };
            }
            taxSummaryMap["GST"].amount += itemGstAmount;

            // Add to breakdown
            itemTaxBreakdown.push({
              itemName: item.name,
              quantity: item.quantity,
              price: item.price,
              subcategoryId: item.subcategoryId,
              taxRate: defaultGstRate,
              taxAmount: parseFloat(itemGstAmount.toFixed(2)),
            });
          }
        }

        // Push all aggregated subcategory taxes
        for (const [taxName, data] of Object.entries(taxSummaryMap)) {
          appliedTaxes.push({
            name: taxName,
            rate: data.rate,
            amount: parseFloat(data.amount.toFixed(2)),
          });
        }

        // Add the aggregated GST for this Firm to appliedTaxes
        // if (entityGstAmount > 0) {
        //   appliedTaxes.push({
        //     name: "GST", // This represents the total GST for the firm
        //     rate: ((entityGstAmount / subtotal) * 100).toFixed(2), // Effective average rate for display
        //     amount: parseFloat(entityGstAmount.toFixed(2)),
        //   });
        // }
      }

      totalGst += isNaN(entityGstAmount) ? 0 : entityGstAmount;
      totalOtherTaxes += isNaN(entityOtherTaxAmount) ? 0 : entityOtherTaxAmount;

      entityTaxDetails.push({
        entityId,
        name: group.name,
        address: group.address,
        itemType: group.sourceEntityName,
        image: group.imageUrl,
        country: group.country,
        subtotal: parseFloat(subtotal.toFixed(2)),
        gstAmount: parseFloat(entityGstAmount.toFixed(2)),
        otherTaxAmount: parseFloat(entityOtherTaxAmount.toFixed(2)),
        appliedTaxes: appliedTaxes,
        itemTaxBreakdown: itemTaxBreakdown, // Detailed breakdown for Firm items
      });
    }

    // Calculate average subcategory tax for Firms (if any rates were collected)
    let averageSubcategoryTax = 0;
    if (firmSubcategoryRates.length > 0) {
      const sum = firmSubcategoryRates.reduce((acc, rate) => acc + rate, 0);
      averageSubcategoryTax = (sum / firmSubcategoryRates.length) * 100;
    }

    // --- Step 4: Calculate delivery, platform, and other charges ---
    let deliveryFee = 0;
    let platformFee = 0;
    const allOtherChargesDetails = []; // Renamed for clarity

    if (primarySourceEntity) {
      if (primarySourceEntity.modelType === "Tiffin") {
        const tiffinData = primarySourceEntity.data;

        const userDeliveryDistanceKm = 15; // TODO: THIS NEEDS TO BE CALCULATED DYNAMICALLY
        console.log(
          `Calculating delivery fee for Tiffin (${tiffinData.kitchenName}) with user distance: ${userDeliveryDistanceKm} km`
        );

        let applicableDeliveryCharge = null;
        if (tiffinData.deliveryCharge && tiffinData.deliveryCharge.length > 0) {
          const sortedDeliveryCharges = tiffinData.deliveryCharge.sort(
            (a, b) => a.minDistance - b.minDistance
          );

          for (const dc of sortedDeliveryCharges) {
            if (
              dc.isActive &&
              userDeliveryDistanceKm >= dc.minDistance &&
              userDeliveryDistanceKm <= dc.maxDistance
            ) {
              applicableDeliveryCharge = dc;
              break;
            }
          }
        }
        deliveryFee = applicableDeliveryCharge
          ? parseFloat(applicableDeliveryCharge.charge)
          : 0;
        if (isNaN(deliveryFee)) deliveryFee = 0;

        // Find and apply platform fee (SSD)
        const tiffinPlatformCharge = tiffinData.charges?.find(
          (charge) =>
            charge.name === "SSD" &&
            charge.isApplicable &&
            charge.type === "flat"
        );
        platformFee = tiffinPlatformCharge
          ? parseFloat(tiffinPlatformCharge.value)
          : 0;
        if (isNaN(platformFee)) platformFee = 0;

        // Add other custom charges for Tiffin
        tiffinData.charges?.forEach((charge) => {
          if (charge.isApplicable && charge.name !== "SSD") {
            // Exclude SSD as it's handled as platformFee
            const chargeValue = parseFloat(charge.value);
            if (!isNaN(chargeValue)) {
              allOtherChargesDetails.push({
                name: charge.name,
                value: parseFloat(chargeValue.toFixed(2)),
                type: charge.type,
              });
            }
          }
        });
      } else if (primarySourceEntity.modelType === "Firm") {
        try {
          const firmId = primarySourceEntity.data._id;
          const allOthersCharges = await Charges.find({
            firm: firmId,
            isApplicable: true,
          });

          if (allOthersCharges) {
            allOthersCharges.forEach((charge) => {
              if (
                charge.isApplicable &&
                charge.normalizedName !== "platformfee"
              ) {
                const chargeValue = parseFloat(charge.value);
                if (!isNaN(chargeValue)) {
                  allOtherChargesDetails.push({
                    name: charge.name,
                    value: parseFloat(chargeValue.toFixed(2)),
                    type: charge.type,
                  });
                }
              }
            });
          }
          // const firmDeliveryCharges = await DeliveryCharge.findOne({
          //   firm: firmId,
          //   isActive: true,
          // });
          // deliveryFee = firmDeliveryCharges?.charge
          //   ? parseFloat(firmDeliveryCharges.charge)
          //   : 35;
          // if (isNaN(deliveryFee)) deliveryFee = 35; // Default if not found or invalid

          const firmPlatformCharges = await Charges.findOne({
            name: { $regex: /^platform[\s_-]*fee$/i },
            firm: firmId,
            isApplicable: true,
          });
          platformFee = firmPlatformCharges?.value
            ? parseFloat(firmPlatformCharges.value)
            : 10;
          if (isNaN(platformFee)) platformFee = 10; // Default if not found or invalid
        } catch (chargeErr) {
          console.error(
            "Error fetching Firm specific charges:",
            chargeErr.message
          );
          deliveryFee = 35; // Fallback defaults
          platformFee = 10; // Fallback defaults
        }
      }
    }

    const actualCartSubtotal = Object.values(entityGroups).reduce(
      (acc, group) => acc + group.subtotal,
      0
    );

    const totalOtherCharges = allOtherChargesDetails.reduce((sum, charge) => {
      const value = Number(charge.value) || 0;

      if (charge.type === "percentage") {
        return sum + (cart.subtotal * value) / 100;
      } else if (charge.type === "flat") {
        return sum + value;
      } else if (charge.type === "item") {
        // Calculate per unit (quantity-based)
        const totalUnits =
          cart.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;
        return sum + totalUnits * value;
      } else {
        return sum; // skip unknown types
      }
    }, 0);

    console.log("--- DEBUG: Final totalPrice Calculation Components ---");
    console.log("actualCartSubtotal:", actualCartSubtotal);
    console.log("deliveryFee:", deliveryFee);
    console.log("platformFee:", platformFee);
    console.log("totalGst:", totalGst);
    console.log("totalOtherTaxes:", totalOtherTaxes);
    console.log("totalOtherCharges:", totalOtherCharges);
    console.log("--- End Final totalPrice Calculation Components ---");

    cart.subtotal = parseFloat(actualCartSubtotal.toFixed(2));
    cart.gstCharges = parseFloat(totalGst.toFixed(2));
    cart.otherTaxes = parseFloat(totalOtherTaxes.toFixed(2));
    cart.deliveryFee = parseFloat(deliveryFee.toFixed(2));
    cart.platformFee = parseFloat(platformFee.toFixed(2));
    cart.totalOtherCharges = parseFloat(totalOtherCharges.toFixed(2));

    cart.totalPrice = parseFloat(
      (
        actualCartSubtotal +
        deliveryFee +
        platformFee +
        totalGst +
        totalOtherTaxes +
        totalOtherCharges
      ).toFixed(2)
    );

    console.log("Final Cart Object:", cart);

    // Extract primary address from entityGroups for the pickup/delivery
    let primaryAddress = "";
    let lat = null;
    let lng = null;
    const firstGroupKey = Object.keys(entityGroups)[0];
    if (firstGroupKey && entityGroups[firstGroupKey]) {
      primaryAddress = entityGroups[firstGroupKey].address || "";
      // Try to get coordinates from Firm or Tiffin model
      const entity = entityGroups[firstGroupKey];
      if (entity.sourceEntityName === "Firm" && entity.sourceEntityId) {
        const firm = await Firm.findById(entity.sourceEntityId).lean();
        if (firm) {
          lat = parseFloat(firm.latitude);
          lng = parseFloat(firm.longitude);
        }
      } else if (entity.sourceEntityName === "Tiffin" && entity.sourceEntityId) {
        const tiffin = await Tiffin.findById(entity.sourceEntityId).lean();
        if (tiffin && tiffin.location && Array.isArray(tiffin.location.coordinates)) {
          lng = tiffin.location.coordinates[0];
          lat = tiffin.location.coordinates[1];
        }
      }
    }
    console.log("[fetchCart] Extracted primary address:", primaryAddress);
    console.log("[fetchCart] Entity groups:", Object.keys(entityGroups));
    console.log("[fetchCart] Found coordinates:", lat, lng);

    res.status(200).json({
      ...cart.toObject(),
      address: primaryAddress, // Add address to the response
      lat,
      lng,
      taxDetails: entityTaxDetails,
      overallDeliveryFee: deliveryFee,
      overallPlatformFee: platformFee,
      overallGstCharges: cart.gstCharges,
      overallOtherTaxes: cart.otherTaxes,
      overallOtherCharges: cart.totalOtherCharges,
      allOtherChargesDetails: allOtherChargesDetails, // Details of other charges
      overallTotalPrice: cart.totalPrice,
      avgFirmSubcategoryTax: `${averageSubcategoryTax.toFixed(2)}%`, // Added for firms
    });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// -----------------------------------------------------------------------------
// 3. updateCart Function
// -----------------------------------------------------------------------------
/**
 * @desc Updates the user's cart items and recalculates totals.
 * @route PUT /api/cart/update
 * @access Private (requires user authentication)
 * @param {Array<Object>} req.body.items - An array of cart items to update the cart with.
 */
const updateCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.session?.user?.id || req.body.userId; // Prioritize session
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Update cart items directly
    cart.items = items;

    // Populate sourceEntityId for calculation of taxes and fees later
    await cart.populate({
      path: "items.sourceEntityId",
      select: `
                restaurantInfo.name
                restaurantInfo.address
                restaurantInfo.country
                kitchenName
                address
                deliveryCity
            `,
    });

    // Recalculate subtotal based on the updated items
    cart.subtotal = items.reduce((acc, item) => {
      const price = isNaN(item.price) ? 0 : item.price;
      const quantity = isNaN(item.quantity) ? 0 : item.quantity;
      return acc + quantity * price;
    }, 0);

    // Group items by source entity for tax calculation
    const entityGroups = {};
    cart.items.forEach((item) => {
      const entityId = item.sourceEntityId?._id?.toString();
      if (!entityId) {
        console.warn(
          `Item '${item.name}' has unpopulated sourceEntityId during update. Skipping.`
        );
        return;
      }

      if (!entityGroups[entityId]) {
        let country = "default";
        if (item.itemType === "restaurantMenu" && item.sourceEntityId) {
          country = item.sourceEntityId.restaurantInfo?.country || "default";
        } else if (item.itemType === "tiffin" && item.sourceEntityId) {
          const city = item.sourceEntityId.deliveryCity;
          if (city && city.includes("India")) country = "India";
        }

        entityGroups[entityId] = {
          items: [],
          subtotal: 0,
          country: country,
          sourceEntityName:
            item.itemType === "restaurantMenu" ? "Firm" : "Tiffin", // Ensure sourceEntityName is correct
        };
      }

      entityGroups[entityId].items.push(item);
      const itemPrice = item.price || 0;
      const quantity = item.quantity || 0;
      entityGroups[entityId].subtotal += quantity * itemPrice;
    });

    let totalGst = 0;
    let totalOtherTaxes = 0;
    const currentDate = new Date();

    for (const entityId in entityGroups) {
      const group = entityGroups[entityId];
      const country = group.country;
      let entityGstAmount = 0;
      let entityOtherTaxAmount = 0;

      if (group.sourceEntityName === "Tiffin") {
        // Fetch Tiffin data to get its specific taxes
        const tiffinData = await Tiffin.findById(entityId).lean();
        if (tiffinData?.tax && tiffinData.tax.length > 0) {
          tiffinData.tax.forEach((t) => {
            if (t.isApplicable && t.rate !== undefined && t.rate !== null) {
              const currentTaxAmount = calculateTaxAmount(
                group.subtotal,
                t.rate
              );
              if (t.name && t.name.toLowerCase() === "gst") {
                entityGstAmount += currentTaxAmount;
              } else {
                entityOtherTaxAmount += currentTaxAmount;
              }
            }
          });
        }
      } else if (group.sourceEntityName === "Firm") {
        // For Firms, calculate GST based on subcategories or global fallback
        for (const item of group.items) {
          const itemSubtotal = item.quantity * item.price;
          let itemTaxRate = 0;

          const subTax = await Tax.findOne({
            firm: item.sourceEntityId,
            subCategory: item.subcategoryId,
            applicableFor: { $in: ["takeaway", "all"] },
            isCompulsory: true,
            isApplicable: true,
            effectiveFrom: { $lte: currentDate },
            effectiveTo: { $gte: currentDate },
          });

          if (subTax?.rate) {
            itemTaxRate =
              parseFloat(subTax.rate.toString().replace("%", "")) / 100;
          } else {
            const globalTax = await TaxesAndChargesModel.findOne({
              countryName: country,
              taxType: "GST",
            });
            if (globalTax?.rate) {
              itemTaxRate =
                parseFloat(globalTax.rate.toString().replace("%", "")) / 100;
            } else {
              itemTaxRate = 0.05; // Default if no global tax found
            }
          }
          entityGstAmount += itemSubtotal * itemTaxRate;
        }
      }

      totalGst += isNaN(entityGstAmount) ? 0 : entityGstAmount;
      totalOtherTaxes += isNaN(entityOtherTaxAmount) ? 0 : entityOtherTaxAmount;
    }

    // Calculate delivery and platform fees (assuming primarySourceEntity logic from fetchCart can be adapted or retrieved)
    let deliveryFee = 0;
    let platformFee = 0;
    const allOtherChargesDetails = [];

    // To determine primarySourceEntity for charges, we need to re-fetch it or pass it.
    // For simplicity in this update, we'll assume the first item's source entity
    // dictates delivery/platform fees, or retrieve the dominant one.
    // A more robust solution might involve a separate "getCartCharges" utility.
    if (cart.items.length > 0) {
      const firstItemSourceEntityId = cart.items[0].sourceEntityId;
      const firstItemSourceEntityModelType =
        cart.items[0].itemType === "restaurantMenu" ? "Firm" : "Tiffin";
      let mainEntity = null;

      if (firstItemSourceEntityModelType === "Firm") {
        mainEntity = await Firm.findById(firstItemSourceEntityId).lean();
      } else if (firstItemSourceEntityModelType === "Tiffin") {
        mainEntity = await Tiffin.findById(firstItemSourceEntityId).lean();
      }

      if (mainEntity) {
        if (firstItemSourceEntityModelType === "Tiffin") {
          const userDeliveryDistanceKm = 15; // TODO: Same dynamic calculation needed here
          let applicableDeliveryCharge = null;
          if (
            mainEntity.deliveryCharge &&
            mainEntity.deliveryCharge.length > 0
          ) {
            const sortedDeliveryCharges = mainEntity.deliveryCharge.sort(
              (a, b) => a.minDistance - b.minDistance
            );
            for (const dc of sortedDeliveryCharges) {
              if (
                dc.isActive &&
                userDeliveryDistanceKm >= dc.minDistance &&
                userDeliveryDistanceKm <= dc.maxDistance
              ) {
                applicableDeliveryCharge = dc;
                break;
              }
            }
          }
          deliveryFee = applicableDeliveryCharge
            ? parseFloat(applicableDeliveryCharge.charge)
            : 0;

          const tiffinPlatformCharge = mainEntity.charges?.find(
            (charge) =>
              charge.name === "SSD" &&
              charge.isApplicable &&
              charge.type === "flat"
          );
          platformFee = tiffinPlatformCharge
            ? parseFloat(tiffinPlatformCharge.value)
            : 0;

          mainEntity.charges?.forEach((charge) => {
            if (charge.isApplicable && charge.name !== "SSD") {
              const chargeValue = parseFloat(charge.value);
              if (!isNaN(chargeValue)) {
                allOtherChargesDetails.push({
                  name: charge.name,
                  value: parseFloat(chargeValue.toFixed(2)),
                  type: charge.type,
                });
              }
            }
          });
        } else if (firstItemSourceEntityModelType === "Firm") {
          const firmId = mainEntity._id;
          const allOthersCharges = await Charges.find({
            firm: firmId,
            isApplicable: true,
          });
          if (allOthersCharges) {
            allOthersCharges.forEach((charge) => {
              if (
                charge.isApplicable &&
                charge.normalizedName !== "platformfee"
              ) {
                const chargeValue = parseFloat(charge.value);
                if (!isNaN(chargeValue)) {
                  allOtherChargesDetails.push({
                    name: charge.name,
                    value: parseFloat(chargeValue.toFixed(2)),
                    type: charge.type,
                  });
                }
              }
            });
          }
          // const firmDeliveryCharges = await DeliveryCharge.findOne({
          //   firm: firmId,
          //   isActive: true,
          // });
          // deliveryFee = firmDeliveryCharges?.charge
          //   ? parseFloat(firmDeliveryCharges.charge)
          //   : 0;

          const firmPlatform = await Charges.findOne({
            name: { $regex: /^platform[\s_-]*fee$/i },
            firm: firmId,
            isApplicable: true,
          });
          platformFee = firmPlatform?.value
            ? parseFloat(firmPlatform.value)
            : 0;
        }
      }
    }

    const totalOtherCharges = allOtherChargesDetails.reduce((sum, charge) => {
      const value = Number(charge.value) || 0;

      if (charge.type === "percentage") {
        return sum + (cart.subtotal * value) / 100;
      } else if (charge.type === "flat") {
        return sum + value;
      } else if (charge.type === "item") {
        // Calculate per unit (quantity-based)
        const totalUnits =
          cart.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;
        return sum + totalUnits * value;
      } else {
        return sum; // skip unknown types
      }
    }, 0);

    // Assign calculated values to cart object
    cart.gstCharges = parseFloat(totalGst.toFixed(2));
    cart.otherTaxes = parseFloat(totalOtherTaxes.toFixed(2));
    cart.deliveryFee = parseFloat(deliveryFee.toFixed(2));
    cart.platformFee = parseFloat(platformFee.toFixed(2));
    cart.totalOtherCharges = parseFloat(totalOtherCharges.toFixed(2));

    cart.totalPrice = parseFloat(
      (
        cart.subtotal +
        cart.deliveryFee +
        cart.platformFee +
        cart.gstCharges +
        cart.otherTaxes +
        cart.totalOtherCharges
      ).toFixed(2)
    );

    await cart.save(); // Save the updated cart

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// -----------------------------------------------------------------------------
// 4. cartLength Function
// -----------------------------------------------------------------------------
/**
 * @desc Get the number of unique items in the user's cart.
 * @route GET /api/cart/length
 * @access Private (requires user authentication)
 */
const cartLength = async (req, res) => {
  try {
    const userId = req.session?.user?.id;

    if (!userId) {
      return res
        .status(200)
        .json({ length: 0, message: "Please login to show the cart details" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({ length: 0, message: "Cart is empty" });
    }

    const cartLength = cart.items.length;

    return res.status(200).json({ length: cartLength });
  } catch (error) {
    console.error("Error calculating cart length:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Export all functions
module.exports = {
  addItemToCart,
  fetchCart,
  updateCart,
  cartLength,
};
