const CommentAdd = require("../CommentAdd");

describe('a CommentAdd Entities', () => { 
    it("should throw error when not using payload", () => {
        // creating dependency of usecase
        expect(() => new CommentAdd()).toThrowError("COMMENT_ADD.NOT_CONTAIN_NEEDED_PROPERTY");
    });
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'hello world',
        }
        expect(() => new CommentAdd(payload)).toThrowError('COMMENT_ADD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            content: 'hello world',
            thread_id: 1111,
            owner: 'user-123'
        }
        // Action and Assert
        expect(() => new CommentAdd(payload)).toThrowError('COMMENT_ADD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it("should create comment object correctly", () => {
        const payload = {
            thread_id: "thread-12345",
            owner: "user-123",
            content: "hello world"
        }

        // Action
        const commentAdd = new CommentAdd(payload);

        // Assert
        expect(commentAdd.id).toEqual(payload.id);
        expect(commentAdd.owner).toEqual(payload.owner);
        expect(commentAdd.content).toEqual(payload.content);
        expect(commentAdd.threadId).toEqual(payload.thread_id);
    })
})