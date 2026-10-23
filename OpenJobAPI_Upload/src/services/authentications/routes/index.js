import { Router } from 'express';
import { login, refreshToken, logout } from '../controller/authentication-controller.js';
import validate from '../../../middlewares/validate.js';
import {
    postAuthenticationPayloadSchema,
    putAuthenticationPayloadSchema,
    deleteAuthenticationPayloadSchema,
} from '../validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';
const router = Router();

router.post('/authentications', validate(postAuthenticationPayloadSchema), login);
router.put('/authentications', validate(putAuthenticationPayloadSchema), refreshToken);
router.delete('/authentications', authenticateToken, validate(deleteAuthenticationPayloadSchema), logout);

export default router;