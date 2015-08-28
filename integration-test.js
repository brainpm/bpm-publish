var getRetrievalStream = require('./lib/get-retrieval-stream');
var through = require('through');
var concat = require('concat-stream');
getRetrievalStream('shecodes-content', 'foo').pipe(through(function(episode) {
    console.log(episode.name);
    if (episode.name === 'intro') {
        episode.getFileStream('package.json').pipe(concat(function(json) {
            console.log('JSON', json.toString('utf8'));
        }));
    }
}));
