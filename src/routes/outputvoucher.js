import express from 'express';
import { outputvoucherController } from '../controllers/outputvoucherController.js';

const router = express.Router();
const path = '/api/outputvoucher';
router.post('/search',  outputvoucherController.search);
router.post('/load',  outputvoucherController.load);
router.post('/add', outputvoucherController.insert);
router.post('/loadOutoutVoucherDetail', outputvoucherController.loadOutoutVoucherDetail);
router.post('/delete', outputvoucherController.deleted);

export const outputvoucherRouter = {
    path,
    router
};