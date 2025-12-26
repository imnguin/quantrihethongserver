import express from 'express';
import { branchController } from '../controllers/branchController.js';

const router = express.Router();
const path = '/api/branch';

router.post('/add', branchController.insert);
router.post('/update', branchController.update);
router.post('/search',  branchController.search);
router.post('/load',  branchController.load);
router.post('/delete', branchController.deleted);
router.post('/getCache', branchController.getCache);

export const branchRouter = {
    path,
    router
};