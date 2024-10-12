const pool = require("../../database/postgres/pool");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentAdd = require("../../../Domains/comments/entities/CommentAdd");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const CommentTableTestHelper = require("../../../../tests/CommentTableTesHelper");
const CommentRead = require("../../../Domains/comments/entities/CommentRead");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe('CommentRepositoryPostgres', () => { 
    beforeEach(async() => {
        await UsersTableTestHelper.addUser({ id: 'user-123',  });
        await ThreadTableTestHelper.addThread({
            title: 'joko',
            body: 'joko sang raja jawa',
            owner: 'user-123'
        });
    })
    afterEach(async () => {
        await ThreadTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });
    afterAll(async() => {
        await pool.end();
    });

    describe('addComment function', () => {
        it("should persist comment", async () => {
            const commentPayload = {
                id: 'comment-12345',
                thread_id: 'thread-12345',
                owner: 'user-123',
                content: 'hello world'
            }
            // Arrange
            const addComment = new CommentAdd({
                thread_id: commentPayload.thread_id,
                owner: commentPayload.owner,
                content: commentPayload.content
            })
            const fakeIdGenerator = () => "12345";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const commentResultAdded = await commentRepositoryPostgres.addComment(addComment);

            // Assert
            const comment = await CommentTableTestHelper.findCommentById(commentPayload.id);
            expect(comment).toHaveLength(1);
            expect(commentResultAdded.id).toEqual(commentPayload.id)
            expect(commentResultAdded.content).toEqual(commentPayload.content)
            expect(commentResultAdded.owner).toEqual(commentPayload.owner)
            expect(commentResultAdded.threadId).toEqual(commentPayload.thread_id)
        })
    });

    describe('getCommentById function', () => { 
        it("should persist comment", async() => {
            const commentPayload = {
                id: 'comment-12345',
                thread_id: 'thread-12345',
                owner: 'user-123',
                content: 'hello world',
                username: 'dicoding',
                created_at: '2021-08-08T07:19:09.775Z',
                is_delete: false,
            };
            // Arrange 
            const addComment = new CommentAdd({
                thread_id: commentPayload.thread_id,
                owner: commentPayload.owner,
                content: commentPayload.content
            });
            const fakeIdGenerator = () => "12345";
            const commentPg = new CommentRepositoryPostgres(pool, fakeIdGenerator);
    
            // Action
            await commentPg.addComment(addComment);
            const resultVerify = await commentPg.getCommentById(commentPayload.id);
            resultVerify.date = commentPayload.created_at
            
            expect(resultVerify.content).toEqual(commentPayload.content);
            expect(resultVerify.id).toEqual(commentPayload.id);
            expect(resultVerify.content).toEqual(commentPayload.content);
            expect(resultVerify.date).toEqual(commentPayload.created_at);
            expect(resultVerify.username).toEqual(commentPayload.username);
            expect(resultVerify.is_delete).toEqual(commentPayload.is_delete);
        })
    })

    describe('getCommentByThreadId function', () => { 
        it ("should persist comment", async () => {
            const commentResponse = {
                id: 'comment-12345',
                thread_id: 'thread-12345',
                owner: 'user-123',
                content: 'hello world',
                username: 'dicoding',
                created_at: '2021-08-08T07:19:09.775Z',
                is_delete: false,
            };

            // Arrange 
            const addComment = new CommentAdd({
                thread_id: commentResponse.thread_id,
                owner: commentResponse.owner,
                content: commentResponse.content
            })
            const fakeIdGenerator = () => "12345";
            const commentPg = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await commentPg.addComment(addComment);
            const commentResultGet = await commentPg.getCommentByThreadId(commentResponse.thread_id);

            // Assert
            expect(commentResultGet).toHaveLength(1);
            expect(commentResultGet[0].id).toEqual(commentResponse.id);
            expect(commentResultGet[0].created_at).toBeDefined();
            expect(commentResultGet[0].content).toEqual(commentResponse.content);
            expect(commentResultGet[0].is_delete).toEqual(commentResponse.is_delete);
            expect(commentResultGet[0].username).toEqual(commentResponse.username);
        })
    })

    describe('deleteCommentById function', () => {
        it ("should persist deleted comment", async () => {
            const commentPayload = {
                id: 'comment-12345',
                thread_id: 'thread-12345',
                owner: 'user-123',
                content: 'hello world',
                username: 'dicoding',
                created_at: '2021-08-08T07:19:09.775Z',
            }
            // Arrange 
            const addComment = new CommentAdd({
                thread_id: commentPayload.thread_id,
                owner: commentPayload.owner,
                content: commentPayload.content
            })
            const fakeIdGenerator = () => "12345";
            const commentPg = new CommentRepositoryPostgres(pool, fakeIdGenerator);
    
            // Action
            await commentPg.addComment(addComment);
            const result = await commentPg.deleteCommentById(commentPayload.id);
            const afterDeleted = await commentPg.verifyCommentById(commentPayload.id, commentPayload.owner, commentPayload.thread_id)
            result.date = commentPayload.created_at
    
            // Assert
            expect(result.id).toBeDefined();
            expect(result).toStrictEqual(new CommentRead({
                id: commentPayload.id,
                content: commentPayload.content,
                username: commentPayload.owner,
                created_at: commentPayload.created_at,
                is_delete: true,
            }));
            expect(result.is_delete).toEqual(true);
            expect(result.id).toEqual(commentPayload.id);
            expect(result.date).toBeDefined();
            expect(result.username).toEqual(commentPayload.owner);
            expect(result.content).toEqual(commentPayload.content);
            
            expect(afterDeleted.is_delete).toEqual(true);
        })
    })
    describe('verifyCommentById function', () => {
        it("should verify that the comment does not belong to the user", async () => {
            const commentPayload = {
                id: 'comment-12345',
                thread_id: 'thread-12345',
                owner: 'user-123',
                content: 'hello world',
                username: 'dicoding',
                created_at: '2021-08-08T07:19:09.775Z',
                is_delete: false,
            };
            // Arrange 
            const addComment = new CommentAdd({
                thread_id: commentPayload.thread_id,
                owner: commentPayload.owner,
                content: commentPayload.content
            })
            const fakeIdGenerator = () => "12345";
            const commentPg = new CommentRepositoryPostgres(pool, fakeIdGenerator);
    
            // Action
            await commentPg.addComment(addComment);
            
            // Assert
            await expect(commentPg.verifyCommentById(commentPayload.id, 'joko-123', commentPayload.thread_id)).rejects.toThrowError(AuthorizationError)
        })
        it("should verify the comment does not exist (NotFound Error)", async () => {
            const commentPayload = {
                id: 'comment-12345',
                thread_id: 'thread-12345',
                owner: 'user-123',
                content: 'hello world',
                username: 'dicoding',
                created_at: '2021-08-08T07:19:09.775Z',
                is_delete: false,
            };
            // Arrange 
            const addComment = new CommentAdd({
                thread_id: commentPayload.thread_id,
                owner: commentPayload.owner,
                content: commentPayload.content
            })
            const fakeIdGenerator = () => "12345";
            const commentPg = new CommentRepositoryPostgres(pool, fakeIdGenerator);
    
            // Action
            await commentPg.addComment(addComment);
            
            // Assert
            await expect(commentPg.verifyCommentById("comment-101010", commentPayload.owner, commentPayload.thread_id)).rejects.toThrowError(NotFoundError)
        })
        it("should verify that the comment is indeed the user", async () => {
            const commentPayload = {
                id: 'comment-12345',
                thread_id: 'thread-12345',
                owner: 'user-123',
                content: 'hello world',
                username: 'dicoding',
                created_at: '2021-08-08T07:19:09.775Z',
                is_delete: false,
            };
            // Arrange 
            const addComment = new CommentAdd({
                thread_id: commentPayload.thread_id,
                owner: commentPayload.owner,
                content: commentPayload.content
            });
            const fakeIdGenerator = () => "12345";
            const commentPg = new CommentRepositoryPostgres(pool, fakeIdGenerator);
    
            // Action
            await commentPg.addComment(addComment);
            const resultVerify = await commentPg.verifyCommentById(commentPayload.id, commentPayload.owner, commentPayload.thread_id);
            resultVerify.date = commentPayload.created_at
            
            // Assert
            expect(resultVerify.id).toEqual(commentPayload.id);
            expect(resultVerify.date).toBeDefined();
            expect(resultVerify).toStrictEqual(new CommentRead({
                id: commentPayload.id,
                content: commentPayload.content,
                username: commentPayload.username,
                created_at: commentPayload.created_at,
                is_delete: false,
            }));
            expect(resultVerify.username).toEqual(commentPayload.username);
            expect(resultVerify.content).toEqual(commentPayload.content);
        })
    })
})