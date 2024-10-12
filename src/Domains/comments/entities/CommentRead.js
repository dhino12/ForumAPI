class CommentRead {
    constructor({ id, content, username, created_at, is_delete} = {}) {
        this._verifyPayload({ id, content, username, created_at: `${created_at}` });
        this.id = id;
        this.content = content;
        this.username = username;
        this.date = created_at;
        this.is_delete = is_delete;
    }

    _verifyPayload({ id, content, username, created_at }) {
        /**
        * ini sudah tercover pada 
        * it('should create commentAdded object correctly', () => {})
         */
        if (!id || !created_at?.length || !username?.length || !content?.length) {
            throw new Error('COMMENTS_READ.NOT_CONTAIN_NEEDED_PROPERTY')
        }
        if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string' || typeof created_at != 'string') {
            throw new Error('COMMENTS_READ.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CommentRead;