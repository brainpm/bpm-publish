var nets = require('nets');
var _ = require('lodash')._;
var debug = require('debug')('toc');
var fromArray = require('from2-array');
var through = require('through');

// returns an object stream of repo opbejcts
// organisation: github organisation
// userName: github login (used for User-Agent header)
module.exports = function(github_organisation, github_user, options) {
    options = options || {};
    nets = options.nets || nets;
    var resultStream = through();

    var listReposUrl = "https://api.github.com/orgs/"+ github_organisation +"/repos?type=public";
    debug('HTTP GET %s', listReposUrl);
    nets({
        url: listReposUrl,
        headers: {
            'User-Agent': github_user
        }
    }, function done (err, response, data) {
        if (err) {
            return resultStream.emit('error', err);
        }
        if (response.statusCode !== 200) {
            return resultStream.emit('error', new Error('HTTP status code ' + response.statusCode + ' from github API'));
        }
        var repos = null;
        debug('parsing JSON reply from github API');
        try {
            repos = JSON.parse(data);
            debug('found %d repositories', repos.length);
        } catch(e) {
            debug('Error parsing JSON reply from github', data);
            return resultStream.emit('error', e);
        }
        fromArray.obj(repos).pipe(resultStream);
    });
    return resultStream;
};
