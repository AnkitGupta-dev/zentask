const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const tasksController = require('../controllers/tasksController');

// Routes
router.post('/', auth, tasksController.createTask);
router.get('/', auth, tasksController.getTasks);
router.put('/:id', auth, tasksController.updateTask);
router.delete('/:id', auth, tasksController.deleteTask);

module.exports = router;
