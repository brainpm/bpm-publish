var path = require('path');
var git = require('parse-git-config');
var ghpages = require('gh-pages');

exports.publish = function(config, opts, repoDir, bundleDir, cb) {
    var gitConfig = git.sync({path: path.join(repoDir,'.git/config')});
    if (gitConfig === null) {
        return cb(new Error('This is not a git repository. Create one first and set a remote. The bpm bundle will be published on the gh-pages branch of this repository.'));
    }
    ghpages.publish(bundleDir, {
        /* tag: */
        logger: function(m) {
            console.log(m);
        },
        message: 'auto publish',
        clone: path.join(bundleDir, '.clone')
    }, function(err) {
        if (err) return cb(err);
        var repoUrl = gitConfig['remote "origin"'].url;
        var result = repoUrl.match(/.*:(.*)\/(.*)\.git$/);
        var org = result[1];
        var repoName = result[2];
        cb(null, {
            repositoryUrl: repoUrl,
            organisation: org,
            repositoryName: repoName
        });
    });
};
