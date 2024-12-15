const Employee = require('../models/personModel');
const jwt = require('jsonwebtoken');

const employeeController = {
    insert: async (req, res) => {
        const { id, name, password, gender, phone, email, address, avatar, birthday } = req.body;
        
        if (!id || !name || !password || !gender || !phone || !email || !address || !birthday) {
            return res.status(400).json({ success: false, message: 'データが無効です!' });
        }
        
        try {
            const result = await Employee.insert({ id, name, password, gender, phone, email, address, avatar, birthday });
            if (result) {
                res.json({ success: true, message: '従業員が正常に追加されました!' });
            } else {
                res.status(500).json({ success: false, message: 'データベースに従業員を追加できません!' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'エラーが発生しました。もう一度お試しください!' });
        }
    },

    getById: async (req, res) => {
        try {
            const employee = await Employee.findById(req.params.id);
            if (employee) {
                res.json({ success: true, user: employee });
            } else {
                res.status(404).json({ success: false, message: '従業員が見つかりません!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'エラーが発生しました!' });
        }
    },

    updateAvatar: async (req, res) => {
        try {
            const result = await Employee.updateAvatar(req.params.id, req.body.avatar);
            if (result) {
                res.json({ success: true, message: 'アバターが更新されました!' });
            } else {
                res.status(404).json({ success: false, message: '従業員が見つかりません!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'エラーが発生しました!' });
        }
    }
};

module.exports = employeeController;