import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class DocumentRepository {
    constructor() {
        this.pool = new Pool();
    }

    async createDocument({ filename, original_name, mime_type, size, user_id }) {
        const id = nanoid(16);
        const now = new Date().toISOString();
        const query = {
            text: `
                INSERT INTO documents
                (id, filename, original_name, mime_type, size, user_id, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id, filename, original_name, size
            `,
            values: [id, filename, original_name, mime_type, size, user_id, now, now],
        };
        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async getDocuments() {
        const query = {
            text: 'SELECT id, filename, original_name, mime_type, size, user_id, created_at FROM documents ORDER BY created_at DESC',
        };
        const result = await this.pool.query(query);
        return result.rows;
    }

    async getDocumentById(id) {
        const query = {
            text: 'SELECT id, filename, original_name, mime_type, size, user_id, created_at FROM documents WHERE id = $1',
            values: [id],
        };
        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async deleteDocument(id) {
        const query = {
            text: 'DELETE FROM documents WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await this.pool.query(query);
        return result.rows[0] || null;
    }
}

export default new DocumentRepository();