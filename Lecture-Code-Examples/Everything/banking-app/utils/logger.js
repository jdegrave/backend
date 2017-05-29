var bunyan = require('bunyan');

module.exports = function(env) {
    if (process.env.TESTS === 'true') {
        return {
                    "info": function() {},  // 'noop' ('no op')
                    "debug": function() {},
                    "warn": function () {},
                    "error": function () {}
                }
    }
    return bunyan.createLogger({
        name: 'bankapp',
        streams: determineStreams(env)
    });
};

function determineStreams (env) {
    if (env === 'prod') {
        return [
            {
                level: 'warn',
                path: '../logs/bankapp-error.log'
            }
        ];
    }

    return [
        {
            level:'debug',
            stream: process.stdout
        }
    ];
}
