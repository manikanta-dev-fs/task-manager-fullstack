const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  getTasksQuerySchema,
} = require('../validation/taskValidation');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(validate(getTasksQuerySchema, 'query'), getTasks)
  .post(validate(createTaskSchema), createTask);

router.route('/:id')
  .put(validate(taskIdParamSchema, 'params'), validate(updateTaskSchema), updateTask)
  .delete(validate(taskIdParamSchema, 'params'), deleteTask);

module.exports = router;
