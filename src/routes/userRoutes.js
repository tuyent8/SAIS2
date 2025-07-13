const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// Lấy danh sách tất cả user (chỉ Admin)
router.get('/', verifyToken, requireRole('admin'), userController.getAllUsers);

module.exports = router; 