const mysql = require('mysql');
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DBNAME,
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

module.exports = db;
