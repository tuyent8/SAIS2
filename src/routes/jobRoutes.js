// src/routes/job.routes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// Chỉ HR mới được đăng job
router.post('/', verifyToken, requireRole('hr'), jobController.createJob);

// Candidate tìm kiếm job theo tên vị trí hoặc công ty
router.get('/search', verifyToken, requireRole('candidate'), jobController.searchJobs);

// (Có thể bổ sung các API khác: lấy danh sách job, chi tiết job, xóa/sửa job...)

module.exports = router;
