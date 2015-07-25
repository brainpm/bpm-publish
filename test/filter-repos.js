var test = require('tape');
var filter = require('../lib/filter-repos');
var concat = require('concat-stream');
var from = require('from2-array');

 test('should reject repo that matches organisation name', function(t){
    var repos = [
        {
            name: 'bar',
            owner: {login: 'foo'},
            has_pages: true
        },
        {
            name: 'foo',
            owner: {login: 'foo'},
            has_pages: true
        },
        {
            name: 'bar',
            owner: {login: 'foo'},
            has_pages: true
        }
    ];
    var input = from.obj(repos).pipe(filter()).pipe(concat({encoding: 'object'}, function(arr) {
        t.deepEqual(arr, [repos[0], repos[2]]);
        t.end();
    }));
});

test('should reject repos without gh-pages branch', function(t){
    var repos = [
        {
            name: 'bar',
            owner: {login: 'foo'},
            has_pages: true
        },
        {
            name: 'bar',
            owner: {login: 'foo'},
            has_pages: false
        },
        {
            name: 'bar',
            owner: {login: 'foo'},
            has_pages: true
        }
    ];
    var input = from.obj(repos).pipe(filter()).pipe(concat({encoding: 'object'}, function(arr) {
        t.deepEqual(arr, [repos[0], repos[2]]);
        t.end();
    }));
});
