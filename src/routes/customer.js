import express from 'express';
import { customerController } from '../controllers/customerController.js';

const router = express.Router();
const path = '/api/customer';

router.post('/add', customerController.insert);
router.post('/update', customerController.update);
router.post('/search',  customerController.search);
router.post('/load',  customerController.load);
router.post('/delete', customerController.deleted);
router.post('/getCache', customerController.getCache);

export const customerRouter = {
    path,
    router
};