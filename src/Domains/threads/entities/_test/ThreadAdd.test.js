const ThreadAdd = require("../ThreadAdd");

describe('a ThreadAdd Entities', () => { 
    it("should throw error when not using payload", () => {
        // creating dependency of usecase
        expect(() => new ThreadAdd()).toThrowError("THREAD_ADD.NOT_CONTAIN_NEEDED_PROPERTY");
    });
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'joko',
        }
        expect(() => new ThreadAdd(payload)).toThrowError('THREAD_ADD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            title: 'joko',
            body: {},
            owner: 'user-123'
        }
        // Action and Assert
        expect(() => new ThreadAdd(payload)).toThrowError('THREAD_ADD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    })

    it("should create threadRequest object correctly", () => {
        const payload = {
            title: 'joko',
            body: "hello world",
            owner: "user-123"
        };
        
        const thread = new ThreadAdd(payload);

        // Assert
        expect(thread.title).toEqual(payload.title);
        expect(thread.body).toEqual(payload.body);
        expect(thread.owner).toEqual(payload.owner);
    })
})