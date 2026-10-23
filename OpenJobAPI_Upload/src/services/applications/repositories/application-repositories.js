import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import CacheService from '../../../cache/redis-service.js';

class ApplicationRepositories {
    constructor() {
        this.cacheService = new CacheService();
        this.pool = new Pool();
    }

    async createApplication({ job_id, user_id, status }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: `INSERT INTO applications
               (id, job_id, user_id, status, created_at, updated_at)
               VALUES($1, $2, $3, $4, $5, $6)
               RETURNING id, job_id, user_id, status, created_at, updated_at`,
            values: [id, job_id, user_id, status, createdAt, updatedAt],
        };

        const result = await this.pool.query(query);

        await this.cacheService.delete(`Application:${id}`);
        await this.cacheService.delete(`ApplicationsByUser:${user_id}`);
        await this.cacheService.delete(`ApplicationsByJob:${job_id}`);

        return result.rows[0];
    }

    async getApplication() {
        const query = {
            text: `
              SELECT 
                apps.id,
                apps.job_id,
                apps.user_id,
                apps.status,
                jobs.title AS job_title,
                companies.name AS company_name,
                users.name AS applicant_name,
                jobs.location_type AS job_location_type,
                jobs.experience_level,
                jobs.job_type,
                jobs.salary_max,
                jobs.is_salary_visible,
                jobs.salary_min
              FROM applications apps
              JOIN jobs ON apps.job_id = jobs.id
              JOIN companies ON jobs.company_id = companies.id
              JOIN users ON apps.user_id = users.id
            `
        };
        const result = await this.pool.query(query);
        return result.rows;
    }

    async getApplicationById(id) {
        const cacheKey = `Application:${id}`;
        try {
            const cached = await this.cacheService.get(cacheKey);
            return { data: JSON.parse(cached), fromCache: true };
        } catch (error) {
            const query = {
                text: `
                    SELECT 
                      apps.id,
                      apps.job_id,
                      apps.user_id,
                      apps.status,
                      jobs.title AS job_title,
                      companies.name AS company_name,
                      users.name AS applicant_name,
                      jobs.location_type AS job_location_type,
                      jobs.experience_level,
                      jobs.job_type,
                      jobs.salary_max,
                      jobs.is_salary_visible,
                      jobs.salary_min
                    FROM applications apps
                    JOIN jobs ON apps.job_id = jobs.id
                    JOIN companies ON jobs.company_id = companies.id
                    JOIN users ON apps.user_id = users.id
                    WHERE apps.id = $1
                  `,
                values: [id]
            };
            const result = await this.pool.query(query);
            if (result.rows.length > 0) {
                await this.cacheService.set(cacheKey, JSON.stringify(result.rows[0]));
            }
            return { data: result.rows[0] || null, fromCache: false };
        }
    }

    async getApplicationByJob(job_id) {
        const cacheKey = `ApplicationsByJob:${job_id}`;
        try {
            const cached = await this.cacheService.get(cacheKey);
            return { data: JSON.parse(cached), fromCache: true };
        } catch (error) {
            const query = {
                text: `
                    SELECT 
                      apps.id,
                      apps.job_id,
                      apps.user_id,
                      apps.status,
                      jobs.title AS job_title,
                      companies.name AS company_name,
                      users.name AS applicant_name,
                      jobs.location_type AS job_location_type,
                      jobs.experience_level,
                      jobs.job_type,
                      jobs.salary_max,
                      jobs.is_salary_visible,
                      jobs.salary_min
                    FROM applications apps
                    JOIN jobs ON apps.job_id = jobs.id
                    JOIN companies ON jobs.company_id = companies.id
                    JOIN users ON apps.user_id = users.id
                    WHERE apps.job_id = $1
                  `,
                values: [job_id]
            };
            const result = await this.pool.query(query);
            await this.cacheService.set(cacheKey, JSON.stringify(result.rows));
            return { data: result.rows, fromCache: false };
        }
    }

    async getApplicationByUser(user_id) {
        const cacheKey = `ApplicationsByUser:${user_id}`;
        try {
            const cached = await this.cacheService.get(cacheKey);
            return { data: JSON.parse(cached), fromCache: true };
        } catch (error) {
            const query = {
                text: `
                    SELECT 
                      apps.id,
                      apps.job_id,
                      apps.user_id,
                      apps.status,
                      apps.created_at,
                      apps.updated_at,
                      jobs.title AS job_title,
                      companies.name AS company_name,
                      users.name AS applicant_name,
                      jobs.location_type AS job_location_type,
                      jobs.experience_level,
                      jobs.job_type,
                      jobs.salary_max,
                      jobs.is_salary_visible,
                      jobs.salary_min
                    FROM applications apps
                    JOIN jobs ON apps.job_id = jobs.id
                    JOIN companies ON jobs.company_id = companies.id
                    JOIN users ON apps.user_id = users.id
                    WHERE apps.user_id = $1
                  `,
                values: [user_id]
            };
            const result = await this.pool.query(query);
            await this.cacheService.set(cacheKey, JSON.stringify(result.rows));
            return { data: result.rows, fromCache: false };
        }
    }

    async deleteApplication(id) {
        // Get application first to retrieve user_id and job_id
        const getQuery = {
            text: 'SELECT user_id, job_id FROM applications WHERE id = $1',
            values: [id],
        };
        const getResult = await this.pool.query(getQuery);
        
        if (getResult.rows.length === 0) {
            return null;
        }

        const { user_id, job_id } = getResult.rows[0];

        const query = {
            text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await this.pool.query(query);

        await this.cacheService.delete(`Application:${id}`);
        await this.cacheService.delete(`ApplicationsByUser:${user_id}`);
        await this.cacheService.delete(`ApplicationsByJob:${job_id}`);

        return result.rows[0] || null;
    }

    async editApplication({ id, status }) {
        // Get application first to retrieve user_id and job_id
        const getQuery = {
            text: 'SELECT user_id, job_id FROM applications WHERE id = $1',
            values: [id],
        };
        const getResult = await this.pool.query(getQuery);
        
        if (getResult.rows.length === 0) {
            return null;
        }

        const { user_id, job_id } = getResult.rows[0];

        const updatedAt = new Date().toISOString();
        const query = {
            text: `UPDATE applications
               SET status = $1, updated_at = $2
               WHERE id = $3
               RETURNING id, job_id, user_id, status, created_at, updated_at`,
            values: [status, updatedAt, id],
        };
        const result = await this.pool.query(query);
        // Hapus cache
        await this.cacheService.delete(`Application:${id}`);
        await this.cacheService.delete(`ApplicationsByUser:${user_id}`);
        await this.cacheService.delete(`ApplicationsByJob:${job_id}`);
        return result.rows[0] || null;
    }
}

export default new ApplicationRepositories();