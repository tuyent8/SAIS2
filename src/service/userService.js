const { createSQLServerConnection } = require('../../db');

exports.getAllUsers = async () => {
    const pool = await createSQLServerConnection();
    const result = await pool.request().query('SELECT * FROM Users');
    return result.recordset;
}; 