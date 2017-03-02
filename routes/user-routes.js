import express from 'express';
// import { signIn, signUp } from '../controllers/user-controllers';
import * as UserController from '../controllers/user-controllers';

const router = express.Router();

router.post('/signin', UserController.signIn);

router.post('/signup', UserController.signUp);

router.get('/logout', UserController.logout);

export default router;