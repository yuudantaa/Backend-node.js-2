import { Router } from 'express';
import users from '../services/users/routes/index.js';
import authentications from '../services/authentications/routes/index.js';
import companies from '../services/companies/routes/index.js';
import categories from '../services/categories/routes/index.js';
import jobs from '../services/jobs/routes/index.js';
import bookmarks from '../services/bookmarks/routes/index.js';
import applications from '../services/applications/routes/index.js';
import exports from '../services/exports/routes/index.js';
import documents from '../services/uploads/routes/index.js';

const router = Router();

router.use('/', users);
router.use('/', categories);
router.use('/', companies);
router.use('/', jobs);
router.use('/', bookmarks);
router.use('/', authentications);
router.use('/', applications);
router.use('/', documents);
router.use('/', exports);

export default router;