import ClientError from '../../../exceptions/client-error.js';
import response from '../../../utils/response.js';
import DocumentRepository from '../repositories/document-repository.js';

export const uploadPDF = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ClientError('File is required'));
        }

        // Simpan metadata ke database
        const userId = req.user.id; // dari middleware authenticateToken
        const { filename, originalname, mimetype, size } = req.file;

        const document = await DocumentRepository.createDocument({
            filename,
            original_name: originalname,
            mime_type: mimetype,
            size,
            user_id: userId,
        });

        return response(res, 201, 'success', {
            documentId: document.id,
            filename: document.filename,
            originalName: document.original_name,
            size: document.size,
        });
    } catch (err) {
        return next(err);
    }
};