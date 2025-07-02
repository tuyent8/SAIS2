const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const sqlServerConfig = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.MSSQL_SERVER};Database=${process.env.MSSQL_DATABASE};Trusted_Connection=Yes;`
};

async function createSQLServerConnection() {
    try {
        const pool = await sql.connect(sqlServerConfig);
        console.log('Đã kết nối SQL Server thành công');
        return pool;
    } catch (error) {
        console.error('Lỗi kết nối SQL Server:', error);
        throw error;
    }
}

module.exports = {
    createSQLServerConnection,
    sql
};
