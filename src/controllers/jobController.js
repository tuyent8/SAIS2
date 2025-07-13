// src/controllers/job.controller.js
const jobService = require('../service/jobService');

exports.createJob = async (req, res) => {
    try {
        // Lấy companyId từ body (không lấy từ req.user.userId)
        const jobData = req.body;
        const result = await jobService.createJob(jobData);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const jobs = await jobService.getAllJobs(parseInt(page), parseInt(pageSize));
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await jobService.getJobById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
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
