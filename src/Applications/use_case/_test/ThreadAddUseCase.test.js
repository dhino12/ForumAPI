const InvariantError = require('../../../Commons/exceptions/InvariantError');
const ThreadAdd = require('../../../Domains/threads/entities/ThreadAdd');
const ThreadAdded = require('../../../Domains/threads/entities/ThreadAdded');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadAddUseCase = require('../ThreadAddUseCase');

describe('ThreadAddUseCase', () => {
    it("should throw error when not using payload and use default value", async () => {
        // creating dependency of usecase
        const mockThreadRepository = new ThreadRepository(); 

        /** creating use case instance */
        const getThreadUseCase = new ThreadAddUseCase({
            threadRepository: mockThreadRepository,
        });

        // action
        await expect(getThreadUseCase.execute()).rejects.toThrow("THREAD_ADD_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        await expect(getThreadUseCase.execute({})).rejects.toThrow("THREAD_ADD_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => getThreadUseCase._validatePayload({})).toThrow("THREAD_ADD_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => getThreadUseCase._validatePayload({title: 'joko'})).toThrow("THREAD_ADD_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => getThreadUseCase._validatePayload({body: 'joko'})).toThrow("THREAD_ADD_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
    });
    it("should throw error when payload did not contain needed property", async () => {
        // arrange
        const useCasePayload = {
            body: 'joko sang raja jawa',
            owner: 'user-123',
            username: 'dicoding',
            created_at: '2021-08-08T07:19:09.775Z',
        };
        // creating dependency of usecase
        const mockThreadRepository = new ThreadRepository();
        /** creating use case instance */
        const getThreadUseCase = new ThreadAddUseCase({
            threadRepository: mockThreadRepository
        });

        // Action & Assert
        await expect(getThreadUseCase.execute(useCasePayload, useCasePayload.owner)).rejects.toThrowError(InvariantError);
        await expect(getThreadUseCase.execute(useCasePayload, useCasePayload.owner)).rejects.toThrow("THREAD_ADD_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => getThreadUseCase._validatePayload({})).toThrow("THREAD_ADD_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => getThreadUseCase._validatePayload({title: 'joko'})).toThrow("THREAD_ADD_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
        expect(() => getThreadUseCase._validatePayload({body: 'joko'})).toThrow("THREAD_ADD_USECASE.NOT_CONTAIN_NEEDED_PROPERTY");
    });

    it("should throw error when payload did not meet data type specification", async () => {
        // arrange
        const useCasePayload = {
            id: 123456,
            title: 123456,
            body: 'joko sang raja jawa',
            owner: 'user-123',
            username: 'dicoding',
            created_at: '2021-08-08T07:19:09.775Z',
        };

        // creating dependency of usecase
        const mockThreadRepository = new ThreadRepository();
        /** creating use case instance */
        const getThreadUseCase = new ThreadAddUseCase({
            threadRepository: mockThreadRepository
        });

        // Action & Assert
        await expect(getThreadUseCase.execute(useCasePayload, useCasePayload.owner)).rejects.toThrowError(InvariantError);
        expect(() => getThreadUseCase._validatePayload(useCasePayload, useCasePayload.owner)).toThrowError("THREAD_ADD_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
        expect(() => getThreadUseCase._validatePayload({title: 12345, body: useCasePayload.body})).toThrowError("THREAD_ADD_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
        expect(() => getThreadUseCase._validatePayload({title: useCasePayload.title, body: 12345})).toThrowError("THREAD_ADD_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
    })

    it("should orchestrating the add thread action correctly", async () => {
        // arrange
        const useCasePayload = {
            id: 'thread-12345',
            title: "joko",
            body: 'joko sang raja jawa',
            owner: 'user-123',
            username: 'dicoding',
            created_at: '2021-08-08T07:19:09.775Z',
        };
        const mockThreadAdded = new ThreadAdded({
            id: 'thread-12345',
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: useCasePayload.owner,
        });
        
        // creating dependency of usecase
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockThreadAdded))
        
        /** creating use case instance */
        const getThreadUseCase = new ThreadAddUseCase({
            threadRepository: mockThreadRepository
        });

        // action
        const threadadded = await getThreadUseCase.execute(useCasePayload, useCasePayload.owner);

        // Assert
        expect(threadadded).toStrictEqual(new ThreadAdded({
            id: 'thread-12345',
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: useCasePayload.owner
        }));
        expect(mockThreadRepository.addThread).toBeCalledWith(new ThreadAdd({
            owner: useCasePayload.owner,
            title: useCasePayload.title,
            body: useCasePayload.body,
        }));
    })
})