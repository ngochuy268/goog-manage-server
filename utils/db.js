const mysql = require('mysql');
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DBNAME,
    port: process.env.DB_PORT,
    connectionLimit: 5,
    waitForConnections: true, 
    queueLimit: 0, 
    ssl: {
        rejectUnauthorized: true
    }
});

db.getConnection((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

module.exports = db;
