const mongoose = require('mongoose');
const Task = require('../models/Task');
const { encrypt, decrypt } = require('../utils/encrypt');

const parsePagination = (pageQuery, limitQuery) => {
  const page = Math.max(parseInt(pageQuery, 10) || 1, 1);
  const limit = Math.max(parseInt(limitQuery, 10) || 10, 1);
  return { page, limit, skip: (page - 1) * limit };
};

const mapTaskResponse = (task) => {
  const taskObj = task.toObject ? task.toObject() : task;
  return {
    ...taskObj,
    description: decrypt(taskObj.description),
    status: taskObj.completed ? 'completed' : 'pending',
  };
};

const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const normalizedDescription = description ? String(description).trim() : '';

    const task = await Task.create({
      title: String(title).trim(),
      description: encrypt(normalizedDescription),
      completed: false,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: mapTaskResponse(task),
    });
  } catch (error) {
    return next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query.page, req.query.limit);
    const { status, search } = req.query;

    const query = { user: req.user._id };

    if (status !== undefined) {
      if (status !== 'pending' && status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: "Status must be either 'pending' or 'completed'",
        });
      }

      query.completed = status === 'completed';
    }

    if (search && String(search).trim()) {
      query.title = { $regex: String(search).trim(), $options: 'i' };
    }

    const [tasks, total] = await Promise.all([
      Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(query),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return res.status(200).json({
      success: true,
      data: tasks.map(mapTaskResponse),
      pagination: {
        total,
        page,
        totalPages,
        limit,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const updatePayload = {};

    if (req.body.title !== undefined) {
      if (!String(req.body.title).trim()) {
        return res.status(400).json({
          success: false,
          message: 'Title cannot be empty',
        });
      }
      updatePayload.title = String(req.body.title).trim();
    }

    if (req.body.description !== undefined) {
      updatePayload.description = encrypt(String(req.body.description).trim());
    }

    if (req.body.status !== undefined) {
      if (req.body.status !== 'pending' && req.body.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: "Status must be either 'pending' or 'completed'",
        });
      }
      updatePayload.completed = req.body.status === 'completed';
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: mapTaskResponse(task),
    });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
