// src/services/jobService.js
const { createSQLServerConnection } = require('../../db');
const userService = require('../service/userService');
const bcrypt = require('bcrypt');

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

exports.createApplication = async ({ userId, jobId, cvId }) => {
  const pool = await createSQLServerConnection();
  await pool.request()
    .input('UserId', userId)
    .input('JobId', jobId)
    .input('CVId', cvId)
    .input('Status', 'Pending')
    .query(`
            INSERT INTO Application (UserId, JobId, CVId, Status)
            VALUES (@UserId, @JobId, @CVId, @Status)
        `);
  return { message: 'Application submitted successfully' };
};

exports.getApplicationsByJob = async (jobId) => {
  const pool = await createSQLServerConnection();
  const result = await pool.request()
    .input('JobId', jobId)
    .query('SELECT * FROM Application WHERE JobId = @JobId');
  return result.recordset;
};

exports.getApplicationsByUser = async (userId) => {
  const pool = await createSQLServerConnection();
  const result = await pool.request()
    .input('UserId', userId)
    .query('SELECT * FROM Application WHERE UserId = @UserId');
  return result.recordset;
};
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = 'your-32-char-secret-key-123456789012'; // phải đủ 32 ký tự
const iv = crypto.randomBytes(16); // vector khởi tạo

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

exports.createCV = async (cvData) => {
  const { userId, summary, skills, education, experience } = cvData;
  const pool = await createSQLServerConnection();

  // Mã hóa JSON education và experience
  const encryptedEducation = encrypt(JSON.stringify(education));
  console.log(encryptedEducation);
  const encryptedExperience = encrypt(JSON.stringify(experience));

  await pool.request()
    .input('UserId', userId)
    .input('Summary', summary)
    .input('Skills', JSON.stringify(skills))
    .input('Education', encryptedEducation)
    .input('Experience', encryptedExperience)
    .query(`
      INSERT INTO CVs (UserId, Summary, Skills, Education, Experience)
      VALUES (@UserId, @Summary, @Skills, @Education, @Experience)
    `);

  return { message: 'CV created successfully' };
};


exports.getCVsByUser = async (userId) => {
  const pool = await createSQLServerConnection();
  const result = await pool.request()
    .input('UserId', userId)
    .query('SELECT * FROM CVs WHERE UserId = @UserId');
  return result.recordset;
};

exports.getAllUsers = async () => {
  const pool = await createSQLServerConnection();
  const result = await pool.request().query('SELECT * FROM Users');
  return result.recordset;
};

exports.searchJobs = async (keyword) => {
  const pool = await createSQLServerConnection();
  const request = pool.request();
  let query = `
    SELECT j.*, c.Name as CompanyName
    FROM Jobs j
    LEFT JOIN Company c ON j.CompanyId = c.Id
    WHERE 1=1
  `;
  if (keyword) {
    query += ` AND (j.Title LIKE @Keyword OR c.Name LIKE @Keyword)`;
    request.input('Keyword', `%${keyword}%`);
  }
  const result = await request.query(query);
  return result.recordset;
};

exports.register = async ({ fullName, email, password, phone, role }) => {
  const pool = await createSQLServerConnection();
  const checkResult = await pool
    .request()
    .input('Email', email)
    .query('SELECT Id FROM Users WHERE Email = @Email');

  if (checkResult.recordset.length > 0) {
    throw new Error('Email is already registered');
  }
  const hashed = await bcrypt.hash(password, 10);
  const request = pool.request();

  // Validate role
  const validRoles = ['candidate', 'hr', 'admin'];
  const userRole = (role && validRoles.includes(role.toLowerCase())) ? role.toLowerCase() : 'candidate';

  await request
    .input('FullName', fullName)
    .input('Email', email)
    .input('PasswordHash', hashed)
    .input('Phone', phone || null)
    .input('Role', userRole)
    .query(`
      INSERT INTO Users (FullName, Email, PasswordHash, Role)
      VALUES (@FullName, @Email, @PasswordHash, @Role)
    `);

  return { message: 'Registered successfully' };
};
