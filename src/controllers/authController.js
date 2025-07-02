const authService = require('../service/authService');

exports.register = async (req, res) => {
    console.log('req.body:', req.body);
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};
