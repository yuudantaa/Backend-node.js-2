import { Router } from 'express';
import { createUser, getUserById, getUsers, getMyApplications, getMyBookmarks, getProfile, editUserById } from '../controller/user-controller.js';
import validate from '../../../middlewares/validate.js';
import { userPayloadSchema } from '../../../services/users/validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = Router();

router.post('/users', validate(userPayloadSchema), createUser);
router.get('/users/:id', getUserById);
router.get('/profile', authenticateToken, getProfile);
router.put('/users/:id', authenticateToken, validate(userPayloadSchema), editUserById);
router.get('/profile/applications', authenticateToken, getMyApplications);
router.get('/profile/bookmarks', authenticateToken, getMyBookmarks);

export default router;