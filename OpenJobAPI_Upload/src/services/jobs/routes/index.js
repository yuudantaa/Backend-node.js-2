import { Router } from 'express';
import { createJob, getJobs, getJobById, getJobByCompanies, getJobByCategories, deleteJobsById, editJobById } from '../controller/job-controller.js';
import validate from '../../../middlewares/validate.js';
import { jobPayloadSchema, updateJobPayloadSchema } from '../../../services/jobs/validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = Router();

router.get('/jobs/company/:company_id', getJobByCompanies);
router.get('/jobs/category/:category_id', getJobByCategories);
router.get('/jobs/:id', getJobById);
router.get('/jobs', getJobs);
router.post('/jobs', authenticateToken, validate(jobPayloadSchema), createJob);
router.put('/jobs/:id', authenticateToken, validate(updateJobPayloadSchema), editJobById);
router.delete('/jobs/:id', authenticateToken, deleteJobsById);

export default router;
