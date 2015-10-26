var pull = require('pull-stream');
var hyperquest = require('hyperquest');
var map = require('map-stream');

var listRepos = require('list-github-repos');
var filterRepos = require('./filter-repos');

function getEpisodeUrl(org, name) {
    return 'https://'+ org +'.github.io/' + name;
}

module.exports = function(github_organisation, github_user, options) {
    return pull(
        listRepos(github_user, options)(github_organisation),
        filterRepos(),
        pull.map(function(repo) {
            var baseUrl = getEpisodeUrl(github_organisation, repo.name);
            return {
                name: repo.name,
                getFileStream: function(filename) {
                    var fileUrl = baseUrl + '/' + filename;
                    return hyperquest(fileUrl);
                }
            };
        })
    );
};
