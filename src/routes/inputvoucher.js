import express from 'express';
import { inputvoucherController } from '../controllers/inputvoucherController.js';

const router = express.Router();
const path = '/api/inputvoucher';
router.post('/search',  inputvoucherController.search);
router.post('/load',  inputvoucherController.load);
router.post('/add', inputvoucherController.insert);
router.post('/delete', inputvoucherController.deleted);
router.post('/loadInputVoucherDetail', inputvoucherController.loadInputVoucherDetail);

export const inputvoucherrouter = {
    path,
    router
};