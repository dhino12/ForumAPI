
class CommentAdd{
    /**
     * 
     * @param {*} { thread_id, owner, content }
     * @returns {*}
     * { threadId, owner, content } 
     */
    constructor({ thread_id, owner, content } = {}) {
        this._verifyPayload({ thread_id, owner, content });

        this.threadId = thread_id;
        this.owner = owner;
        this.content = content;
    }

    _verifyPayload({ thread_id, owner, content }) {
        /**
        * ini sudah tercover pada 
        * it('should create commentAdded object correctly', () => {})
         */
        if (!thread_id || !owner || !content) {
            throw new Error("COMMENT_ADD.NOT_CONTAIN_NEEDED_PROPERTY")
        }
        if (typeof thread_id !== 'string' || typeof content !== "string") {
            throw new Error('COMMENT_ADD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CommentAdd;