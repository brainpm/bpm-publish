var test = require('tape');
var pull = require('pull-stream');
var getRetrievalStream = require('./lib/get-retrieval-stream');
var through = require('through');
var jsonStream = require('JSONStream');

test('getRetrievalStream gets array of repo names and functions', function(t) {
    pull(
        getRetrievalStream('brainpm-testcases', 'brainpm-testcases'),
        pull.collect(function(err, receivedArray) {
            t.error(err);
            t.equal(receivedArray.length, 1);
            var first = receivedArray[0];
            t.equal(first.name, 'teach-nothing');
            t.equal(typeof first.getFileStream, 'function');
            t.end();
        })
    );
});

test('getFileStream("package.json") returns stream of file content', function(t) {
    pull(
    getRetrievalStream('brainpm-testcases', 'brainpm-testcases'),
    pull.collect(function(err, receivedArray) {
        t.error(err);
        var first = receivedArray[0];
        first.getFileStream("package.json").pipe(jsonStream.parse()).pipe(through(function(pkg) {
            t.equal(pkg.name, 'teach-nothing');
            t.end();
        }));
    }));
});
