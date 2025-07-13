const { createSQLServerConnection } = require('../../db');

exports.createCV = async (cvData) => {
    const { userId, summary, skills, education, experience } = cvData;
    const pool = await createSQLServerConnection();

    await pool.request()
        .input('UserId', userId)
        .input('Summary', summary)
        .input('Skills', JSON.stringify(skills))
        .input('Education', JSON.stringify(education))
        .input('Experience', JSON.stringify(experience))
        .query(`
      INSERT INTO CVs (UserId, Summary, Skills, Education, Experience)
      VALUES (@UserId, @Summary, @Skills, @Education, @Experience)
    `);

    return { message: 'CV created successfully' };
};

exports.getAllCVs = async () => {
    const pool = await createSQLServerConnection();
    const result = await pool.request().query('SELECT * FROM CVs');
    return result.recordset;
};

exports.getCVById = async (id) => {
    const pool = await createSQLServerConnection();
    const result = await pool.request()
        .input('Id', id)
        .query('SELECT * FROM CVs WHERE Id = @Id');
    return result.recordset[0];
};

exports.getCVsByUser = async (userId) => {
    const pool = await createSQLServerConnection();
    const result = await pool.request()
        .input('UserId', userId)
        .query('SELECT * FROM CVs WHERE UserId = @UserId');
    return result.recordset;
};

exports.updateCV = async (id, userId, data) => {
    const pool = await createSQLServerConnection();
    await pool.request()
        .input('Id', id)
        .input('UserId', userId)
        .input('Summary', data.summary)
        .input('Skills', JSON.stringify(data.skills))
        .input('Education', JSON.stringify(data.education))
        .input('Experience', JSON.stringify(data.experience))
        .query(`
            UPDATE CVs
            SET Summary = @Summary, Skills = @Skills, Education = @Education, Experience = @Experience
            WHERE Id = @Id AND UserId = @UserId
        `);
    return { message: 'CV updated successfully' };
};

exports.deleteCV = async (id, userId) => {
    const pool = await createSQLServerConnection();
    await pool.request()
        .input('Id', id)
        .input('UserId', userId)
        .query('DELETE FROM CVs WHERE Id = @Id AND UserId = @UserId');
    return { message: 'CV deleted successfully' };
};