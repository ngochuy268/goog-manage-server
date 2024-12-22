const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/personController');

router.post('/insert-nhanvien', employeeController.insert);
router.get('/get-nhanvien/:id', employeeController.getById);
router.put('/update-avatar/:id', employeeController.updateAvatar);

module.exports = router;