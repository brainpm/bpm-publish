var getRetrievalStream = require('../lib/get-retrieval-stream');
var through = require('through');
var concat = require('concat-stream');
var test = require('tape');
var result;

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

    var stream = getRetrievalStream(org, name, {nets: netsMock});
    stream.on('error', function(err) {
        cb(err, null, netsArgs);
    });
    stream.pipe(concat({encoding: 'object'},function(data) {
        cb(null, data, netsArgs);
    }));
}

test('should return stream of {name, getFileStream()} objects', function(t) {
    testCase('[{"name": "foo", "has_pages": true, "owner": {"login": "bar"}}]', {}, function(err, result) {
        t.error(err);
        t.deepEqual(result[0].name, 'foo');
        t.equal(typeof result[0].getFileStream, 'function');
        t.end();
    });
});

test('should not return the repo when its owner\'s login name matches the repo name', function(t) {
    testCase('[{"name": "foo", "has_pages": true, "owner": {"login": "foo"}}]', {}, function(err, result) {
        t.error(err);
        t.deepEqual(result, []);
        t.end();
    });
});
