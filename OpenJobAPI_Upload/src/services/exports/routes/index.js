import { Router } from 'express';
import { exportData } from '../controllers/export-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { exportPayloadSchema } from '../validator/schema.js';

const router = Router();

router.post('/export/data', authenticateToken, validate(exportPayloadSchema), exportData);

export default router;