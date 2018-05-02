const mockedLogger = require('../util/loggerMock');
const messageMock = require('../util/messageMock');

const errorMsg = 'Error Message';

jest.mock('../../handler/util/winstonLogHandler', () => {
    return {
        getLogger: function() {
            return mockedLogger;
        },
    };
});

messageMock.channel.send
    .mockImplementationOnce(() => {
        return new Promise(function(resolve, reject) {
            resolve('succesfull');
        });
    })
    .mockImplementationOnce(() => {
        return new Promise(function(resolve, reject) {
            reject(errorMsg);
        });
    });

const ping = require('../.././commands/util/ping');

//TODO check if necesarry in the future
afterAll(() => {
    mockedLogger.error.mockClear();
    messageMock.channel.send.mockClear();
});

describe('The Ping command', () => {
    test('should have properties', () => {
        expect(ping.name).not.toBe(undefined);
        expect(ping.name).not.toBe(undefined);
        expect(ping.name).not.toBe(undefined);
    });
    describe('should execute', () => {
        test('and send a message', async () => {
            await ping.execute(null, messageMock);
            expect(messageMock.channel.send).toBeCalled();
        });
        test('or log an error', async () => {
            await ping.execute(null, messageMock);
            expect(mockedLogger.error).toBeCalledWith(`Ping: Error sending message: ${errorMsg}`);
        });
    });
});



