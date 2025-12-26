import express from 'express';
import { userController } from '../controllers/userController.js';

const router = express.Router();
const path = '/api/user';

router.post('/add', userController.insert);
router.post('/update', userController.update);
router.post('/search',  userController.search);
router.post('/load',  userController.load);
router.post('/delete', userController.deleted);

export const userRouter = {
    path,
    router
};
