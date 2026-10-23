import { Router } from 'express';
import validate from '../../../middlewares/validate.js';
import authenticateToken from '../../../middlewares/auth.js';
import {
    createBookmark,
    getBookmarkById,
    deleteBookmarkByJob,
    getBookmarks,
} from '../controller/bookmark-controller.js';
import { bookmarkPayloadSchema } from '../validator/schema.js';

const router = Router();

router.post('/jobs/:jobId/bookmark', authenticateToken, validate(bookmarkPayloadSchema), createBookmark);
router.get('/jobs/:jobId/bookmark/:id', authenticateToken, getBookmarkById);
router.delete('/jobs/:jobId/bookmark', authenticateToken, deleteBookmarkByJob);
router.get('/bookmarks', authenticateToken, getBookmarks);

export default router;