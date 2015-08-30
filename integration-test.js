var test = require('tape');
var getRetrievalStream = require('./lib/get-retrieval-stream');
var through = require('through');
var concat = require('concat-stream');
var jsonStream = require('JSONStream');

test('getRetrievalStream gets array of repo names and functions', function(t) {
    getRetrievalStream('brainpm-testcases', 'brainpm-testcases').pipe(concat(function(receivedArray) {
        t.equal(receivedArray.length, 1);
        var first = receivedArray[0];
        t.equal(first.name, 'teach-nothing');
        t.equal(typeof first.getFileStream, 'function');
        t.end();
    }));
});

test('getFileStream("package.json") returns stream of file content', function(t) {
    getRetrievalStream('brainpm-testcases', 'brainpm-testcases').pipe(concat(function(receivedArray) {
        var first = receivedArray[0];
        first.getFileStream("package.json").pipe(jsonStream.parse()).pipe(through(function(pkg) {
            t.equal(pkg.name, 'teach-nothing');
            t.end();
        }));
    }));
});
