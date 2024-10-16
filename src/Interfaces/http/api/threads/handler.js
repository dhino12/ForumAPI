const ThreadAddUseCase = require("../../../../Applications/use_case/ThreadAddUseCase");
const ThreadDetailUseCase = require("../../../../Applications/use_case/ThreadDetailUseCase");

class ThreadHandler {
    constructor(container) {
        this._container = container;
        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const addThreadUseCase = this._container.getInstance(ThreadAddUseCase.name);
        const addedThread = await addThreadUseCase.execute(request?.payload, credentialId);
        
        const response = h.response({
            status: 'success',
            message: 'New Thread have been added',
            data: {
                addedThread,
            }
        });
        response.code(201);
        return response
    }

    async getThreadDetailHandler(request, h) {
        const { threadId } = request.params;
        const threadDetailUseCase = this._container.getInstance(ThreadDetailUseCase.name);
        const threadDetail = await threadDetailUseCase.execute(threadId);

        const response = h.response({
            status: 'success',
            message: 'Threads Detail',
            data: {
                thread: {...threadDetail},
            }
        });

        response.code(200);
        return response
    }
}

module.exports = ThreadHandler;