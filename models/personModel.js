const db = require('../utils/db');

const Employee = {
    insert: (employeeData) => {
        return new Promise((resolve, reject) => {
            db.getConnection(
                'INSERT INTO nhanvien (id, name, password, gender, phone, email, address, avatar, birthday) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [employeeData.id, employeeData.name, employeeData.password, employeeData.gender, 
                 employeeData.phone, employeeData.email, employeeData.address, employeeData.avatar, 
                 employeeData.birthday],
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            );
        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.getConnection('SELECT * FROM nhanvien WHERE id = ?', [id], (error, results) => {
                if (error) reject(error);
                resolve(results[0]);
            });
        });
    },

    updateAvatar: (id, avatar) => {
        return new Promise((resolve, reject) => {
            db.getConnection('UPDATE nhanvien SET avatar = ? WHERE id = ?', 
                [avatar, id], 
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            );
        });
    },

    updatePassword: (id, password) => {
        return new Promise((resolve, reject) => {
            db.getConnection('UPDATE nhanvien SET password = ? WHERE id = ?', 
                [password, id], 
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            );
        });
    },
    findByIdAndEmail: (id, email) => {
        return new Promise((resolve, reject) => {
            db.getConnection(
                'SELECT * FROM nhanvien WHERE id = ? AND email = ?',
                [id, email],
                (error, results) => {
                    if (error) reject(error);
                    resolve(results[0]);
                }
            );
        });
    }
};

module.exports = Employee;