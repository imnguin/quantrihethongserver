import express from 'express';
import { brandController } from '../controllers/brandController.js';

const router = express.Router();
const path = '/api/brand';

router.post('/add', brandController.insert);
router.post('/update', brandController.update);
router.post('/search',  brandController.search);
router.post('/load',  brandController.load);
router.post('/delete', brandController.deleted);
router.post('/getCache', brandController.getCache);

export const brandRouter = {
    path,
    router
};