var fs     = require('fs'),
    storage = require('../storage'),
    config = require('../config'),
    utils  = require('../utils'),
    crypto = require('crypto'),
    buildContentResponse,
    content;

buildContentResponse = function buildContentResponse(ext, buf) {
    var blogRegex = /(\{\{blog-url\}\})/g,
        apiRegex = /(\{\{api-url\}\})/g;

    buf = buf.toString().replace(blogRegex, config.get('url').replace(/\/$/, ''));
    buf = buf.toString().replace(apiRegex, utils.url.apiUrl({cors: true}));

    content = {
        headers: {
            'Content-Type': 'image/' + ext,
            'Content-Length': buf.length,
            ETag: '"' + crypto.createHash('md5').update(buf, 'utf8').digest('hex') + '"',
            'Cache-Control': 'public, max-age=' + utils.ONE_DAY_S
        },
        body: buf
    };
    return content;
};

// ### serveFavicon Middleware
// Handles requests to favicon.png and favicon.ico
function serveFavicon() {
    // @TODO: Redirects!!!!
    return function serveFavicon(req, res, next) {
        var filePath = req.path;

        if (req.path.match(/^\/favicon\.(ico|png)/i)) {
            // Case: custom favicon exists, load it from local file storage
            if (config.get('theme').favicon.type === 'upload') {
                filePath = config.get('theme').favicon.url.replace(/\/content\/images\//, '');

                storage.getStorage().read({path: filePath}).then(function readFile(buf, err) {
                    if (err) {
                        return next(err);
                    }

                    content = buildContentResponse('png', buf);

                    res.writeHead(200, content.headers);
                    res.end(content.body);
                });
            } else {
                // Case: favicon is not uploaded by user, check stored place in config
                filePath = config.get('theme').favicon.url;

                fs.readFile(filePath, function readFile(err, buf) {
                    if (err) {
                        return next(err);
                    }
                    content = buildContentResponse('png', buf);

                    res.writeHead(200, content.headers);
                    res.end(content.body);
                });
            }
        } else {
            next();
        }
    };
}

module.exports = serveFavicon;
