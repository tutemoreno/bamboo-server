import { Router } from 'express';
// import { verifyToken } from '../middlewares';

import {
  serverSignUp,
  serverSignIn,
  facebookSignIn,
  googleSignIn,
  checkIfAlreadyExists,
} from '../controllers/accounts.js';

const router = Router();

router.post('/server/checkIfAlreadyExists', checkIfAlreadyExists);

router.post('/server/signUp', serverSignUp);

router.post('/server/signIn', serverSignIn);

router.post('/facebook/signIn', facebookSignIn);

router.post('/google/signIn', googleSignIn);

export default router;
