const cvService = require('../service/cvService');

exports.createCV = async (req, res) => {
    try {
        const result = await cvService.createCV({ ...req.body, userId: req.user.userId });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllCVs = async (req, res) => {
    try {
        const cvs = await cvService.getAllCVs();
        res.json(cvs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCVById = async (req, res) => {
    try {
        const cv = await cvService.getCVById(req.params.id);
        if (!cv) return res.status(404).json({ message: 'CV not found' });
        res.json(cv);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};