import { Router } from 'express';
import accountsRouter from './accounts';
import postsRouter from './posts';

const router = Router();

router.use('/accounts', accountsRouter);
router.use('/posts', postsRouter);

export default router;
