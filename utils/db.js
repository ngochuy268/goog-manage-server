const mysql = require('mysql');
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
    waitForConnections: true,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

db.getConnection((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

module.exports = db;
