/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
    pgm.createTable('applications', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        job_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
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
    pgm.addConstraint('applications', 'unique_application', 'UNIQUE(job_id, user_id)');
    pgm.addConstraint('applications', 'fk_applications.job_id_jobs.id', 'FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE');
    pgm.addConstraint('applications', 'fk_applications.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

export const down = (pgm) => {
    pgm.dropTable('applications');
};