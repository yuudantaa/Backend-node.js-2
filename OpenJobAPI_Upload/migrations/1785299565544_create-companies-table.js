/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
    pgm.createTable('companies', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'VARCHAR(50)',
            notNull: true,
            unique: true,
        },
        location: {
            type: 'TEXT',
            notNull: true,
        },
        description: {
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
};

export const down = (pgm) => {
    pgm.dropTable('companies');
};