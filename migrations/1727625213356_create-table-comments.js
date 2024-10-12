/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        thread_id: {
            type: 'TEXT',
            notNull: true
        },
        owner: {
            type: 'TEXT',
            notNull: true
        },
        content: {
            type: 'TEXT',
        },
        created_at: {
            type: "TIMESTAMPTZ",
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: "TIMESTAMPTZ",
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP')
        },
        is_delete: {
            type: "BOOLEAN",
            notNull: true,
            default: false
        },
    });

    pgm.addConstraint(
        "comments",
        "fk_comments.thread_id.id",
        "FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE"
    )
    pgm.addConstraint(
        "comments",
        "fk_comments.owner_user.id",
        "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
    )

    // Buat fungsi untuk mengupdate kolom updated_at
    pgm.sql(`
        CREATE OR REPLACE FUNCTION trigger_set_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    // Buat trigger untuk memanggil fungsi di atas sebelum update pada tabel threads
    pgm.sql(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON comments
        FOR EACH ROW
        EXECUTE FUNCTION trigger_set_timestamp();
    `);
};

exports.down = pgm => {
    
};
