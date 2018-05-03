const errorLog = jest
    .fn()
    .mockImplementation((log) => console.error(log))
    .mockName('errorLog');

const infoLog = jest
    .fn()
    .mockImplementation((log) => console.log(log))
    .mockName('infoLog');

module.exports = {
    error: errorLog,
    info: infoLog,
};