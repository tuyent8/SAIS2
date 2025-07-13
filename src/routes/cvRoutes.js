const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cvController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, cvController.createCV);
router.get('/', verifyToken, cvController.getAllCVs);
router.get('/my', verifyToken, cvController.getCVsByUser);
router.get('/:id', verifyToken, cvController.getCVById);
router.put('/:id', verifyToken, cvController.updateCV);
router.delete('/:id', verifyToken, cvController.deleteCV);

module.exports = router;