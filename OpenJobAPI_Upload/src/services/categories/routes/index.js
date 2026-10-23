import { Router } from 'express';
import { createCategory, getCategory, getCategoryById, editCategoryById, deleteCategoryById } from '../controller/category-controller.js';
import validate from '../../../middlewares/validate.js';
import { categoryPayloadSchema } from '../../../services/categories/validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = Router();

router.post('/categories', authenticateToken, validate(categoryPayloadSchema), createCategory);
router.get('/categories', getCategory);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', authenticateToken, validate(categoryPayloadSchema), editCategoryById);
router.delete('/categories/:id', authenticateToken, deleteCategoryById);

export default router;