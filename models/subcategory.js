const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Subcategory', subcategorySchema);
