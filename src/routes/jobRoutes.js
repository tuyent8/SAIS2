// src/routes/job.routes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.post('/', verifyToken, requireRole('employer'), jobController.createJob);

module.exports = router;
