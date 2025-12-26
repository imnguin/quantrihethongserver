import express from 'express';
import { promotionController } from '../controllers/promotionController.js';

const router = express.Router();
const path = '/api/promotion';

router.post('/add', promotionController.insert);
router.post('/update', promotionController.update);
router.post('/search',  promotionController.search);
router.post('/load',  promotionController.load);
router.post('/delete', promotionController.deleted);
router.post('/getCache', promotionController.getCache);

export const promotionRouter = {
    path,
    router
};