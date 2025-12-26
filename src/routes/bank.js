import express from 'express';
import { bankController } from '../controllers/bankController.js';

const router = express.Router();
const path = '/api/bank';

router.post('/add', bankController.insert);
router.post('/update', bankController.update);
router.post('/search',  bankController.search);
router.post('/load',  bankController.load);
router.post('/delete', bankController.deleted);
router.post('/getCache', bankController.getCache);

export const bankRouter = {
    path,
    router
};