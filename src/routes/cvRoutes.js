const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cvController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, cvController.createCV);
router.get('/', verifyToken, cvController.getAllCVs);
router.get('/:id', verifyToken, cvController.getCVById);

module.exports = router;