const InvariantError = require("../../Commons/exceptions/InvariantError");
const CommentRead = require("../../Domains/comments/entities/CommentRead");
const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");

class ThreadDetailUseCase{
    constructor({ threadRepository, commentsRepository }) {
        this._threadRepositoryPostgres = threadRepository;
        this._commentsRepositoryPostgres = commentsRepository;
    }

    async execute(threadId) {
        this._validatePayload(threadId);
        const threadDetail = await this._threadRepositoryPostgres.detailThread(threadId);
        const threadComment = await this._commentsRepositoryPostgres.getCommentByThreadId(threadId);

        return new ThreadDetail({ 
            ...threadDetail,
            created_at: threadDetail.date, 
            comments: threadComment.map(comment => new CommentRead({ 
                ...comment,
                content: comment.is_delete ? "**komentar telah dihapus**" : comment.content,
                created_at: `${comment.date}`
            }))
        })
    }

    _validatePayload(threadId) {
        if (!threadId) {
            throw new InvariantError('THREAD_DETAIL_USECASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof threadId !== 'string') {
            throw new InvariantError('THREAD_DETAIL_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ThreadDetailUseCase;