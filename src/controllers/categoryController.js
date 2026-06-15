const Category = require("../models/Category");

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name, description, slug, image } = req.body;

    // Generate slug from name if not provided
    const categorySlug = slug || name.toLowerCase().replace(/ /g, '-');

    const categoryExists = await Category.findOne({ slug: categorySlug });
    if (categoryExists) {
      return res.status(400).json({ message: "Category with this slug already exists" });
    }

    const category = await Category.create({
      name,
      description,
      slug: categorySlug,
      image,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single category
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { name, description, slug, image } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      
      if (description !== undefined) category.description = description;

      if (slug) category.slug = slug;
      else if (name) category.slug = name.toLowerCase().replace(/ /g, '-');
      
      if (image !== undefined) category.image = image;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Product = require("../models/Product");

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      // Check if any products use this category
      const productsCount = await Product.countDocuments({ category: category.name });
      if (productsCount > 0) {
        return res.status(400).json({ 
          message: `Cannot delete category. There are ${productsCount} product(s) associated with it.` 
        });
      }

      await Category.deleteOne({ _id: category._id });
      res.json({ message: "Category removed successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
