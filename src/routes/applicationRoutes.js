const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// JobApplication nộp đơn vào job
router.post('/', verifyToken, requireRole('jobapplication'), applicationController.createApplication);

// HR phê duyệt/từ chối application
router.put('/:applicationId/status', verifyToken, requireRole('hr'), applicationController.updateApplicationStatus);

// HR xem danh sách application cho job của mình
router.get('/job/:jobId', verifyToken, requireRole('hr'), applicationController.getApplicationsByJob);

// JobApplication xem các application của mình
router.get('/my', verifyToken, requireRole('jobapplication'), applicationController.getApplicationsByUser);
router.get('/my-status', verifyToken, requireRole('jobapplication'), applicationController.getApplicationStatusByUser);

module.exports = router;
