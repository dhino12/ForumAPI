/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('threads', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        owner: {
            type: 'TEXT',
            notNull: true
        },
        title: {
            type: 'TEXT',
        },
        body: {
            type: 'TEXT'
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
    })

    pgm.addConstraint(
        "threads",
        "fk_threads.owner_user.id",
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
        BEFORE UPDATE ON threads
        FOR EACH ROW
        EXECUTE FUNCTION trigger_set_timestamp();
    `);
};

exports.down = pgm => {
    pgm.dropTable('threads');
};
