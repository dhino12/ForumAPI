const InvariantError = require("../../../Commons/exceptions/InvariantError");
const CommentsRepository = require("../../../Domains/comments/CommentsRepository");
const CommentRead = require("../../../Domains/comments/entities/CommentRead");
const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadDetailUseCase = require("../ThreadDetailUseCase");

describe('ThreadDetailUseCase', () => {
    it("should throw error when not using payload and using default value", async () => {
        // creating dependency of usecase
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentsRepository();
        
        /** creating use case instance */
        const getThreadUseCase = new ThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            commentsRepository: mockCommentRepository,
        });

        // action
        await expect(getThreadUseCase.execute()).rejects.toThrow("THREAD_DETAIL_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => getThreadUseCase._validatePayload()).toThrow("THREAD_DETAIL_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
    });
    it("should throw error when payload did not contain needed property", async () => {
        const useCasePayload = {
            id: 'thread-12345',
            title: "joko",
            body: 'joko sang raja jawa',
            username: 'dicoding',
        };

        // creating dependency of usecase
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentsRepository();
        
        /** creating use case instance */
        const getThreadUseCase = new ThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            commentsRepository: mockCommentRepository,
        });

        // Action & Assert
        await expect(getThreadUseCase.execute()).rejects.toThrowError(InvariantError);
        await expect(getThreadUseCase.execute()).rejects.toThrow("THREAD_DETAIL_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => getThreadUseCase._validatePayload()).toThrow("THREAD_DETAIL_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
    });
    
    it("should throw error when payload did not meet data type specification", async () => {
        const useCasePayload = {
            id: 12345,
            title: "joko",
            body: 'joko sang raja jawa',
            username: 'dicoding',
        };

        // creating dependency of usecase
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentsRepository();
        
        /** creating use case instance */
        const getThreadUseCase = new ThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            commentsRepository: mockCommentRepository,
        });

        // Action & Assert
        await expect(getThreadUseCase.execute(useCasePayload.id)).rejects.toThrowError(InvariantError);
        await expect(getThreadUseCase.execute(useCasePayload.id)).rejects.toThrow("THREAD_DETAIL_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
        await expect(getThreadUseCase.execute(12345)).rejects.toThrow("THREAD_DETAIL_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
        expect(() => getThreadUseCase._validatePayload(12345)).toThrow("THREAD_DETAIL_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
    });

    it("should do a check that the comment has been deleted", async () => {
        const useCasePayload = {
            id: 'thread-12345',
            title: "joko",
            body: 'joko sang raja jawa',
            username: 'dicoding',
        };
        // arrange
        const mockThreadDetail = new ThreadDetail({
            id: useCasePayload.id,
            title: useCasePayload.title,
            body: useCasePayload.body,
            created_at: '2021-08-08T07:19:09.775Z',
            username: useCasePayload.username,
        });
        const mockCommentRead = new CommentRead({
            id: 'comment-12345',
            content: 'hello world',
            created_at: '2021-08-08T07:19:29.775Z',
            username: useCasePayload.username,
            is_delete: true
        })
        
        // creating dependency of usecase
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentsRepository();

        /** mocking needed function */
        mockThreadRepository.detailThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockThreadDetail));
        mockCommentRepository.getCommentByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve([mockCommentRead]));

        /** creating use case instance */
        const getThreadUseCase = new ThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            commentsRepository: mockCommentRepository,
        });
        // action
        const threadDetail = await getThreadUseCase.execute(useCasePayload.id);
        // Assert
        expect(threadDetail).toStrictEqual(new ThreadDetail({
            id: 'thread-12345',
            title: useCasePayload.title,
            body: useCasePayload.body,
            created_at: '2021-08-08T07:19:09.775Z',
            username: useCasePayload.username,
            comments: [new CommentRead({
                id: 'comment-12345',
                content: '**komentar telah dihapus**',
                created_at: '2021-08-08T07:19:29.775Z',
                username: useCasePayload.username,
                is_delete: true
            })]
        }));
        expect(mockThreadRepository.detailThread).toBeCalledWith(useCasePayload.id);
        expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCasePayload.id);
        expect(threadDetail.id).toEqual("thread-12345")
        expect(threadDetail.title).toEqual("joko")
        expect(threadDetail.body).toEqual("joko sang raja jawa")
        expect(threadDetail.username).toEqual("dicoding")
        expect(threadDetail.date).toEqual('2021-08-08T07:19:09.775Z')

        expect(threadDetail.comments[0].content).toEqual("**komentar telah dihapus**")
        expect(threadDetail.comments[0].id).toEqual("comment-12345")
        expect(threadDetail.comments[0].date).toEqual("2021-08-08T07:19:29.775Z")
        expect(threadDetail.comments[0].username).toEqual("dicoding")
        expect(threadDetail.comments[0].is_delete).toEqual(true)
    })

    it("should orchestrating the read detail thread action correctly", async () => {
        const useCasePayload = {
            id: 'thread-12345',
            title: "joko",
            body: 'joko sang raja jawa',
            username: 'dicoding',
        };
        // arrange
        const mockThreadDetail = new ThreadDetail({
            id: useCasePayload.id,
            title: useCasePayload.title,
            body: useCasePayload.body,
            created_at: '2021-08-08T07:19:09.775Z',
            username: useCasePayload.username,
        });
        const mockCommentRead = new CommentRead({
            id: 'comment-12345',
            content: 'hello world',
            created_at: '2021-08-08T07:19:29.775Z',
            username: useCasePayload.username,
            is_delete: false
        })

        // creating dependency of usecase
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentsRepository();

        /** mocking needed function */
        mockThreadRepository.detailThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockThreadDetail));
        mockCommentRepository.getCommentByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve([mockCommentRead]));

        /** creating use case instance */
        const getThreadUseCase = new ThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            commentsRepository: mockCommentRepository,
        });

        // action
        const threadDetail = await getThreadUseCase.execute(useCasePayload.id);
        
        // Assert
        expect(threadDetail).toStrictEqual(new ThreadDetail({
            id: 'thread-12345',
            title: useCasePayload.title,
            body: useCasePayload.body,
            created_at: '2021-08-08T07:19:09.775Z',
            username: useCasePayload.username,
            comments: [new CommentRead({
                id: 'comment-12345',
                content: 'hello world',
                created_at: '2021-08-08T07:19:29.775Z',
                username: useCasePayload.username,
                is_delete: false
            })]
        }));
        expect(threadDetail.id).toEqual("thread-12345")
        expect(threadDetail.title).toEqual("joko")
        expect(threadDetail.body).toEqual("joko sang raja jawa")
        expect(threadDetail.username).toEqual("dicoding")
        expect(threadDetail.date).toEqual('2021-08-08T07:19:09.775Z')
        expect(threadDetail.comments[0].content).toEqual("hello world")
        expect(threadDetail.comments[0].id).toEqual("comment-12345")
        expect(threadDetail.comments[0].date).toEqual("2021-08-08T07:19:29.775Z")
        expect(threadDetail.comments[0].username).toEqual("dicoding")
        expect(threadDetail.comments[0].is_delete).toEqual(false)
        expect(mockThreadRepository.detailThread).toBeCalledWith(useCasePayload.id);
        expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCasePayload.id);
    })
})