const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentsRepository = require("../../Domains/comments/CommentsRepository");
const CommentAdded = require("../../Domains/comments/entities/CommentAdded");
const CommentRead = require("../../Domains/comments/entities/CommentRead");

class CommentRepositoryPostgres extends CommentsRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async getCommentByThreadId(threadId) {
        const query = {
            text: `SELECT comments.id, comments.created_at, comments.content, comments.is_delete, users.username FROM comments
            LEFT JOIN users ON comments.owner = users.id WHERE comments.thread_id = $1 ORDER BY comments.created_at
            `,
            values: [threadId],
        }
        const result = await this._pool.query(query);
        
        return result.rows
    }

    async addComment(comment) {
        const { content, threadId, owner } = comment;
        const id = `comment-${this._idGenerator()}`;

        const query = {
            text: `INSERT INTO comments VALUES ($1, $2, $3, $4) RETURNING id, thread_id, owner, content`,
            values: [id, threadId, owner, content]
        }
        const result = await this._pool.query(query);
        return new CommentAdded({...result.rows[0]})
    }

    async getCommentById(commentId) {
        const query = {
            text: `SELECT comments.id, comments.content, comments.created_at, comments.is_delete, users.username FROM comments
            LEFT JOIN users ON users.id = comments.owner WHERE comments.id = $1
            `,
            values: [commentId],
        };
        const result = await this._pool.query(query);
        return new CommentRead({ ...result.rows[0] });
    }

    async deleteCommentById(commentId) {
        const query = {
            text: `UPDATE comments SET is_delete = true WHERE id = $1 RETURNING id, content, owner as username, created_at, is_delete`,
            values: [commentId]
        }
        const result = await this._pool.query(query);
        return new CommentRead({ ...result.rows[0] })
    }

    async verifyCommentById(commentId, userId, threadId) {
        const query = {
            text: `SELECT comments.id, comments.owner, comments.created_at, comments.content, comments.is_delete, users.username FROM comments
            LEFT JOIN users ON comments.owner = users.id WHERE comments.id = $1 ORDER BY comments.created_at`,
            values: [commentId]
        }
        const result = await this._pool.query(query);
        console.log(result.rows.length, " -------- ");
        if (!result.rowCount) {
            throw new NotFoundError("Komentar tidak ditemukan");
        }
        if (result.rows[0].owner != userId) {
            throw new AuthorizationError("Maaf anda tidak diizinkan menghapus komentar ini");
        }
        return new CommentRead({ ...result.rows[0] });
    }
}

module.exports = CommentRepositoryPostgres