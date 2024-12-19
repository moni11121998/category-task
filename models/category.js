const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }],
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Category', categorySchema);

