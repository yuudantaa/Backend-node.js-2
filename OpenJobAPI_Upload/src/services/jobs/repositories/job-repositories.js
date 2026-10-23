import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class JobRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async createJob({
        company_id, category_id, user_id, title, description, job_type,
        experience_level, location_type, location_city, salary_min, salary_max,
        is_salary_visible, status
    }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        // Pastikan field opsional bernilai null jika undefined
        const values = [
            id,
            company_id,
            category_id,
            user_id ?? null,
            title,
            description,
            job_type,
            experience_level,
            location_type,
            location_city ?? null,
            salary_min ?? null,
            salary_max ?? null,
            is_salary_visible ?? null,
            status,
            createdAt,
            updatedAt
        ];

        const query = {
            text: `INSERT INTO jobs
               (id, company_id, category_id, user_id, title, description,
                job_type, experience_level, location_type, location_city,
                salary_min, salary_max, is_salary_visible, status,
                created_at, updated_at)
               VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
               RETURNING id`,
            values,
        };

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async verifyNewJobTitle(title) {
        const query = {
            text: 'SELECT title FROM jobs WHERE title = $1', 
            values: [title],
        };
        const result = await this.pool.query(query);
        return result.rows.length > 0;
    }

    async getJobs({ title, companyName } = {}) {
        const conditions = [];
        const values = [];
       
        let text = `
            SELECT 
              jobs.id, 
              jobs.company_id, 
              jobs.category_id, 
              jobs.title, 
              jobs.description, 
              jobs.job_type, 
              jobs.experience_level, 
              jobs.location_type, 
              jobs.salary_min, 
              jobs.salary_max, 
              jobs.status, 
              jobs.created_at, 
              jobs.updated_at
            FROM jobs 
            JOIN companies ON jobs.company_id = companies.id
          `;

        if (title) {
            values.push(`%${title}%`);
            conditions.push(`jobs.title ILIKE $${values.length}`);
        }
        if (companyName) {
            values.push(`%${companyName}%`);
            conditions.push(`companies.name ILIKE $${values.length}`);
        }
        if (conditions.length) {
            text += ` WHERE ${conditions.join(' AND ')}`;
        }

        const result = await this.pool.query({ text, values });
        return result.rows;
    }

    async getJobById(id) {
        const query = {
            text: 'SELECT * FROM jobs WHERE id = $1',
            values: [id],
        };
        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async getJobsByCategory(category_id) {
        const query = {
            text: 'SELECT * FROM jobs WHERE category_id = $1',
            values: [category_id],
        };
        const result = await this.pool.query(query);
        return result.rows; // array
    }

    async getJobsByCompany(company_id) {
        const query = {
            text: 'SELECT * FROM jobs WHERE company_id = $1',
            values: [company_id],
        };
        const result = await this.pool.query(query);
        return result.rows;
    }

    async deleteJob(id) {
        const query = {
            text: 'DELETE FROM jobs WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await this.pool.query(query);
        return result.rows[0] || null;
    }

    async editJobs({ id, company_id, category_id, user_id, title, description, job_type, experience_level, location_type, location_city, salary_min, salary_max, is_salary_visible, status }) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: `UPDATE jobs SET
            company_id = $1,
            category_id = $2,
            user_id=$3,
            title = $4,
            description = $5,
            job_type = $6,
            experience_level = $7,
            location_type = $8,
            location_city = $9,
            salary_min = $10,
            salary_max = $11,
            is_salary_visible = $12,
            status = $13,
            updated_at = $14
        WHERE id = $15
        RETURNING id`,
            values: [company_id, category_id, user_id, title, description, job_type, experience_level, location_type, location_city, salary_min, salary_max, is_salary_visible, status, updatedAt, id],
        };
        const result = await this.pool.query(query);
        return result.rows[0] || null;
    }

}
export default new JobRepositories();