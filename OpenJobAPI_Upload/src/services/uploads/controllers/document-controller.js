import path from 'path';
import fs from 'fs';
import response from '../../../utils/response.js';
import DocumentRepository from '../repositories/document-repository.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import { UPLOAD_FOLDER } from '../storage/storage-config.js';

export const getDocuments = async (req, res, next) => {
    try {
        const documents = await DocumentRepository.getDocuments();
        return response(res, 200, 'success', { documents });
    } catch (err) {
        return next(err);
    }
};

export const getDocumentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const document = await DocumentRepository.getDocumentById(id);
        if (!document) {
            return next(new NotFoundError('Document not found'));
        }

        const filePath = path.join(UPLOAD_FOLDER, document.filename);
        if (!fs.existsSync(filePath)) {
            return next(new NotFoundError('File not found on server'));
        }

        res.setHeader('Content-Type', document.mime_type || 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(document.original_name)}"`);
        res.sendFile(filePath);
    } catch (err) {
        return next(err);
    }
};

export const deleteDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const document = await DocumentRepository.getDocumentById(id);
        if (!document) {
            return next(new NotFoundError('Document not found'));
        }

        const filePath = path.join(UPLOAD_FOLDER, document.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        const deleted = await DocumentRepository.deleteDocument(id);
        if (!deleted) {
            return next(new NotFoundError('Document not found'));
        }

        return response(res, 200, 'success', { message: 'Document deleted' });
    } catch (err) {
        return next(err);
    }
};