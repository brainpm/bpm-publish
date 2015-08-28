var map = require('map-stream');

var listRepos = require('./list-repos');
var filterRepos = require('./filter-repos');

function getEpisodeUrl(org, name) {
    return 'https://'+ org +'.github.io/' + name;
}

module.exports = function(github_organisation, github_user, options) {
    return listRepos(github_organisation, github_user, options).pipe(filterRepos()).pipe(map(function(repo, cb) {
        cb(null, getEpisodeUrl(github_organisation, repo.name));
    }));
};

