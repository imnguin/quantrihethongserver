import express from 'express';
import { priceController } from '../controllers/priceController.js';

const router = express.Router();
const path = '/api/price';

router.post('/add', priceController.insert);
router.post('/update', priceController.update);
router.post('/search',  priceController.search);
router.post('/load',  priceController.load);
router.post('/delete', priceController.deleted);
router.post('/getCache', priceController.getCache);

export const priceRouter = {
    path,
    router
};