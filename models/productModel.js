const db = require('../utils/db');

const Product = {
    insert: (productData) => {
        return new Promise((resolve, reject) => {
            db.getConnection(
                'INSERT INTO sanpham (idgood, namegood, sell, purchase, image, quantity, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [productData.id, productData.name, productData.sell, productData.cost, 
                 productData.image, productData.quantity, productData.status],
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            );
        });
    },

    getAll: () => {
        return new Promise((resolve, reject) => {
            db.getConnection('SELECT * FROM sanpham', (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    },

    update: (productData) => {
        return new Promise((resolve, reject) => {
            db.getConnection(
                'UPDATE sanpham SET namegood = ?, sell = ?, purchase = ?, status = ? WHERE idgood = ?',
                [productData.namegood, productData.sell, productData.purchase, 
                 productData.status, productData.idgood],
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            );
        });
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.getConnection('DELETE FROM sanpham WHERE idgood = ?', [id], (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
        });
    }
};

module.exports = Product;
