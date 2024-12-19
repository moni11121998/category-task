const Hapi = require('@hapi/hapi');
const categoryController = require('../controller/categoryController');

const categoryRoutes = [
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

module.exports = categoryRoutes;
