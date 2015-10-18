var filter = require('pull-stream').filter;

module.exports = function() {
    return filter(function(repo) {
        return repo.has_pages && repo.owner.login !== repo.name;
    });
};
