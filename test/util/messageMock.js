const sendMock = jest
    .fn()
    .mockName('infoLog');

module.exports = {
    channel: {
        send: sendMock,
    },
};