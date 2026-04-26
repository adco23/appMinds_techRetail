const { Router } = require('express');
const saleDetailController = require('../controllers/saleDetail.controller');

const router = Router();

router.get('/', saleDetailController.getDetails);
router.get('/sale/:saleId', saleDetailController.getDetailsBySale);
router.post('/', saleDetailController.createDetail);
router.delete('/:id', saleDetailController.deleteDetail);

module.exports = router;
