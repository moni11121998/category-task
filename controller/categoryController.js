const Category = require('../models/category');

// Create Category
exports.createCategory = async (req, h) => {
  try {
    const { name, subcategories,price } = req.payload;

    const category = new Category({
      name,
      subcategories,
      price
    });

    const savedCategory = await category.save();
    return h.response(savedCategory).code(201);
  } catch (err) {
    console.error(err);
    return h.response({ message: 'Error creating category' }).code(500);
  }
};

// Get All Categories
exports.getCategories = async (req, h) => {
  try {
    const categories = await Category.find();
    return h.response(categories).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ message: 'Error fetching categories' }).code(500);
  }
};

// Get Category by ID
exports.getCategoryById = async (req, h) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return h.response({ message: 'Category not found' }).code(404);
    }
    return h.response(category).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ message: 'Error fetching category' }).code(500);
  }
};

// Update Category
exports.updateCategory = async (req, h) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.payload,
      { new: true }
    );
    if (!updatedCategory) {
      return h.response({ message: 'Category not found' }).code(404);
    }
    return h.response(updatedCategory).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ message: 'Error updating category' }).code(500);
  }
};

// Delete Category
exports.deleteCategory = async (req, h) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return h.response({ message: 'Category not found' }).code(404);
    }
    return h.response({ message: 'Category deleted successfully' }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ message: 'Error deleting category' }).code(500);
  }
};
