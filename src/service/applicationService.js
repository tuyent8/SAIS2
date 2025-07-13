const { createSQLServerConnection } = require('../../db');

exports.createApplication = async ({ userId, jobId, cvId }) => {
    const pool = await createSQLServerConnection();
    await pool.request()
        .input('UserId', userId)
        .input('JobId', jobId)
        .input('CVId', cvId)
        .input('Status', 'Pending')
        .query(`
            INSERT INTO Applications (UserId, JobId, CVId, Status)
            VALUES (@UserId, @JobId, @CVId, @Status)
        `);
    return { message: 'Application submitted successfully' };
};

exports.updateApplicationStatus = async (applicationId, status) => {
    const pool = await createSQLServerConnection();
    await pool.request()
        .input('ApplicationId', applicationId)
        .input('Status', status)
        .query(`
      UPDATE Applications 
      SET Status = @Status, UpdatedAt = GETDATE()
      WHERE Id = @ApplicationId
    `);
    return { message: `Applications ${status.toLowerCase()} successfully` };
};

exports.getApplicationsByJob = async (jobId) => {
    const pool = await createSQLServerConnection();
    const result = await pool.request()
        .input('JobId', jobId)
        .query(`
      SELECT a.*, u.FullName, u.Email, c.Summary, c.Skills
      FROM Applications a
      LEFT JOIN Users u ON a.UserId = u.Id
      LEFT JOIN CVs c ON a.CVId = c.Id
      WHERE a.JobId = @JobId
      ORDER BY a.CreatedAt DESC
    `);
    return result.recordset;
};

exports.getApplicationsByUser = async (userId) => {
    const pool = await createSQLServerConnection();
    const result = await pool.request()
        .input('UserId', userId)
        .query(`
      SELECT a.*, j.Title as JobTitle, j.CompanyId, c.Name as CompanyName
      FROM Applications a
      LEFT JOIN Jobs j ON a.JobId = j.Id
      LEFT JOIN Companies c ON j.CompanyId = c.Id
      WHERE a.UserId = @UserId
      ORDER BY a.CreatedAt DESC
    `);
    return result.recordset;
};

exports.getApplicationStatusByUser = async (userId) => {
    const pool = await createSQLServerConnection();
    const result = await pool.request()
        .input('UserId', userId)
        .query(`
      SELECT a.Id as ApplicationId, a.JobId, j.Title as JobTitle, a.CVId, a.Status
      FROM Applications a
      LEFT JOIN Jobs j ON a.JobId = j.Id
      WHERE a.UserId = @UserId

    `);
    return result.recordset;
}; 