const applicationService = require('../service/applicationService');

exports.createApplication = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { jobId, cvId } = req.body;
        const result = await applicationService.createApplication({ userId, jobId, cvId });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['Pending', 'Approved', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be Pending, Approved, or Rejected' });
        }

        const result = await applicationService.updateApplicationStatus(applicationId, status);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getApplicationsByJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const result = await applicationService.getApplicationsByJob(jobId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getApplicationsByUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await applicationService.getApplicationsByUser(userId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getApplicationStatusByUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await applicationService.getApplicationStatusByUser(userId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
