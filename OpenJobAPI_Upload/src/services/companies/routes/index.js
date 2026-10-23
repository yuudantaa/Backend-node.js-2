import { Router } from 'express';
import { createCompany, getCompanies, getCompanyById, deleteCompanyById, editCompanyById } from '../controller/company-controller.js';
import validate from '../../../middlewares/validate.js';
import { companyPayloadSchema, updateCompanyPayloadSchema } from '../../../services/companies/validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = Router();

router.post('/companies', authenticateToken, validate(companyPayloadSchema), createCompany);
router.get('/companies', getCompanies);
router.get('/companies/:id', getCompanyById);
router.put('/companies/:id', authenticateToken, validate(updateCompanyPayloadSchema), editCompanyById);
router.delete('/companies/:id', authenticateToken, deleteCompanyById);

export default router;