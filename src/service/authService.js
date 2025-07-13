const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createSQLServerConnection } = require('../../db');

const JWT_SECRET = 'yourSecretKey';

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
    const validRoles = ['jobapplication', 'hr', 'admin'];
    const userRole = (role && validRoles.includes(role.toLowerCase())) ? role.toLowerCase() : 'jobapplication';

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

exports.login = async ({ email, password }) => {
    const pool = await createSQLServerConnection();
    const result = await pool
        .request()
        .input('Email', email)
        .query(`SELECT * FROM Users WHERE Email = @Email`);

    const user = result.recordset[0];
    if (!user) throw new Error('User not found');

    const match = await bcrypt.compare(password, user.PasswordHash);
    if (!match) throw new Error('Invalid password');

    const token = jwt.sign(
        { userId: user.Id, role: user.Role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { token, user: { id: user.Id, fullName: user.FullName, role: user.Role } };
};
