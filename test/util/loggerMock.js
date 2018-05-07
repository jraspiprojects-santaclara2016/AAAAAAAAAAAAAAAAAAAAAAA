const errorLog = jest
    .fn()
    .mockImplementation((log) => console.error(log))
    .mockName('errorLog');

const warnLog = jest
    .fn()
    .mockImplementation((log) => console.log(log))
    .mockName('warnLog');

const infoLog = jest
    .fn()
    .mockImplementation((log) => console.log(log))
    .mockName('infoLog');

const sillyLog = jest
    .fn()
    .mockImplementation((log) => console.log(log))
    .mockName('sillyLog');

module.exports = {
    error: errorLog,
    warn: warnLog,
    info: infoLog,
    silly: sillyLog,
};