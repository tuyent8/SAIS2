const jobService = require('../service/jobService');

exports.createApplication = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { jobId, cvId } = req.body;
        const result = await jobService.createApplication({ userId, jobId, cvId });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getApplicationsByJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const result = await jobService.getApplicationsByJob(jobId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getApplicationsByUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await jobService.getApplicationsByUser(userId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
