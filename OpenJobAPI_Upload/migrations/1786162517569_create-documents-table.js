export const shorthands = undefined;

export const up = (pgm) => {
    pgm.createTable('documents', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        filename: {
            type: 'TEXT',
            notNull: true,
        },
        original_name: {
            type: 'TEXT',
            notNull: true,
        },
        mime_type: {
            type: 'TEXT',
            notNull: true,
        },
        size: {
            type: 'INTEGER',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
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
    pgm.addConstraint('documents', 'fk_documents.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

export const down = (pgm) => {
    pgm.dropTable('documents');
};