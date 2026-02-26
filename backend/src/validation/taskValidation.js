const Joi = require('joi');

const objectIdSchema = Joi.string().trim().length(24).hex().required();

const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().allow('').max(5000).optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional(),
  description: Joi.string().allow('').max(5000).optional(),
  status: Joi.string().valid('pending', 'completed').optional(),
}).min(1);

const taskIdParamSchema = Joi.object({
  id: objectIdSchema,
});

const getTasksQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  status: Joi.string().valid('pending', 'completed').optional(),
  search: Joi.string().trim().allow('').max(200).optional(),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  getTasksQuerySchema,
};
