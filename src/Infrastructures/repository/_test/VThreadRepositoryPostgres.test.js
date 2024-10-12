const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const ThreadAdd = require("../../../Domains/threads/entities/ThreadAdd");
const ThreadAdded = require("../../../Domains/threads/entities/ThreadAdded");
const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe('ThreadRepositoryPostgres', () => {
    beforeEach(async() => {
        await UsersTableTestHelper.addUser({ id: 'user-123',  });
    })
    afterEach(async () => {
        await ThreadTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });
    afterAll(async() => {
        await pool.end();
    });

    describe('verifyAvailableTitle function', () => { 
        it("should throw NotFoundError when title not available", async() => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyAvailabelThread("threads-54321")).rejects.toThrowError(NotFoundError);
        })
        it("should not throw NotFoundError when title available", async () => {
            // Arrange
            await ThreadTableTestHelper.addThread({ title: 'joko', userId: "user-123" });
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            const threadDetail = await threadRepositoryPostgres.detailThread("thread-12345");
            // Action & Assert
            await expect(threadRepositoryPostgres.verifyAvailabelThread("thread-12345")).resolves.not.toThrowError(NotFoundError);
            expect(threadDetail.id).toEqual("thread-12345")
            expect(threadDetail.title).toEqual("joko")
            expect(threadDetail.body).toEqual("joko sang raja jawa")
            expect(threadDetail.username).toEqual("dicoding")
        })
    });

    describe('addThread function', () => {
        it("should persist threads", async () => {
            // Arrange
            const addThread = new ThreadAdd({
                title: 'joko',
                body: 'joko sang raja jawa',
                owner: 'user-123'
            });
            const fakeIdGenerator = () => "12345";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepositoryPostgres.addThread(addThread, "user-123");
            // Assert
            const thread = await ThreadTableTestHelper.findThreadById("thread-12345");
            expect(thread).toHaveLength(1);
            expect(thread[0].id).toEqual("thread-12345");
            expect(thread[0].owner).toEqual("user-123");
            expect(thread[0].title).toEqual("joko");
            expect(thread[0].body).toEqual("joko sang raja jawa");
        })
        it("should return thread correctly", async () => {
            const thread = new ThreadAdd({
                title: 'joko',
                body: 'joko sang raja jawa',
                owner: 'user-123'
            });
            const fakeIdGenerator = () => "12345";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const threadResultDb = await threadRepositoryPostgres.addThread(thread, "user-123");
            const threadResultAfterAdded = await threadRepositoryPostgres.verifyAvailabelThread("thread-12345");

            // Assert
            expect(threadResultDb).toStrictEqual(new ThreadAdded({
                id: "thread-12345",
                title: "joko",
                body: "joko sang raja jawa",
                owner: "user-123"
            }))
            expect(threadResultAfterAdded.id).toEqual('thread-12345')
            expect(threadResultAfterAdded.title).toEqual('joko')
            expect(threadResultAfterAdded.body).toEqual('joko sang raja jawa')
            expect(threadResultAfterAdded.username).toEqual('dicoding')
        })
    })
    describe('detailThread function', () => {
        it("should throw NotFoundError when thread not found", async () => {
            await ThreadTableTestHelper.addThread({ title: 'joko', userId: "user-123" });
            const fakeIdGenerator = () => "12345";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // action
            await expect(threadRepositoryPostgres.detailThread("thread-123456")).rejects.toThrowError(NotFoundError);
        })
        
        it("should return thread correctly", async () => {
            await ThreadTableTestHelper.addThread({ title: 'joko', userId: "user-123" });

            const thread = new ThreadDetail({
                id: 'thread-12345',
                title: "joko",
                body: 'joko sang raja jawa',
                username: 'dicoding',
                created_at: '2021-08-08T07:19:09.775Z',
            });

            const fakeIdGenerator = () => "12345";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // action
            const threadDetailDB = await threadRepositoryPostgres.detailThread(thread.id);

            // Assert
            expect(threadDetailDB).toStrictEqual(new ThreadDetail({
                id: 'thread-12345',
                title: "joko",
                body: 'joko sang raja jawa',
                username: 'dicoding',
                created_at: threadDetailDB.date,
            }));
            expect(threadDetailDB.id).toEqual("thread-12345")
            expect(threadDetailDB.title).toEqual("joko")
            expect(threadDetailDB.body).toEqual("joko sang raja jawa")
            expect(threadDetailDB.username).toEqual("dicoding")
        })
    })
})