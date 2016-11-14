var config = require('../config'),
    _      = require('lodash'),
    utils  = require('../utils'),
    errors = require('../errors'),
    i18n   = require('../i18n'),
    fs     = require('fs');

module.exports = function getFavicon(activeTheme) {
    var path = [],
        correctPath;

    // Case: favicon was uploaded already
    if (config.get('theme').favicon && config.get('theme').favicon.type === 'upload') {
        return config.get('theme').favicon;
    }

    // The order is important, as it reflects the way we're looking for favicons.
    // Case: check for favicon.png in assets of active Theme
    path.push({type: 'theme-assets', url: utils.url.urlJoin(config.getContentPath('themes'), activeTheme, 'assets/favicon.png')});
    // Case: check for favicon.ico in assets of active Theme
    path.push({type: 'theme-assets', url: utils.url.urlJoin(config.getContentPath('themes'), activeTheme, 'assets/favicon.ico')});
    // Case: check for favicon.png in root of active Theme
    path.push({type: 'theme-root', url: utils.url.urlJoin(config.getContentPath('themes'), activeTheme, 'favicon.png')});
    // Case: check for favicon.png in root of active Theme
    path.push({type: 'theme-root', url: utils.url.urlJoin(config.getContentPath('themes'), activeTheme, 'favicon.ico')});
    // Case: fallback to default favicon.png in shared directory
    path.push({type: 'default', url: utils.url.urlJoin(config.get('paths').corePath, 'shared/favicon.png')});
    // Case: fallback to default favicon.ico in shared directory
    path.push({type: 'default', url: utils.url.urlJoin(config.get('paths').corePath, 'shared/favicon.ico')});

    correctPath = _.remove(path, function (n) {
        try {
            fs.statSync(n.url);
            return n;
        } catch (err) {
            return;
        }
    });

    if (correctPath.length === 0) {
        throw new errors.GhostError({message: i18n.t('errors.utils.noFaviconFound.message'), help: i18n.t('errors.utils.noFaviconFound.help')});
    }

    return correctPath[0];
};
