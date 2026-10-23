import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import CacheService from '../../../cache/redis-service.js';

class UserRepositories {
    constructor() {
        this.pool = new Pool();
        this.cacheService = new CacheService();
    }

    async createUser({ name, password, email, role }) {
        const id = nanoid(16);
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: `INSERT INTO users
                   (id, name, password, email, role, created_at, updated_at)
                   VALUES($1, $2, $3, $4, $5, $6, $7)
                   RETURNING id, name, role, email, created_at, updated_at`,
            values: [id, name, hashedPassword, email, role, createdAt, updatedAt],
        };

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async verifyNewEmail(email) {
        const query = {
            text: 'SELECT email FROM users WHERE email = $1',
            values: [email],
        };

        const result = await this.pool.query(query);
        return result.rows.length > 0;
    }

    async getUsers() {
        const query = {
            text: `SELECT id, name, email, role, created_at, updated_at FROM users`,
        };
        const result = await this.pool.query(query);
        return result.rows;
    }

    async getUserById(id) {
        const cacheKey = `user:${id}`;
        try {
            const cached = await this.cacheService.get(cacheKey);
            return { data: JSON.parse(cached), fromCache: true };
        } catch (error) {
            const query = {
                text: 'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
                values: [id]
            };
            const result = await this.pool.query(query);
            if (result.rows.length > 0) {
                await this.cacheService.set(cacheKey, JSON.stringify(result.rows[0]));
            }
            return { data: result.rows[0] || null, fromCache: false };
        }
    }

    async editUsers({ id, name, password, email, role }) {
        const updatedAt = new Date().toISOString();
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = {
            text: 'UPDATE users SET name = $1, password = $2, email = $3, role = $4, updated_at = $5 WHERE id = $6 RETURNING id, name, email, role, created_at, updated_at',
            values: [name, hashedPassword, email, role, updatedAt, id],
        };

        const result = await this.pool.query(query);
        await this.cacheService.delete(`user:${id}`);

        return result.rows[0] || null;
    }

    async verifyUserCredential(email, password) {
        const query = {
            text: 'SELECT id, password FROM users WHERE email = $1',
            values: [email],
        };

        const result = await this.pool.query(query);
        if (!result.rows.length) {
            return null;
        }

        const { id, password: hashedPassword } = result.rows[0];
        const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordMatch) {
            return null;
        }

        return id;
    }
}

export default new UserRepositories();