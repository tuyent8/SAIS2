// src/routes/job.routes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// Chỉ HR mới được đăng job
router.post('/', verifyToken, requireRole('hr'), jobController.createJob);

// Lấy danh sách tất cả job (có phân trang)
router.get('/', verifyToken, jobController.getAllJobs);
router.get('/search', verifyToken, requireRole('jobapplication'), jobController.searchJobs);
// Lấy chi tiết job theo ID
router.get('/:id', verifyToken, jobController.getJobById);

// JobApplication tìm kiếm job theo tên vị trí hoặc công ty


module.exports = router;
