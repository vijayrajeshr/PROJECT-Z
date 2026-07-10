// const Category = require("../models/RestaurantDasModel/categorySubCategory");

const Category = require("../../models/RestaurantsDasModel/categorySubCategory");
const MenuItem = require("../../models/MenuItem"); // Assuming the schema file is named MenuItem.js
// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ parentCategory: null }).populate(
      "subcategories"
    );
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific category with subcategories
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "subcategories"
    );
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get subcategories for a specific category
exports.getSubcategories = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const subcategories = await Category.find({ parentCategory: categoryId });
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, parentCategoryId } = req.body;
    const newCategory = new Category({
      name,
      parentCategory: parentCategoryId || null,
    });

    const savedCategory = await newCategory.save();

    // If this is a subcategory, update the parent
    // if (parentCategoryId) {
    //   const parentCategory = await Category.findById(parentCategoryId);
    //   if (parentCategory) {
    //     parentCategory.subcategories.push(savedCategory._id);
    //     parentCategory.subCount += 1;
    //     await parentCategory.save();
    //   }
    // }

    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createSubCategory = async (req, res) => {
  try {
    const { name, parentCategoryId } = req.body;
    const newCategory = new Category({
      name,
      parentCategory: parentCategoryId || null,
    });
    const savedCategory = await newCategory.save();
    // If this is a subcategory, update the parent
    if (parentCategoryId) {
      const parentCategory = await Category.findOne({
        parentCategory: parentCategoryId,
      });
      if (parentCategory) {
        parentCategory.subcategories.push(savedCategory._id);
        parentCategory.subCount += 1;
        await parentCategory.save();
      }
    }

    res.status(201).json(true);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!updatedCategory)
      return res.status(404).json({ message: "Category not found" });

    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // Handle subcategories
    const deleteSubcategories = async (categoryId) => {
      const cat = await Category.findById(categoryId);
      if (cat) {
        for (const subId of cat.subcategories) {
          await deleteSubcategories(subId);
        }
        await Category.findByIdAndDelete(categoryId);
      }
    };

    // Update parent if this is a subcategory
    if (category.parentCategory) {
      const parentCategory = await Category.findById(category.parentCategory);
      if (parentCategory) {
        parentCategory.subcategories = parentCategory.subcategories.filter(
          (subId) => !subId.equals(category._id)
        );
        parentCategory.subCount -= 1;
        await parentCategory.save();
      }
    }

    // Delete the category and all its subcategories
    await deleteSubcategories(req.params.id);

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update item count for a category
exports.updateItemCount = async (req, res) => {
  try {
    const { change } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    category.itemCount = Math.max(0, category.itemCount + change);
    await category.save();

    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST method to create a new menu item
exports.createMenuItem = async (req, res) => {
  try {
    // Extract data from request body
    const {
      name,
      price,
      description,
      variations,
      dietary,
      category,
      group,
      images,
      bestSeller,
      firm,
    } = req.body;

    // Validate required fields
    if (!name || !price || !category || !firm) {
      return res.status(400).json({
        success: false,
        message: "Name, price, category, and firm are required fields",
      });
    }

    // Create new menu item
    const newMenuItem = new MenuItem({
      name,
      price,
      description,
      variations,
      dietary,
      category,
      group,
      images,
      bestSeller: bestSeller || false,
      firm,
      isTrashed: false,
    });

    // Save to database
    const savedMenuItem = await newMenuItem.save();

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: savedMenuItem,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      success: false,
      message: "Error creating menu item",
      error: error.message,
    });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      variations,
      category,
      group,
      bestSeller,
      firm,
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Validate category if provided
    if (category && !["veg", "non-veg", "both"].includes(category)) {
      return res.status(400).json({
        error: "Invalid category. Must be 'veg', 'non-veg', or 'both'",
      });
    }

    // Validate firm ID if provided
    if (firm && !mongoose.Types.ObjectId.isValid(firm)) {
      return res.status(400).json({ error: "Invalid firm ID" });
    }

    // Validate variations if provided
    if (variations) {
      if (!Array.isArray(variations)) {
        return res.status(400).json({ error: "Variations must be an array" });
      }
      for (const variation of variations) {
        if (!variation.name || !variation.price) {
          return res
            .status(400)
            .json({ error: "Each variation must have a name and price" });
        }
      }
    }

    const menuItem = new MenuItem({
      name,
      price,
      description,
      variations,
      category,
      group,
      bestSeller: bestSeller || false,
      firm,
      isTrashed: false,
    });

    const savedMenuItem = await menuItem.save();

    return res.status(201).json({
      message: "Menu item created successfully",
      data: savedMenuItem,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
