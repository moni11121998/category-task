const { createCategorySchema, updateCategorySchema } = require('../validation/categoryValidation');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');

// Create Category
exports.createCategory = async (req, h) => {
  try {
    const { error } = createCategorySchema.validate(req.payload, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return h.response({ message: 'Validation error', errors: errorMessages }).code(400);
    }

    const { name, subcategories } = req.payload;

   
    const subcategoryIds = await Promise.all(
      subcategories.map(async (sub) => {
        const newSubcategory = new Subcategory({ name: sub.name, price: sub.price });
        const savedSubcategory = await newSubcategory.save();
        return savedSubcategory;
      })
    );

   
    const category = new Category({ name, subcategories: subcategoryIds.map(sub => sub._id) });
    const savedCategory = await category.save();

    
    const populatedCategory = await Category.findById(savedCategory._id).populate('subcategories');

    return h.response({ message: 'Category created successfully', data: populatedCategory }).code(201);
  } catch (err) {
    console.error('Error creating category:', err);
    return h.response({ message: 'Internal Server Error', error: err.message }).code(500);
  }
};


// Get All Categories
exports.getCategories = async (req, h) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const categories = await Category.find()
      .populate('subcategories')
      .skip(startIndex)
      .limit(limit);

    const totalCategories = await Category.countDocuments();

    const result = {
      message: 'Fetching list of categories successfully',
      data: categories,
      pagination: {
        total: totalCategories,
        page,
        limit,
        totalPages: Math.ceil(totalCategories / limit),
      },
    };

    return h.response(result).code(200);
  } catch (err) {
    console.error('Error fetching categories:', err);
    return h.response({ message: 'Error fetching categories' }).code(500);
  }
};

// Get Category by ID
exports.getCategoryById = async (req, h) => {
  try {
    const category = await Category.findById(req.params.id).populate('subcategories');

    if (!category) {
      return h.response({ message: 'Category not found' }).code(404);
    }

    return h.response(category).code(200);
  } catch (err) {
    console.error('Error fetching category by ID:', err);
    return h.response({ message: 'Error fetching category' }).code(500);
  }
};

// Update Category

exports.updateCategory = async (req, h) => {
  try {
   
    const { error } = updateCategorySchema.validate(req.payload, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return h.response({ message: 'Validation error', errors: errorMessages }).code(400);
    }

    const { name, subcategories } = req.payload;

  
    const category = await Category.findById(req.params.id);
    if (!category) {
      return h.response({ message: 'Category not found' }).code(404);
    }

 
    if (name) {
      category.name = name;
    }

   
    if (subcategories && Array.isArray(subcategories)) {
      const updatedSubcategoryIds = await Promise.all(
        subcategories.map(async (sub) => {
          if (sub._id) {
            
            const existingSubcategory = await Subcategory.findByIdAndUpdate(
              sub._id,
              { name: sub.name, price: sub.price },
              { new: true } 
            );
            return existingSubcategory ? existingSubcategory._id : null;
          } else {
            
            const newSubcategory = new Subcategory({ name: sub.name, price: sub.price });
            const savedSubcategory = await newSubcategory.save();
            return savedSubcategory._id;
          }
        })
      );

      category.subcategories = updatedSubcategoryIds.filter(Boolean);
    }

    
    const updatedCategory = await category.save();

   
    const populatedCategory = await Category.findById(updatedCategory._id).populate('subcategories');

    return h.response({
      message: 'Category updated successfully',
      data: {
        _id: populatedCategory._id,
        name: populatedCategory.name,
        subcategories: populatedCategory.subcategories.map((sub) => ({
          _id: sub._id,
          name: sub.name,
          price: sub.price,
        })),
      },
    }).code(200);
  } catch (err) {
    console.error('Error updating category:', err);
    return h.response({ message: 'Internal Server Error', error: err.message }).code(500);
  }
};

// Delete Category
exports.deleteCategory = async (req, h) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return h.response({ message: 'Category not found' }).code(404);
    }

    
    if (category.subcategories && category.subcategories.length > 0) {
      await Subcategory.updateMany(
        { _id: { $in: category.subcategories } },
        { $set: { isDeleted: true } }
      );
    }

    
    category.isDeleted = true;
    await category.save();

    return h.response({ message: 'Category and its subcategories as deleted successfully' }).code(200);
  } catch (err) {
    console.error('Error marking category as deleted:', err);
    return h.response({ message: 'Internal Server Error', error: err.message }).code(500);
  }
};

