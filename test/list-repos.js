var toc = require('../lib/list-repos');
var through = require('through');
var concat = require('concat-stream');
var test = require('tape');
var result;

function testCase2(body, options, cb) {
    var statusCode = options.statusCode || 200;
    var error = options.error || null;
    var org = options.org || 'shecodes-content';
    var name = options.name || 'jfr3000';
    var headers = options.headers || {};
    var netsArgs = null;

    var hyperquestMock = function(opts) {
        hyperquestArgs = arguments;
        var stream = through(function() {
            if (!error) {
                this.emit('response', {statusCode: statusCode, headers: headers});
                this.push(body);
                this.push(null);
            } else {
                this.emit('error', error);
            }
        });
    };

    var stream = listRepos(org, name, {hyperquest: hyperquestMock});
    stream.on('error', function(err) {
        cb(err, null, hyperquestArgs);
    });
    stream.pipe(concat({encoding: 'object'},function(data) {
        cb(null, data, hyperquestArgs);
    }));
}

function testCase(body, options, cb) {
    var statusCode = options.statusCode || 200;
    var error = options.error || null;
    var org = options.org || 'shecodes-content';
    var name = options.name || 'jfr3000';

    var netsArgs = null;

    var netsMock = function(opts, cb) {
        netsArgs = arguments;
        process.nextTick(function() {
            cb(error, {statusCode: statusCode}, body);
        });
    };

    var stream = toc(org, name, {nets: netsMock});
    stream.on('error', function(err) {
        cb(err, null, netsArgs);
    });
    stream.pipe(concat({encoding: 'object'},function(data) {
        cb(null, data, netsArgs);
    }));
}

test('nets should be called with username as User-Agent', function(t) {
    testCase('[1,2,3]', {name: 'foo'}, function(err, result, netsArgs) {
        t.error(err);
        t.equal(netsArgs[0].headers['User-Agent'], 'foo');
        t.end();
    });
});

test('if we receive JSON, all should be well', function(t) {
    testCase('[1,2,3]', {}, function(err, result) {
        t.error(err);
        t.deepEqual(result, [1,2,3]);
        t.end();
    });
});

test('if JSON is broken, all should not be well', function(t) {
    testCase('[1,2,3', {}, function(err, result) {
        t.ok(err instanceof Error, 'is Error');
        t.notOk(result, 'no result');
        t.end();
    });
});

test('if server response is not 200, all should not be well', function(t) {
    testCase('', {statusCode: 403}, function(err, result) {
        t.ok(err instanceof Error, 'is Error');
        t.notOk(result, 'no result');
        t.end();
    });
});

test('if request could not be sent, all should not be well', function(t) {
    testCase('', {error: new Error('firewall')}, function(err, result) {
        t.ok(err instanceof Error, 'is Error');
        t.notOk(result, 'no result');
        t.end();
    });
});
