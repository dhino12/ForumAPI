const InvariantError = require("../../../Commons/exceptions/InvariantError");

class CommentAdded {
    constructor({ id, thread_id, owner, content } = {}) {
        this._verifyPayload({ id, thread_id, owner, content });
        this.id = id;
        this.threadId = thread_id;
        this.owner = owner;
        this.content = content;
    }

    _verifyPayload({ id, content, thread_id, owner }) {
        /**
        * ini sudah tercover pada 
        * it('should create commentAdded object correctly', () => {})
         */
        if (!id || !thread_id || !content || !owner) {
            throw new InvariantError('COMMENT_ADDED.NOT_CONTAIN_NEEDED_PROPERTY')
        }
        if (typeof id !== 'string' || typeof owner !== 'string' || typeof content !== 'string' || typeof thread_id !== 'string') {
            throw new InvariantError('COMMENT_ADDED.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CommentAdded;