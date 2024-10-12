const CommentAdded = require("../CommentAdded");

describe('a CommentAfterAdded entities', () => { 
    it("should throw error when not using payload", () => {
        // creating dependency of usecase
        expect(() => new CommentAdded()).toThrowError("COMMENT_ADDED.NOT_CONTAIN_NEEDED_PROPERTY");
    });
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            content: 'joko',
            thread_id: 'thread-12345',
            owner: 'user-123'
        };

        expect(() => new CommentAdded(payload)).toThrowError('COMMENT_ADDED.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 12345,
            content: 'joko',
            thread_id: 'thread-12345',
            owner: 'user-123'
        };

        expect(() => new CommentAdded(payload)).toThrowError('COMMENT_ADDED.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create commentAdded object correctly', () => {
        /**
        * Bukankah code ini untuk meng-cover _verifyPayload ?
         */
        const payload = {
            id: 'comment-12345',
            content: 'joko',
            thread_id: 'thread-12345',
            owner: 'user-123'
        };

        const comment = new CommentAdded(payload);

        // Assert
        expect(comment.id).toEqual(payload.id);
        expect(comment.threadId).toEqual(payload.thread_id);
        expect(comment.content).toEqual(payload.content);
        expect(comment.owner).toEqual(payload.owner);
    })
})