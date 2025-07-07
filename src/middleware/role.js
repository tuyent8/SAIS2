// src/middleware/role.middleware.js
exports.requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles) {
            return res.status(403).json({ message: 'Access denied. No role.' });
        }
        if (Array.isArray(roles)) {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied. Incorrect role.' });
            }
        } else {
            if (req.user.role !== roles) {
                return res.status(403).json({ message: 'Access denied. Incorrect role.' });
            }
        }
        next();
    };
};
