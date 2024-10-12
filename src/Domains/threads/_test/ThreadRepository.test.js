const ThreadRepository = require("../ThreadRepository");

describe('ThreadRepository interface', () => { 
    it('should throw error when invoke abstract behavior', async () => {
        const threadRepository = new ThreadRepository();

        await expect(threadRepository.addThread({})).rejects.toThrowError("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
        await expect(threadRepository.detailThread({})).rejects.toThrowError("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
        await expect(threadRepository.verifyAvailabelThread({})).rejects.toThrowError("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    })
})