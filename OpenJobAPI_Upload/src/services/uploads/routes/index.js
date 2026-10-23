import { Router } from 'express';
import { uploadPDF } from '../controllers/upload-controller.js';
import {
    getDocuments,
    getDocumentById,
    deleteDocument,
} from '../controllers/document-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import { upload } from '../storage/storage-config.js';
import ClientError from '../../../exceptions/client-error.js';

const router = Router();

router.post(
    '/documents',
    authenticateToken,
    // Accept both 'document' and 'documents' field names to avoid LIMIT_UNEXPECTED_FILE
    upload.fields([
        { name: 'document', maxCount: 1 },
        { name: 'documents', maxCount: 1 },
    ]),
    (req, res, next) => {
        // Normalize to req.file so uploadPDF and other middleware keep working
        if (!req.file) {
            if (req.files && (req.files.document || req.files.documents)) {
                req.file = req.files.document ? req.files.document[0] : req.files.documents[0];
            }
        }

        if (!req.file) {
            return next(new ClientError('File is required'));
        }

        return next();
    },
    uploadPDF
);

// Get all documents
router.get('/documents', getDocuments);

// View / download document by id
router.get('/documents/:id', getDocumentById);

// Delete document (requires authentication)
router.delete('/documents/:id', authenticateToken, deleteDocument);

export default router;