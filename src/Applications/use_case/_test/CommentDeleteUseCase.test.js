const InvariantError = require("../../../Commons/exceptions/InvariantError");
const CommentsRepository = require("../../../Domains/comments/CommentsRepository");
// const CommentAdded = require("../../../Domains/comments/entities/CommentAdded");
const CommentRead = require("../../../Domains/comments/entities/CommentRead");
const CommentDeleteUseCase = require("../CommentDeleteUseCase");

describe('CommentDeleteUseCase', () => { 
    it("should throw error when not using payload and use default value", async () => {
        /** creating use case instance */
        const deleteCommentUseCase = new CommentDeleteUseCase({});

        // action
        await expect(deleteCommentUseCase.execute()).rejects.toThrow("COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => deleteCommentUseCase._validatePayload()).toThrowError("COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => deleteCommentUseCase._validatePayload({})).toThrowError("COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => deleteCommentUseCase._validatePayload({commentId: 'comment-12345'})).toThrowError("COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => deleteCommentUseCase._validatePayload({threadId: 'thread-12345'})).toThrowError("COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => deleteCommentUseCase._validatePayload({userId: 'user-123'})).toThrowError("COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY");
    });
    it("should throw error when payload did not contain needed property", async () => {
        // arrange
        const useCasePayload = {
            id: 'comment-12345',
            owner: 'user-123',
            threadId: 'thread-12345',
            created_at: '2021-08-08T07:19:09.775Z',
            username: 'dicoding',
            content: 'hello world',
        }
        // creating dependency of usecase
        const mockCommentRepository = new CommentsRepository();
        /** creating use case instance */
        const deleteCommentUseCase = new CommentDeleteUseCase({ })

        // action
        await expect(deleteCommentUseCase.execute(useCasePayload.id, useCasePayload.threadId)).rejects.toThrow("COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => deleteCommentUseCase._validatePayload(useCasePayload.id, useCasePayload.threadId)).toThrowError("COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => deleteCommentUseCase._validatePayload({})).toThrowError("COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => deleteCommentUseCase._validatePayload({commentId: 'comment-12345'})).toThrowError("COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => deleteCommentUseCase._validatePayload({threadId: 'thread-12345'})).toThrowError("COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => deleteCommentUseCase._validatePayload({userId: 'user-123'})).toThrowError("COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY");
    });
    it("should throw error when payload did not meet data type specification", async () => {
        // arrange
        const useCasePayload = {
            id: 12345,
            owner: 1234,
            threadId: 1234,
        }
        // creating dependency of usecase
        const mockCommentRepository = new CommentsRepository();
        /** creating use case instance */
        const deleteCommentUseCase = new CommentDeleteUseCase({})

        // action
        await expect(deleteCommentUseCase.execute({
            commentId: useCasePayload.id, 
            userId: useCasePayload.owner, 
            threadId: useCasePayload.threadId
        })).rejects.toThrowError(InvariantError);
        await expect(deleteCommentUseCase.execute({
            commentId: useCasePayload.id, 
            userId: useCasePayload.owner, 
            threadId: useCasePayload.threadId
        })).rejects.toThrow("COMMENT_DELETE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
        await expect(deleteCommentUseCase.execute({
            commentId: useCasePayload.id, 
            userId: `${useCasePayload.owner}`, 
            threadId: `${useCasePayload.threadId}`
        })).rejects.toThrow("COMMENT_DELETE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
        await expect(deleteCommentUseCase.execute({
            commentId: `${useCasePayload.id}`,
            userId: `${useCasePayload.owner}`, 
            threadId: useCasePayload.threadId
        })).rejects.toThrow("COMMENT_DELETE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
        await expect(deleteCommentUseCase.execute({
            commentId: `${useCasePayload.id}`,
            userId: useCasePayload.owner, 
            threadId: `${useCasePayload.threadId}`
        })).rejects.toThrow("COMMENT_DELETE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");

        expect(() => deleteCommentUseCase._validatePayload({
            commentId: useCasePayload.id, 
            userId: useCasePayload.owner, 
            threadId: useCasePayload.threadId
        })).toThrowError("COMMENT_DELETE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
    });
    it("should orchestrating the delete comment action correctly", async () => {
        // arrange
        const useCasePayload = {
            id: 'comment-12345',
            owner: 'user-123',
            threadId: 'thread-12345',
            created_at: '2021-08-08T07:19:09.775Z',
            username: 'dicoding',
            content: 'hello world',
        }
        const mockCommentRead = new CommentRead({
            id: 'comment-12345',
            content: useCasePayload.content,
            username: useCasePayload.username,
            created_at: useCasePayload.created_at
        });

        // creating dependency of usecase
        const mockCommentRepository = new CommentsRepository();

        /** mocking needed function */
        mockCommentRepository.verifyCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockCommentRead))
        mockCommentRepository.deleteCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockCommentRead))

        /** creating use case instance */
        const deleteCommentUseCase = new CommentDeleteUseCase({
            commentsRepository: mockCommentRepository
        })
        // action
        const commentDeleted = await deleteCommentUseCase.execute({
            commentId: useCasePayload.id, 
            userId: useCasePayload.owner, 
            threadId: useCasePayload.threadId
        });

        // Assert
        expect(commentDeleted).toStrictEqual(new CommentRead({
            id: useCasePayload.id,
            content: useCasePayload.content,
            username: useCasePayload.username,
            created_at: useCasePayload.created_at
        }));
        expect(mockCommentRepository.verifyCommentById).toBeCalledWith(useCasePayload.id, useCasePayload.owner, useCasePayload.threadId);
        expect(mockCommentRepository.deleteCommentById).toBeCalledWith(useCasePayload.id);
    })
})