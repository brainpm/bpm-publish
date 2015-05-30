var git = require('parse-git-config');
var ghpages = require('gh-pages');

exports.publish = function(config, opts, cb) {
    console.log('new bundler');
    var gitConfig = git.sync();
    if (gitConfig === null) {
        return cb(new Error('This is not a git repository. Create one first and set a remote. The bpm bundle will be published on the gh-pages branch of this repository.'));
    }
    ghpages.publish('.bpm', {
        /* tag: */
        logger: function(m) {
            console.log(m);
        },
        message: 'auto publish',
        clone: '.bpm/.clone'
    }, cb);
};
