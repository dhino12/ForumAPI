/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentTableTestHelper = {
    async addComment({
        id='comment-12345',
        thread_id='thread-12345',
        owner='user-123',
        content='hello world'
    }) {
        const query = {
            text: `INSERT INTO comments VALUES ($1, $2, $3, $4)`,
            values: [id, thread_id, owner, content]
        };
        await pool.query(query);
    },

    async findCommentById(id) {
        const query = {
            text: "SELECT * FROM comments WHERE id = $1",
            values: [id],
        };
        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query("TRUNCATE TABLE threads CASCADE");
    }
}

module.exports = CommentTableTestHelper;