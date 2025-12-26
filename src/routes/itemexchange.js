import express from 'express';
import { itemexchangeController } from '../controllers/itemexchangeController.js';

const router = express.Router();
const path = '/api/itemexchange';

router.post('/add', itemexchangeController.insert);
router.post('/update', itemexchangeController.update);
router.post('/search',  itemexchangeController.search);
router.post('/load',  itemexchangeController.load);
router.post('/delete', itemexchangeController.deleted);
router.post('/getCache', itemexchangeController.getCache);

export const itemexchangeRouter = {
    path,
    router
};