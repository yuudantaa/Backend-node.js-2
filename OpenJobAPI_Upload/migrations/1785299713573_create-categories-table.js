/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
    pgm.createTable('categories', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'VARCHAR(50)',
            notNull: true,
            unique: true,
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
    pgm.dropTable('categories');
};