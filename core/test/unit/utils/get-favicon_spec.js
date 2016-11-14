var configUtils   = require('../../utils/configUtils'),
    should        = require('should'),
    path          = require('path'),
    rewire        = require('rewire'),
    getFavicon    = rewire('../../../server/utils/get-favicon');

describe('Uploaded favicon', function () {
    beforeEach(function () {
        configUtils.set('paths:corePath', 'core/');
        configUtils.set('paths:contentPath', path.join(__dirname, '../../utils/fixtures'));
        configUtils.set('theme:favicon', {type: 'upload', url: 'content/images/favicon.png'});
    });

    afterEach(function () {
        configUtils.restore();
    });

    it('should return uploaded favicon', function () {
        beforeEach(function () {
            configUtils.set('theme:favicon', {type: 'upload', url: 'content/images/favicon.png'});
        });
        afterEach(function () {
            configUtils.restore();
        });

        var result = getFavicon('casper');
        should.exist(result);

        result.type.should.be.equal('upload');
        result.url.should.be.equal('content/images/favicon.png');
    });
});

describe('Theme favicon', function () {
    beforeEach(function () {
        configUtils.set('paths:corePath', 'core/');
        configUtils.set('paths:contentPath', path.join(__dirname, '../../utils/fixtures'));
        configUtils.set('theme:favicon', {type: 'default', url: 'core/shared/favicon.png'});
    });

    afterEach(function () {
        configUtils.restore();
    });

    it('returns favicon.png from themes/assets directory', function () {
        var result,
            fsStub = {
                statSync: function (path) {
                    if (path.match(/\/themes\/casper\/assets\/favicon\.png/)) {
                        return 'file content';
                    } else {
                        throw new Error();
                    }
                }
            };

        getFavicon.__set__('fs', fsStub);
        result = getFavicon('casper');

        should.exist(result);
        result.type.should.be.equal('theme-assets');
        result.url.should.match(/\/themes\/casper\/assets\/favicon\.png/);
    });
    it('returns favicon.ico from themes/assets directory', function () {
        var result,
            fsStub = {
                statSync: function (path) {
                    if (path.match(/\/themes\/casper\/assets\/favicon\.ico/)) {
                        return 'file content';
                    } else {
                        throw new Error();
                    }
                }
            };

        getFavicon.__set__('fs', fsStub);
        result = getFavicon('casper');

        should.exist(result);
        result.type.should.be.equal('theme-assets');
        result.url.should.match(/\/themes\/casper\/assets\/favicon.ico/);
    });
    it('returns favicon.png from themes roots directory', function () {
        var result,
            fsStub = {
                statSync: function (path) {
                    if (path.match(/\/themes\/casper\/favicon.png/)) {
                        return 'file content';
                    } else {
                        throw new Error();
                    }
                }
            };

        getFavicon.__set__('fs', fsStub);
        result = getFavicon('casper');

        should.exist(result);
        result.type.should.be.equal('theme-root');
        result.url.should.match(/\/themes\/casper\/favicon.png/);
    });
    it('returns favicon.ico from themes roots directory', function () {
        var result,
            fsStub = {
                statSync: function (path) {
                    if (path.match(/\/themes\/casper\/favicon\.ico/)) {
                        return 'file content';
                    } else {
                        throw new Error();
                    }
                }
            };

        getFavicon.__set__('fs', fsStub);
        result = getFavicon('casper');

        should.exist(result);
        result.type.should.be.equal('theme-root');
        result.url.should.match(/\/themes\/casper\/favicon\.ico/);
    });
});

describe('Default favicon', function () {
    beforeEach(function () {
        configUtils.set('paths:corePath', 'core/');
        configUtils.set('paths:contentPath', path.join(__dirname, '../../utils/fixtures'));
        configUtils.set('theme:favicon', {type: 'default', url: 'core/shared/favicon.png'});
    });

    afterEach(function () {
        configUtils.restore();
    });

    it('returns default favicon.png from shared directory', function () {
        var result,
            fsStub = {
                statSync: function (path) {
                    if (path.match(/core\/shared\/favicon\.png/)) {
                        return 'file content';
                    } else {
                        throw new Error();
                    }
                }
            };

        getFavicon.__set__('fs', fsStub);
        result = getFavicon('casper');

        should.exist(result);
        result.type.should.be.equal('default');
        result.url.should.match(/core\/shared\/favicon\.png/);
    });

    it('returns default favicon.png from shared directory', function () {
        var result,
            fsStub = {
                statSync: function (path) {
                    if (path.match(/core\/shared\/favicon\.ico/)) {
                        return 'file content';
                    } else {
                        throw new Error();
                    }
                }
            };

        getFavicon.__set__('fs', fsStub);
        result = getFavicon('casper');

        should.exist(result);
        result.type.should.be.equal('default');
        result.url.should.be.equal('core/shared/favicon.ico');
    });
});

describe('No favicon', function () {
    beforeEach(function () {
        configUtils.set('paths:corePath', 'core/');
        configUtils.set('paths:contentPath', path.join(__dirname, '../../utils/fixtures'));
        configUtils.set('theme:favicon', {type: 'default', url: 'core/shared/favicon.png'});
    });

    afterEach(function () {
        configUtils.restore();
    });

    it('returns error if no favicon is found', function () {
        var result,
            fsStub = {
                statSync: function () {
                    throw new Error();
                }
            };

        getFavicon.__set__('fs', fsStub);

        try {
            result = getFavicon('casper');
        } catch (error) {
            should.exist(error);
            error.message.should.be.equal('No favicon.png found in Ghost \'core/shared\'');
        }
    });
});
