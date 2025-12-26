import express from 'express';
import { product_lotController } from '../controllers/product_lotController.js';

const router = express.Router();
const path = '/api/product_lot';

router.post('/add', product_lotController.insert);
router.post('/update', product_lotController.update);
router.post('/search',  product_lotController.search);
router.post('/load',  product_lotController.load);
router.post('/delete', product_lotController.deleted);
router.post('/getCache', product_lotController.getCache);

export const product_lotRouter = {
    path,
    router
};