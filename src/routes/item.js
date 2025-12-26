import express from 'express';
import { itemController } from '../controllers/itemController.js';

const router = express.Router();
const path = '/api/item';

router.post('/add', itemController.insert);
router.post('/update', itemController.update);
router.post('/search',  itemController.search);
router.post('/load',  itemController.load);
router.post('/delete', itemController.deleted);
router.post('/getCache', itemController.getCache);

export const itemRouter = {
    path,
    router
};