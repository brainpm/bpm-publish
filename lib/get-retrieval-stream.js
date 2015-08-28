var hyperquest = require('hyperquest');
var map = require('map-stream');

var listRepos = require('./list-repos');
var filterRepos = require('./filter-repos');

function getEpisodeUrl(org, name) {
    return 'https://'+ org +'.github.io/' + name;
}

module.exports = function(github_organisation, github_user, options) {
    return listRepos(github_organisation, github_user, options).pipe(filterRepos()).pipe(map(function(repo, cb) {
        var baseUrl = getEpisodeUrl(github_organisation, repo.name);
        cb(null, {
            name: repo.name,
            getFileStream: function(filename) {
                var fileUrl = baseUrl + '/' + filename;
                return hyperquest(fileUrl);
            }
        });
    }));
};

