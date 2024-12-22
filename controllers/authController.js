const Employee = require('../models/personModel');
const jwt = require('jsonwebtoken');

const authController = {
    login: async (req, res) => {
        const { id, password } = req.body;

        try {
            const employee = await Employee.findById(id);
            
            if (!employee) {
                return res.status(404).json({ message: 'IDが存在しません' });
            }

            if (password === employee.password) {
                const token = jwt.sign({ id: id }, 'secret-key', { expiresIn: '1h' });
                return res.status(200).json({
                    success: true,
                    message: 'ログインに成功しました',
                    token,
                    userId: id
                });
            } else {
                return res.status(401).json({ message: 'パスワードが正しくありません' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'エラーが発生しました' });
        }
    },

    changePassword: async (req, res) => {
        const { id, password } = req.body;

        try {
            const employee = await Employee.findById(id);
            if (!employee) {
                return res.status(404).json({ message: 'IDが存在しません' });
            }

            const result = await Employee.updatePassword(id, password);
            if (result) {
                return res.status(200).json({ 
                    success: true, 
                    message: 'パスワードが正常に変更されました' 
                });
            } else {
                return res.status(500).json({ 
                    success: false,  
                    error: 'パスワードの更新中にエラーが発生しました' 
                });
            }
        } catch (error) {
            return res.status(500).json({ 
                error: 'データベースのクエリ中にエラーが発生しました' 
            });
        }
    }
};

module.exports = authController;