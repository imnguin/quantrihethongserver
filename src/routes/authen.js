import express from 'express'
import { authenController } from '../controllers/authenController.js';

const router = express.Router();
const path = '/api/authen'

router.post('/login', authenController.login);

router.post('/refeshToken', authenController.refeshToken);

export const authenRouter = {
    path,
    router
}