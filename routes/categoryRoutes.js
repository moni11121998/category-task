const categoryController = require('../controller/categoryController');

module.exports = [
  {
    method: 'POST',
    path: '/categories',
    handler: categoryController.createCategory,
  },
  {
    method: 'GET',
    path: '/categories',
    handler: categoryController.getCategories,
  },
  {
    method: 'GET',
    path: '/categories/{id}',
    handler: categoryController.getCategoryById,
  },
  {
    method: 'PUT',
    path: '/categories/{id}',
    handler: categoryController.updateCategory,
  },
  {
    method: 'DELETE',
    path: '/categories/{id}',
    handler: categoryController.deleteCategory,
  },
];
