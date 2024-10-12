class ThreadAdded {
    constructor({ id, title, body, owner } = {}) {
        this._verifyPayload({id, title, body, owner});
        this.id = id;
        this.title = title;
        this.body = body;
        this.owner = owner;
    }

    _verifyPayload({ id, title, body, owner }) {
        /**
        * ini sudah tercover pada 
        * it('should create threadResponse object correctly', () => {})
         */
        if (!id || !title || !body || !owner) {
            throw new Error('THREAD_ADDED.NOT_CONTAIN_NEEDED_PROPERTY')
        }
        if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
            throw new Error('THREAD_ADDED.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ThreadAdded;