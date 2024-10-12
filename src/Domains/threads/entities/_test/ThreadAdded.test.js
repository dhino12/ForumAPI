const ThreadAdded = require("../ThreadAdded");

describe('a ThreadAfterAdded entities', () => { 
    it("should throw error when not using payload", () => {
        // creating dependency of usecase
        expect(() => new ThreadAdded()).toThrowError("THREAD_ADDED.NOT_CONTAIN_NEEDED_PROPERTY");
    });
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'joko',
            body: 'joko sang raja jawa',
            owner: 'user-123'
        };

        expect(() => new ThreadAdded(payload)).toThrowError('THREAD_ADDED.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 12345,
            title: 'joko',
            body: 'joko sang raja jawa',
            owner: 'user-123'
        };

        expect(() => new ThreadAdded(payload)).toThrowError('THREAD_ADDED.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create threadResponse object correctly', () => {
        /**
        * Bukankah code ini untuk meng-cover _verifyPayload ?
         */
        const payload = {
            id: 'thread-12345',
            title: 'joko',
            body: 'joko sang raja jawa',
            owner: 'user-123'
        };

        const thread = new ThreadAdded(payload);

        // Assert
        expect(thread.id).toEqual(payload.id);
        expect(thread.title).toEqual(payload.title);
        expect(thread.body).toEqual(payload.body);
        expect(thread.owner).toEqual(payload.owner);
    })
})