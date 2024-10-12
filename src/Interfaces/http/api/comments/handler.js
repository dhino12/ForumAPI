const CommentUseCase = require("../../../../Applications/use_case/CommentUseCase");
const CommentDeleteUseCase = require("../../../../Applications/use_case/CommentDeleteUseCase");

class CommentHandler {
    constructor(container) {
        this._container = container;
        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const { threadId } = request.params; 

        const addCommentUseCase = this._container.getInstance(CommentUseCase.name);
        // const threadById = this._container.getInstance(ThreadDetailUseCase.name);
        // await threadById.execute(threadId); // verify
        const addedComment = await addCommentUseCase.executeAdd(request?.payload, { threadId, userId: credentialId })

        const response = h.response({
            status: 'success',
            message: 'Comments have been added',
            data: {
                addedComment
            }
        })
        response.code(201);
        return response;
    }

    async deleteCommentByIdHandler(request, h) {
        const { threadId, commentId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        const commentUseCase = this._container.getInstance(CommentDeleteUseCase.name);
        const deletedComment = await commentUseCase.execute({commentId, userId: credentialId, threadId});

        const response = h.response({
            status: "success",
            message: "Comment has been deleted",
            data: {
                deletedComment
            }
        })
        return response
    }
}

module.exports = CommentHandler;