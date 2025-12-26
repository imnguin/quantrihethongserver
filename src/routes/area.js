import express from 'express';
import { areaController } from '../controllers/areaController.js';

const router = express.Router();
const path = '/api/area';

router.post('/add', areaController.insert);
router.post('/update', areaController.update);
router.post('/search',  areaController.search);
router.post('/load',  areaController.load);
router.post('/delete', areaController.deleted);
router.post('/getCache', areaController.getCache);

export const areaRouter = {
    path,
    router
};