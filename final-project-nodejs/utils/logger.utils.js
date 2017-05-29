var bunyan = require('bunyan');

module.exports = function (env) {
    // empty functions for tests (no logging)
    if (process.env.TESTS === 'true') {
        return {
            'info': function () {},
            'debug': function () {},
            'warn': function () {},
            'error': function () {},
        };
    }
    //otherwise, create the logger:
    return bunyan.createLogger({
        name: 'robo-sms',
        streams: determineStreams(env)
    });

    function determineStreams(env) {
        if (env === 'prod') {
            return [
                        {
                            level : 'warn',
                            path : '../logs/robo-sms-error.log'
                        }

            ];
        }
        return [
                    {
                        level : 'debug',
                        stream : process.stdout
                    }
        ];

    }
}
