// src/services/jobService.js
const { createSQLServerConnection } = require('../../db');

exports.createJob = async ({ companyId, title, description, categoryId, location, salary, deadline }) => {
    const pool = await createSQLServerConnection();
    const request = pool.request();

    await request
        .input('CompanyId', companyId)
        .input('Title', title)
        .input('Description', description)
        .input('CategoryId', categoryId)
        .input('Location', location)
        .input('Salary', salary)
        .input('Deadline', deadline)
        .query(`
            INSERT INTO Jobs (CompanyId, Title, Description, CategoryId, Location, Salary, Deadline, CreatedAt)
            VALUES (@CompanyId, @Title, @Description, @CategoryId, @Location, @Salary, @Deadline, GETDATE())
        `);

    return { message: 'Job posted successfully' };
};

exports.getAllJobs = async (page = 1, pageSize = 10) => {
    const pool = await createSQLServerConnection();
    const offset = (page - 1) * pageSize;
    const result = await pool.request()
        .input('Offset', offset)
        .input('PageSize', pageSize)
        .query(`
      SELECT j.*, c.Name as CompanyName, cat.Name as CategoryName
      FROM Jobs j
      LEFT JOIN Companies c ON j.CompanyId = c.Id
      LEFT JOIN Categories cat ON j.CategoryId = cat.Id
      ORDER BY j.CreatedAt DESC
      OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY
    `);
    return result.recordset;
};

exports.getJobById = async (jobId) => {
    const pool = await createSQLServerConnection();
    const result = await pool.request()
        .input('JobId', jobId)
        .query(`
      SELECT j.*, c.Name as CompanyName, cat.Name as CategoryName
      FROM Jobs j
      LEFT JOIN Companies c ON j.CompanyId = c.Id
      LEFT JOIN Categories cat ON j.CategoryId = cat.Id
      WHERE j.Id = @JobId
    `);
    return result.recordset[0];
};

exports.searchJobs = async (keyword) => {
    const pool = await createSQLServerConnection();
    const request = pool.request();
    let query = `
    SELECT j.*, c.Name as CompanyName
    FROM Jobs j
    LEFT JOIN Companies c ON j.CompanyId = c.Id
    WHERE 1=1
  `;
    if (keyword) {
        query += ` AND (j.Title LIKE @Keyword OR j.Description LIKE @Keyword OR c.Name LIKE @Keyword)`;
        request.input('Keyword', `%${keyword}%`);
    }
    const result = await request.query(query);
    return result.recordset;
}; 