const ThreadDetail = require("../ThreadDetail")

describe('a ThreadDetail entities', () => { 
    it("should throw error when not using payload", () => {
        // creating dependency of usecase
        expect(() => new ThreadDetail()).toThrowError("THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    });
    it("should throw error when payload did not contain needed property", () => {
        const payload = {
            title: 'joko',
            body: 'joko sang raja jawa',
            created_at: '2021-08-08T07:19:09.775Z',
            username: 'dicoding'
        }

        expect(() => new ThreadDetail(payload)).toThrowError("THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY")
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 12345,
            title: 'joko',
            body: 'joko sang raja jawa',
            created_at: '2021-08-08T07:19:09.775Z',
            username: 'dicoding'
        };

        expect(() => new ThreadDetail(payload)).toThrowError("THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION");
    })

    it("should create threadDetail object correctly", () => {
        /**
        * Bukankah code ini untuk meng-cover _verifyPayload ?
         */
        const payload = {
            id: 'thread-12345',
            title: 'joko',
            body: 'joko sang raja jawa',
            created_at: '2021-08-08T07:19:09.775Z',
            username: 'dicoding',
            comments: []
        }

        const thread = new ThreadDetail(payload);

        // Assert
        expect(thread.id).toEqual(payload.id);
        expect(thread.title).toEqual(payload.title);
        expect(thread.body).toEqual(payload.body);
        expect(thread.date).toEqual(payload.created_at);
        expect(thread.username).toEqual(payload.username);
        expect(thread.comments).toEqual(payload.comments);
    })
})