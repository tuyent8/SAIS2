// src/controllers/job.controller.js
const jobService = require('../service/jobService');

exports.createJob = async (req, res) => {
    try {
        const companyId = req.user.userId; // chính là người đăng (nhà tuyển dụng)
        const jobData = { ...req.body, companyId };
        const result = await jobService.createJob(jobData);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.searchJobs = async (req, res) => {
    try {
        const { keyword } = req.query;
        const jobs = await jobService.searchJobs(keyword);
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
