import express from 'express';
import { productsubgroupController } from '../controllers/productsubgroupController.js';

const router = express.Router();
const path = '/api/productsubgroup';

router.post('/add', productsubgroupController.insert);
router.post('/update', productsubgroupController.update);
router.post('/search',  productsubgroupController.search);
router.post('/load',  productsubgroupController.load);
router.post('/delete', productsubgroupController.deleted);
router.post('/getCache', productsubgroupController.getCache);

export const productsubgroupRouter = {
    path,
    router
};