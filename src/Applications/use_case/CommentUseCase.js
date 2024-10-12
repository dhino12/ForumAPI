const InvariantError = require("../../Commons/exceptions/InvariantError");
const CommentAdd = require("../../Domains/comments/entities/CommentAdd");

class CommentUseCase {
    constructor({ 
        commentsRepository,
        threadRepository
    }) {
        this._commentRepositoryPostgres = commentsRepository;
        this._threadRepositoryPostgres = threadRepository;
    }

    async executeAdd({ content } = {}, { threadId, userId } = {}) {
        // validate & verify threadById
        this._validatePayload({ content }, { threadId, userId });
        await this._threadRepositoryPostgres.verifyAvailabelThread(threadId);
    
        const comment = new CommentAdd({ thread_id: threadId, owner: userId, content });
        return this._commentRepositoryPostgres.addComment(comment);
    }    

    _validatePayload(payload, { threadId, userId }) {
        const { content } = payload;
        if (!userId || !threadId || !content) {
            throw new InvariantError('COMMENT_USECASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof content !== 'string' || typeof threadId !== 'string' || typeof userId !== "string") {
            throw new InvariantError('COMMENT_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CommentUseCase;