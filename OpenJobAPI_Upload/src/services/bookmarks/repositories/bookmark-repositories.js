import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import CacheService from '../../../cache/redis-service.js';

class BookmarkRepositories {
    constructor() {
        this.pool = new Pool();
        this.cacheService = new CacheService();
    }

    async createBookmark({ job_id, user_id }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO bookmarks(id, job_id, user_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, job_id, user_id, createdAt, updatedAt],
        };

        const result = await this.pool.query(query);

        // Invalidate user's bookmarks cache
        await this.cacheService.delete(`Bookmarks:${user_id}`);

        return result.rows[0];
    }

    async getBookmarkById(id) {
        const query = {
            text: 'SELECT * FROM bookmarks WHERE id = $1',
            values: [id],
        };
        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async deleteBookmarkByJob({ job_id, user_id }) {
        const query = {
            text: 'DELETE FROM bookmarks WHERE job_id = $1 AND user_id = $2 RETURNING id',
            values: [job_id, user_id],
        };
        const result = await this.pool.query(query);

        // Invalidate user's bookmarks cache
        await this.cacheService.delete(`Bookmarks:${user_id}`);

        return result.rows[0] ?? null;
    }

    async getBookmarksByUser(user_id) {
        const cacheKey = `Bookmarks:${user_id}`;
        try {
            const cached = await this.cacheService.get(cacheKey);
            return { data: JSON.parse(cached), fromCache: true };
        } catch (error) {
            const query = {
                text: `
                SELECT 
                  b.id,
                  b.job_id,
                  b.user_id,
                  b.created_at,
                  b.updated_at,
                  j.title AS job_title,
                  j.description AS job_description,
                  j.job_type,
                  j.experience_level,
                  j.location_type,
                  j.location_city,
                  j.salary_min,
                  j.salary_max,
                  j.is_salary_visible,
                  j.status AS job_status,
                  c.name AS company_name,
                  c.location AS company_location,
                  c.description AS company_description
                FROM bookmarks b
                JOIN jobs j ON b.job_id = j.id
                JOIN companies c ON j.company_id = c.id
                WHERE b.user_id = $1
              `,
                values: [user_id]
            };
            const result = await this.pool.query(query);
            await this.cacheService.set(cacheKey, JSON.stringify(result.rows));
            return { data: result.rows, fromCache: false };
        }
    }

}

export default new BookmarkRepositories();