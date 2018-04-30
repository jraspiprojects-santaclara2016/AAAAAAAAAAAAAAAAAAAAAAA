const ping = require('../.././commands/util/ping');

const loggingMock = jest.fn();

jest.mock('../../handler/util/winstonLogHandler', () => {
    return {
        getLogger: function() {
            return {
                error: loggingMock,
            };
        },
    };
});

const sendMock = jest
    .fn()
    .mockImplementationOnce(() => {
        return new Promise(function(resolve, reject) {
            resolve('something');
        });
    })
    .mockImplementationOnce(() => {
        return new Promise(function(resolve, reject) {
            reject('some error');
        });
    });
const message = {
    channel: {
        send: sendMock,
    },
};

describe('Testing the ping command', () => {
    test('it should have properties', () => {
        expect(ping.name).not.toBe(undefined);
        expect(ping.name).not.toBe(undefined);
        expect(ping.name).not.toBe(undefined);
    });
    describe('it should execute', () => {
        test('and send a message', () => {
            ping.execute(null, message);
            expect(sendMock.mock.calls.length).toBe(1);
        });
        test('or log an error', () => {
            ping.execute(null, message);
            expect(loggingMock.mock.calls.length).toBe(1);
        });
    });
});



