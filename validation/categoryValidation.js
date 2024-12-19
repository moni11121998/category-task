const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': '"name" should be a string',
    'string.empty': '"name" cannot be empty',
    'any.required': '"name" is required',
  }),
  subcategories: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().messages({
          'string.base': '"subcategory name" should be a string',
          'string.empty': '"subcategory name" cannot be empty',
          'any.required': '"subcategory name" is required',
        }),
        price: Joi.number().required().messages({
          'number.base': '"price" should be a number',
          'any.required': '"price" is required',
        }),
      })
    )
    .required()
    .messages({
      'array.base': '"subcategories" should be an array',
      'any.required': '"subcategories" is required',
    }),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().optional(),
  subcategories: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().optional(),
        name: Joi.string().required(),
        price: Joi.number().required(),
      })
    )
    .optional(),
});

module.exports = { createCategorySchema, updateCategorySchema };
