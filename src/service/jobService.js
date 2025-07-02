// src/services/jobService.js
const { createSQLServerConnection } = require('../config/sqlserver');

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
