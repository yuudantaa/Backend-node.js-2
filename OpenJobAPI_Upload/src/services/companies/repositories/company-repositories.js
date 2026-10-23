import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import CacheService from '../../../cache/redis-service.js';

class CompanyRepositories {
    constructor() {
        this.pool = new Pool();
        this.cacheService = new CacheService();
    }

    async createCompanies({ name, description, location }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO companies(id, name, location, description, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, name, location, description, createdAt, updatedAt],
        };

        const result = await this.pool.query(query);
        await this.cacheService.delete(`company:${id}`);
        return result.rows[0];
    }

    async verifyNewCompanyName(name) {
        const query = {
            text: 'SELECT name FROM companies WHERE name = $1',
            values: [name],
        };

        const result = await this.pool.query(query);

        return result.rows.length > 0;
    }

    async getCompanies() {
        const query = {
            text: `SELECT * FROM companies`,
        };
        const result = await this.pool.query(query);
        return result.rows;
    }

    async getCompaniesById(id) {
        const cacheKey = `company:${id}`;
        try {
            const cached = await this.cacheService.get(cacheKey);
            return { data: JSON.parse(cached), fromCache: true };
        } catch (error) {
            const query = {
                text: 'SELECT * FROM companies WHERE id = $1',
                values: [id]
            };
            const result = await this.pool.query(query);
            if (result.rows.length > 0) {
                await this.cacheService.set(cacheKey, JSON.stringify(result.rows[0]));
            }
            return { data: result.rows[0] || null, fromCache: false };
        }
    }

    async deleteCompanies(id) {
        const query = {
            text: 'DELETE FROM companies WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this.pool.query(query);
        await this.cacheService.delete(`company:${id}`);

        return result.rows[0] || null;
    }

    async editCompanies({ id, name, description, location }) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE companies SET name = $1, description = $2, location = $3, updated_at = $4 WHERE id = $5 RETURNING id',
            values: [name, description, location, updatedAt, id],
        };

        const result = await this.pool.query(query);
        await this.cacheService.delete(`company:${id}`);

        return result.rows[0] || null;
    }
}

export default new CompanyRepositories();