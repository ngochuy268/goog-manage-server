const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/insert-good', productController.insert);
router.get('get-goods', productController.getAll);
router.put('/update-good', productController.update);
router.delete('/delete-good/:id', productController.delete);

module.exports = router;