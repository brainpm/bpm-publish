var getRetrievalStream = require('../lib/get-retrieval-stream');
var pull = require('pull-stream');
var through = require('through');
var test = require('tape');
var result;

function testCase(body, options, cb) {
    var statusCode = options.statusCode || 200;
    var error = options.error || null;
    var org = options.org || 'shecodes-content';
    var name = options.name || 'jfr3000';

    var netsArgs = null;

    var hyperquestMock = function(opts, cb) {
        netsArgs = arguments;
        var responseStream = through(function(data) {
            this.emit('response', {statusCode: data.statusCode, headers: {}});
            this.push(data.body);
            this.push(null);
        });
        (function(body, headers) {
            setTimeout(function() {
                responseStream.write({statusCode: statusCode, body: body});
            }, 250);
        })(body, statusCode);
        responseStream.setHeader = function() {};
        return responseStream;
    };

    pull(
        getRetrievalStream(org, name, {request: hyperquestMock}),
        pull.collect(function(err, data) {
            cb(err, data, netsArgs);
        })
    );
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
