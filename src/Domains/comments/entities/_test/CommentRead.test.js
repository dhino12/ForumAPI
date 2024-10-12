const CommentRead = require("../CommentRead");

describe('a CommentReadAllByThreadId entities', () => {
    it("should throw error when not using payload", () => {
        // creating dependency of usecase
        expect(() => new CommentRead()).toThrowError("COMMENTS_READ.NOT_CONTAIN_NEEDED_PROPERTY");
    });
    it('should throw error when response did not contain needed property', () => {
        const response = {
            content: 'hello world',
            username: 'dicoding',
            is_delete: false
        };

        expect(() => new CommentRead(response)).toThrowError('COMMENTS_READ.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when response did not meet data type specification', () => {
        const response = {
            id: 12345,
            content: 'hello world',
            created_at: '2024-10-01 08:44:53.748345-07',
            username: 'dicoding',
            is_delete: false
        };

        expect(() => new CommentRead(response)).toThrowError('COMMENTS_READ.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should read CommentReadByThreadId object correctly', () => {
        /**
        * Bukankah code ini untuk meng-cover _verifyPayload ?
         */
        const payload = {
            id: 'comment-12345',
            content: 'hello world',
            created_at: '2024-10-01 08:44:53.748345-07',
            username: 'dicoding',
            is_delete: false
        };

        const comment = new CommentRead(payload);

        // Assert
        expect(comment.id).toEqual(payload.id);
        expect(comment.date).toEqual(payload.created_at);
        expect(comment.content).toEqual(payload.content);
        expect(comment.username).toEqual(payload.username);
        expect(comment.is_delete).toEqual(payload.is_delete);
    })
})