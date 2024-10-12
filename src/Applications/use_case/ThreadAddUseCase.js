const InvariantError = require("../../Commons/exceptions/InvariantError");
const ThreadAdd = require("../../Domains/threads/entities/ThreadAdd")

class ThreadAddUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository
    }

    async execute({title, body} = {}, userId) {
        this._validatePayload({title, body});
        const thread = new ThreadAdd({ title, body, owner: userId });
        return this._threadRepository.addThread(thread);
    }

    _validatePayload(payload) {
        const { title, body } = payload;
        if (!title || !body) {
            throw new InvariantError('THREAD_ADD_USECASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof title !== 'string' || typeof body !== 'string') {
            throw new InvariantError('THREAD_ADD_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ThreadAddUseCase