import express from 'express';
import { quantityUnitController } from '../controllers/quantityUnitController.js';

const router = express.Router();
const path = '/api/quantityunit';

router.post('/add', quantityUnitController.insert);
router.post('/update', quantityUnitController.update);
router.post('/search',  quantityUnitController.search);
router.post('/load',  quantityUnitController.load);
router.post('/delete', quantityUnitController.deleted);
router.post('/getCache', quantityUnitController.getCache);

export const quantityUnitRouter = {
    path,
    router
};
