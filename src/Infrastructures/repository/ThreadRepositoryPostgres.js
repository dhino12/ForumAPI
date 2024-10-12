const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ThreadAdded = require("../../Domains/threads/entities/ThreadAdded");
const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async verifyAvailabelThread(threadId) {
        const query = {
            text: `SELECT threads.id, threads.title, threads.body, threads.created_at, users.username FROM threads 
            LEFT JOIN users ON users.id = threads.owner 
            WHERE threads.id = $1`,
            values: [threadId]
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan')
        }
        return new ThreadDetail({ ...result.rows[0], created_at: `${result.rows[0]}` })
    }

    async addThread(thread) {
        const { title, body, owner } = thread;
        const id = `thread-${this._idGenerator()}`;

        const query = {
            text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, body, owner",
            values: [id, owner, title, body],
        };
        const result = await this._pool.query(query);
        return new ThreadAdded({...result.rows[0]})
    }

    async detailThread(threadId) {
        const query = {
            text: `SELECT threads.id, threads.title, threads.body, threads.created_at, users.username FROM threads 
            LEFT JOIN users ON users.id = threads.owner 
            WHERE threads.id = $1`,
            values: [threadId]
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan')
        }
        console.log(result.rows[0]);
        return new ThreadDetail({ ...result.rows[0], created_at: `${result.rows[0]}` })
    }
}

module.exports = ThreadRepositoryPostgres