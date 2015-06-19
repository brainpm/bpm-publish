var path = require('path');
var git = require('parse-git-config');
var ghpages = require('gh-pages');
var parseGithubUrl = require('github-url');
var debug = require('debug')('bpm-publish');

function ghpagesPublish(bundleDir, options, cb) {
    ghpages.publish(bundleDir, options, function(err) {
        try {
            cb(err);
        } catch(e) {
            console.error(e.stack);
            process.exit(1);
        }
    });
}

exports.publish = function(config, opts, repoDir, bundleDir, cb) {
    debug(require('./package.json').version);
    var gitConfig = git.sync({path: path.join(repoDir,'.git/config')});
    if (gitConfig === null) {
        return cb(new Error('This is not a git repository. Create one first and set a remote. The bpm bundle will be published on the gh-pages branch of this repository.'));
    }
    debug('found local git repo');
    var repoUrl = gitConfig['remote "origin"'].url;
    debug('remote "origin" is at %s', repoUrl);

    var deployDir = path.join(repoDir, '.bpm', 'deploy');

    // gh-pages seems to have trouble with abosulte paths
    bundleDir = path.relative(process.cwd(), bundleDir);
    deployDir = path.relative(process.cwd(), deployDir);
    debug('calling ghpages.publish');

    ghpagesPublish(bundleDir, {
        /* tag: */
        repo: repoUrl,
        logger: function(m) {
            debug(m);
        },
        message: 'auto publish',
        clone: deployDir
    }, function(err) {
        debug('ghpages.publish done with error ' + err);
        if (err) return cb(err);
        debug('repoUrl', repoUrl);
        var components = parseGithubUrl(repoUrl);
        debug('url parse result', JSON.stringify(components));
        cb(null, {
            repositoryUrl: repoUrl,
            organisation: components.user,
            repositoryName: components.project
        });
    });
};
