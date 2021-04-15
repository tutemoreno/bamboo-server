import { Router } from 'express';

import {
  createPost,
  getPosts,
  getImage,
  like,
  unlike,
} from '../controllers/posts';
import { verifyToken } from '../middlewares';

const router = Router();

router.post('', verifyToken, createPost);

router.post('/:id/like', verifyToken, like);

router.post('/:id/unlike', verifyToken, unlike);

router.get('/:perPage/:page', verifyToken, getPosts);

router.get('/:id', getImage);

// router.delete('', verifyToken, deletePost);

export default router;
