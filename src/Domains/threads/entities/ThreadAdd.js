class ThreadAdd {
    constructor({ owner, title, body} = {}) {
        this._verifyPayload({owner, title, body});
        this.title = title;
        this.body = body;
        this.owner = owner;
    }

    _verifyPayload({ owner, title, body }) {
        if (!title || !body || !owner) {
            throw new Error("THREAD_ADD.NOT_CONTAIN_NEEDED_PROPERTY")
        }
        if (typeof title !== 'string' || typeof body !== "string") {
            throw new Error('THREAD_ADD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ThreadAdd