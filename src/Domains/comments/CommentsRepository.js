class CommentsRepository {
    async addComment(comment) {
        throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }

    async detailComment(comment) {
        throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }

    async getCommentByThreadId(threadId) {
        throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }

    async deleteCommentById(commentId) {
        throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }
    
    async verifyCommentById(commentId, userId, threadId) {
        throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    }
}

module.exports = CommentsRepository;