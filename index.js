var exec = require('child_process').exec;
var path = require('path');

var parseGitConfig = require('parse-git-config');
var ghpages = require('gh-pages');
var parseGithubUrl = require('github-url');
var debug = require('debug')('bpm-publish');

function isGitClean(repoDir, cb) {
    // returns true if
    // Your branch is up-to-date with 'origin/master'.
    // nothing to commit, working directory clean

    exec('git status', {
        cwd: repoDir
    }, function(err, stdout) {
        if (err) return cb(err);
        debug('git status says %s', stdout);
        var hasPushed = /branch is up-to-date/i.test(stdout);
        var hasCommitted = /nothing to commit/i.test(stdout);
        debug('has pushed: %s', hasPushed);
        debug('has committed: %s', hasCommitted);
        cb(null, hasCommitted && hasPushed);
    });
}


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
    var gitConfig = parseGitConfig.sync({path: path.join(repoDir,'.git/config')});
    if (gitConfig === null) {
        return cb(new Error('This is not a git repository. Create one first and set a remote. The bpm bundle will be published on the gh-pages branch of this repository.'));
    }
    debug('found local git repo');
    var repoUrl = gitConfig['remote "origin"'].url;
    debug('remote "origin" is at %s', repoUrl);

    isGitClean(repoDir, function(err, clean) {
        if (err) return cb(err);
        if (!clean) return cb(new Error('Please commit and push before publishing.'));

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
    });

};
