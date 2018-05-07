const mockedLogger = require('../../util/loggerMock');
const messageMock = require('../../util/messageMock');

const errorMsg = 'Error Message';

jest.mock('../../../handler/util/winstonLogHandler', () => {
    return {
        getLogger: function() {
            return mockedLogger;
        },
    };
});

messageMock.channel.send
    .mockImplementationOnce(() => {
        return new Promise(function(resolve) {
            resolve('succesfull');
        });
    })
    .mockImplementationOnce(() => {
        return new Promise(function(resolve, reject) {
            reject(errorMsg);
        });
    });

const eightBall = require('../../../commands/fun/8ball');

// TODO check if necessary in the future
afterAll(() => {
    mockedLogger.error.mockClear();
    messageMock.channel.send.mockClear();
});

describe('The 8ball command', () => {
    test('should have properties', () => {
        expect(eightBall.name).not.toBe(undefined);
        expect(eightBall.description).not.toBe(undefined);
        expect(eightBall.disabled).not.toBe(undefined);
        expect(eightBall.requireDB).not.toBe(undefined);
    });
    describe('should execute', () => {
        test('and send a message', async () => {
            await eightBall.execute(null, messageMock);
            expect(messageMock.channel.send).toBeCalled();
        });
        test('or log an error', async () => {
            await eightBall.execute(null, messageMock);
            expect(mockedLogger.error).toBeCalledWith(`8ball: Error sending message: ${errorMsg}`);
        });
    });
});