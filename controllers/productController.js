const Product = require('../models/productModel');

const productController = {
    insert: async (req, res) => {
        const { id, name, cost, sell, quantity, image, status } = req.body;

        if(!id || !name || !cost || !sell || !quantity || !image || !status) {
            return res.status(400).json({ success: false, message: '無効なデータ!' });
        }

        try {
            const result = await Product.insert({ id, name, cost, sell, quantity, image, status });
            if (result) {
                res.json({ success: true, message: '製品が正常に追加されました!' });
            } else {
                res.status(500).json({ success: false, message: '製品をデータベースに追加できません!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'エラーが発生しました!' });
        }
    },

    // getAll: async (req, res) => {
    //     try {
    //         const products = await Product.getAll();
    //         res.json({
    //             success: true,
    //             data: products
    //         });
    //     } catch (error) {
    //         console.error('Error in getAll:', error);
    //         res.status(500).json({
    //             success: false,
    //             message: 'エラーが発生しました'
    //         });
    //     }
    // },
    getAll: (req, res) => {
        res.send('Hallo');
        db.query('SELECT * FROM sanpham', (error, results) => {
            if (error) {
                return;
            }
            res.json({ success: true, data: results });
        });
    },

    update: async (req, res) => {
        try {
            const result = await Product.update(req.body);
            if (result) {
                res.json({ success: true, message: '製品が更新されました!' });
            } else {
                res.status(404).json({ success: false, message: '製品が見つかりません!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'エラーが発生しました!' });
        }
    },

    delete: async (req, res) => {
        try {
            const result = await Product.delete(req.params.id);
            if (result) {
                res.json({ success: true, message: '製品が削除されました!' });
            } else {
                res.status(404).json({ success: false, message: '製品が見つかりません!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'エラーが発生しました!' });
        }
    }
};

module.exports = productController;