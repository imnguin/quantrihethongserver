import express from 'express';
import { itemstockbeginController } from '../controllers/itemstockbeginController.js';

const router = express.Router();
const path = '/api/itemstockbegin';

router.post('/updateitemstockbegin', itemstockbeginController.updateItemStock);
router.post('/calculate', itemstockbeginController.calculate);
router.post('/calculatemonthlyrevenue', itemstockbeginController.calculatemonthlyrevenue);
router.post('/getall', itemstockbeginController.getall);

export const itemstockbeginRouter = {
    path,
    router
};