var sinon        = require('sinon'),
    should       = require('should'),
    express      = require('express'),
    serveFavicon = require('../../../server/middleware/serve-favicon'),
    configUtils  = require('../../utils/configUtils'),
    path         = require('path'),
    sandbox      = sinon.sandbox.create();

should.equal(true, true);

describe('Serve Favicon', function () {
    var req, res, next, blogApp;

    beforeEach(function () {
        req = sinon.spy();
        res = sinon.spy();
        next = sinon.spy();
        blogApp = express();
        req.app = blogApp;
    });

    afterEach(function () {
        sandbox.restore();
        configUtils.restore();
    });

    describe('serveFavicon', function () {
        it('should return a middleware', function () {
            var middleware = serveFavicon();

            middleware.should.be.a.Function();
        });

        it('should skip if the request does NOT match the file', function () {
            var middleware = serveFavicon();
            req.path = '/robots.txt';
            middleware(req, res, next);
            next.called.should.be.true();
        });

        it.skip('serves custom uploaded favicon.png', function () {
            var middleware = serveFavicon(),
                body = 'User-agent: * Disallow: /';

            req.path = '/favicon.png';
            configUtils.set('paths:contentPath', path.join(__dirname + '../../../utils/fixtures/'));
            configUtils.set({
                theme: {
                    favicon: {
                        type: 'upload',
                        url: path.join('../../../utils/fixtures/images/favicon.png')
                    }
                }
            });

            res = {
                writeHead: sinon.spy(),
                end: sinon.spy()
            };

            middleware(req, res, next);

            next.called.should.be.false();
            res.writeHead.called.should.be.true();
            // res.writeHead.args[0][0].should.equal(200);
            // res.writeHead.calledWith(200, sinon.match.has('Content-Type')).should.be.true();
            // res.writeHead.calledWith(200, sinon.match.has('Content-Length')).should.be.true();
            // res.writeHead.calledWith(200, sinon.match.has('ETag')).should.be.true();
            // res.writeHead.calledWith(200, sinon.match.has('Cache-Control', 'public, max-age=3600')).should.be.true();
            //
            res.end.calledWith(body).should.be.true();
        });
        it.skip('serves favicon.png from themes', function () {
            var middleware = serveFavicon(),
                body = 'User-agent: * Disallow: /';

            req.path = '/favicon.png';
            configUtils.set('paths:contentPath', path.join(__dirname + '../../../utils/fixtures/'));
            configUtils.set({
                theme: {
                    favicon: {
                        type: 'theme-assets',
                        url: path.join('../../../utils/fixtures/images/favicon.png')
                    }
                }
            });

            res = {
                writeHead: sinon.spy(),
                end: sinon.spy()
            };

            middleware(req, res, next);

            next.called.should.be.false();
            res.writeHead.called.should.be.true();
            // res.writeHead.args[0][0].should.equal(200);
            // res.writeHead.calledWith(200, sinon.match.has('Content-Type')).should.be.true();
            // res.writeHead.calledWith(200, sinon.match.has('Content-Length')).should.be.true();
            // res.writeHead.calledWith(200, sinon.match.has('ETag')).should.be.true();
            // res.writeHead.calledWith(200, sinon.match.has('Cache-Control', 'public, max-age=3600')).should.be.true();
            //
            res.end.calledWith(body).should.be.true();
        });
    });
});
