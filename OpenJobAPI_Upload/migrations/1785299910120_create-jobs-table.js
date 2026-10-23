/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
    pgm.createTable('jobs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        company_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        category_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: false,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        description: {
            type: 'TEXT',
            notNull: true,
        },
        job_type: {
            type: 'TEXT',
            notNull: true,
        },
        experience_level: {
            type: 'TEXT',
            notNull: true,
        },
        location_type: {
            type: 'TEXT',
            notNull: true,
        },
        location_city: {
            type: 'TEXT',
            notNull: false,
        },
        salary_min: {
            type: 'INTEGER',
            notNull: false,
        },
        salary_max: {
            type: 'INTEGER',
            notNull: false,
        },
        is_salary_visible: {
            type: 'BOOLEAN',
            notNull: false,
        },
        status: {
            type: 'TEXT',
            notNull: true,
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
    });
    pgm.addConstraint('jobs', 'fk_jobs.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('jobs', 'fk_jobs.company_id_companies.id', 'FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE CASCADE');
    pgm.addConstraint('jobs', 'fk_jobs.category_id_categories.id', 'FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE');
};

export const down = (pgm) => {
    pgm.dropTable('jobs');
};