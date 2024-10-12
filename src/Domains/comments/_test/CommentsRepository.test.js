const CommentsRepository = require("../CommentsRepository");

describe('CommentsRepository interface', () => { 
    it('should throw error when invoke abstract behavior', async () => {
        const commentsRepository = new CommentsRepository();

        await expect(commentsRepository.addComment({})).rejects.toThrowError("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
        await expect(commentsRepository.detailComment({})).rejects.toThrowError("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
        await expect(commentsRepository.getCommentByThreadId({})).rejects.toThrowError("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
        await expect(commentsRepository.deleteCommentById({})).rejects.toThrowError("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
        await expect(commentsRepository.verifyCommentById({})).rejects.toThrowError("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    })
})