import { Router } from 'express';
import {
    createApplications,
    getApplications,
    getApplicationById,
    getApplicationsByUser,
    getApplicationsByJob,
    editApplicationsById,
    deleteApplicationById
} from '../controller/application-controller.js';
import validate from '../../../middlewares/validate.js';
import { createApplicationPayloadSchema, updateApplicationStatusSchema } from '../validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = Router();

router.post('/applications', authenticateToken, validate(createApplicationPayloadSchema), createApplications);
router.get('/applications/user/:user_id', authenticateToken, getApplicationsByUser);
router.get('/applications/job/:job_id', authenticateToken, getApplicationsByJob);
router.get('/applications/:id', authenticateToken, getApplicationById);
router.get('/applications', authenticateToken, getApplications);
router.put('/applications/:id', authenticateToken, validate(updateApplicationStatusSchema), editApplicationsById);
router.delete('/applications/:id', authenticateToken, deleteApplicationById);

export default router;
