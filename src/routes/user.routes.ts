import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
	blockUserController,
	getCurrentUserController,
	getUserByIdController,
	getUsersController
} from '../controllers/user.controller.js';

const router = Router();

router.get('/me', authMiddleware, getCurrentUserController);
router.get('/', authMiddleware, getUsersController);
router.get('/:id', authMiddleware, getUserByIdController);
router.patch('/:id/block', authMiddleware, blockUserController);

export default router;
