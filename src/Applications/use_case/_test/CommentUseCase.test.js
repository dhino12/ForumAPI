const InvariantError = require("../../../Commons/exceptions/InvariantError");
const CommentsRepository = require("../../../Domains/comments/CommentsRepository");
const CommentAdd = require("../../../Domains/comments/entities/CommentAdd");
const CommentAdded = require("../../../Domains/comments/entities/CommentAdded");
const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentUseCase = require("../CommentUseCase");

describe('CommentUseCase', () => { 
    it("should throw error when not using payload and use default value", async () => {
        // creating dependency of usecase
        const mockCommentRepository = new CommentsRepository();
        const mockThreadRepository = new ThreadRepository();

        /** creating use case instance */
        const getCommentUseCase = new CommentUseCase({
            commentsRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // action
        await expect(getCommentUseCase.executeAdd()).rejects.toThrowError(InvariantError);
        await expect(getCommentUseCase.executeAdd()).rejects.toThrow("COMMENT_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        await expect(() => getCommentUseCase._validatePayload({}, {})).toThrow("COMMENT_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        await expect(() => getCommentUseCase._validatePayload({content: 'comment-12345'}, {})).toThrow("COMMENT_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        await expect(() => getCommentUseCase._validatePayload({}, {threadId: 'thread-12345', userId: 'user-123'})).toThrow("COMMENT_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        await expect(() => getCommentUseCase._validatePayload({content: 'hello world'}, {userId: "user-123"})).toThrow("COMMENT_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        await expect(() => getCommentUseCase._validatePayload({content: 'hello world'}, {threadId: "user-123"})).toThrow("COMMENT_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
    })
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
        const mockThreadRepository = new ThreadRepository();

        /** creating use case instance */
        const getCommentUseCase = new CommentUseCase({
            commentsRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // action
        await expect(getCommentUseCase.executeAdd()).rejects.toThrowError(InvariantError);
        await expect(getCommentUseCase.executeAdd()).rejects.toThrow("COMMENT_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => getCommentUseCase._validatePayload({content: useCasePayload.content}, {threadId: useCasePayload.threadId })).toThrow("COMMENT_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => getCommentUseCase._validatePayload({content: useCasePayload.content}, {userId: useCasePayload.threadId })).toThrow("COMMENT_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => getCommentUseCase._validatePayload({content: useCasePayload.content}, {})).toThrow("COMMENT_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
    });
    it("should throw error when payload did not meet data type specification", async () => {
        // arrange
        const useCasePayload = {
            id: 'comment-12345',
            owner: 'user-123',
            threadId: 12345,
            created_at: '2021-08-08T07:19:09.775Z',
            username: 'dicoding',
            content: 'hello world',
        }
        // creating dependency of usecase
        const mockCommentRepository = new CommentsRepository();
        const mockThreadRepository = new ThreadRepository();

        /** creating use case instance */
        const getCommentUseCase = new CommentUseCase({
            commentsRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // action
        await expect(getCommentUseCase.executeAdd({content: useCasePayload.content}, {threadId: useCasePayload.threadId, userId: useCasePayload.owner})).rejects.toThrowError(InvariantError);
        await expect(getCommentUseCase.executeAdd({content: useCasePayload.content}, {threadId: useCasePayload.threadId, userId: useCasePayload.owner})).rejects.toThrow("COMMENT_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
        expect(() => getCommentUseCase._validatePayload({content: 12345}, {threadId: `thread-${useCasePayload.threadId}`, userId: useCasePayload.owner})).toThrow("COMMENT_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
        expect(() => getCommentUseCase._validatePayload({content: 'hello world'}, {threadId: 12345, userId: useCasePayload.owner})).toThrow("COMMENT_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
        expect(() => getCommentUseCase._validatePayload({content: 'hello world'}, {threadId: `thread-${useCasePayload.threadId}`, userId: 12345})).toThrow("COMMENT_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
    });
    it("should orchestrating the add comment action correctly", async () => {
        // arrange
        const useCasePayload = {
            title: "joko",
            thread_id: 'thread-12345',
            body: 'joko sang raja jawa',
            owner: 'user-123',
            content: 'hello world',
            username: 'dicoding',
            created_at: '2021-08-08T07:19:09.775Z',
        }
        const mockCommentAdded = new CommentAdded({
            id: 'comment-12345',
            thread_id: useCasePayload.thread_id,
            owner: useCasePayload.owner,
            content: useCasePayload.content,
        });
        const mockThreadDetail = new ThreadDetail({
            id: 'thread-12345',
            title: "joko",
            body: 'joko sang raja jawa',
            created_at: '2021-08-08T07:19:09.775Z',
            username: 'dicoding',
        });

        // creating dependency of usecase
        const mockCommentRepository = new CommentsRepository();
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(mockCommentAdded))
        mockThreadRepository.verifyAvailabelThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockThreadDetail))

        /** creating use case instance */
        const getCommentUseCase = new CommentUseCase({
            commentsRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        })

        // action
        const commentAdded = await getCommentUseCase.executeAdd(useCasePayload, {
            threadId: useCasePayload.thread_id, 
            userId: useCasePayload.owner 
        });

        // Assert
        expect(mockThreadRepository.verifyAvailabelThread).toBeCalledWith(useCasePayload.thread_id)
        expect(mockCommentRepository.addComment).toBeCalledWith(new CommentAdd({
            owner: useCasePayload.owner,
            thread_id: useCasePayload.thread_id,
            content: useCasePayload.content,
        }));
        expect(commentAdded).toStrictEqual(new CommentAdded({
            id: 'comment-12345',
            thread_id: useCasePayload.thread_id,
            owner: useCasePayload.owner,
            content: useCasePayload.content,
        }));
    })
})