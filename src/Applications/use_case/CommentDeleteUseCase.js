const InvariantError = require("../../Commons/exceptions/InvariantError");

class CommentDeleteUseCase {
    constructor({commentsRepository}) {
        this._commentRepositoryPostgres = commentsRepository;
    }

    async execute({commentId, userId, threadId} = {}) {
        this._validatePayload({ commentId, threadId, userId });
        await this._commentRepositoryPostgres.verifyCommentById(commentId, userId, threadId);
        return this._commentRepositoryPostgres.deleteCommentById(commentId);
    }

    _validatePayload({ commentId, threadId, userId } = {}) {
        if (!commentId || !threadId || !userId) {
            throw new InvariantError('COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof commentId !== 'string' || typeof threadId !== 'string' || typeof userId !== 'string') {
            throw new InvariantError('COMMENT_DELETE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CommentDeleteUseCase