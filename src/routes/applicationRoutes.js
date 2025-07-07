const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// Candidate nộp đơn vào job
router.post('/', verifyToken, requireRole('candidate'), applicationController.createApplication);

// HR xem danh sách application cho job của mình
router.get('/job/:jobId', verifyToken, requireRole('hr'), applicationController.getApplicationsByJob);

// Candidate xem các application của mình
router.get('/my', verifyToken, requireRole('candidate'), applicationController.getApplicationsByUser);

module.exports = router;
