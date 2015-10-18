var pull = require('pull-stream');
var test = require('tape');
var filter = require('../lib/filter-repos');

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
    pull(
        pull.values(repos),
        filter(),
        pull.collect(function(err, arr) {
            t.error(err);
            t.deepEqual(arr, [repos[0], repos[2]]);
            t.end();
        })
    );
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
    pull(
        pull.values(repos),
        filter(),
        pull.collect(function(err, arr) {
            t.error(err);
            t.deepEqual(arr, [repos[0], repos[2]]);
            t.end();
        })
    );
});
