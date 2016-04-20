/* globals describe, it, expect, beforeEach */
define([
    'templating/Decoder',
    'Routes'
], function(Decoder, App) {
    var expect, container, app;

    expect = chai.expect;

    container = document.createElement('div');
    var $container = $(container);

    $container.css('opacity', 0).appendTo('body');

    app = new App();
    app.start(container);
    window.location.hash = '';

    var $template = $container.children();
    var panel = $template.find('.panel:last .panel-body');
    describe('Routes Tests Prod environment', function() {
        describe('Routes #/levela tests', function() {

            it('route triggered #/levela, should execute following DOM', function(done) {
                var hashChange = function() {
                    window.removeEventListener('hashchange', hashChange);
                    setTimeout(function() {
                        expect(panel.find('h4:first')).to.have.$text('Header LevelA');
                        expect(panel).to.contain.$text('Binded Item From AppA');
                        expect(panel).not.to.contain.$text('Body levelA/levelB');
                        expect(panel).not.to.contain.$text('Binded Item From AppB');
                        done();
                    }, 50)
                }
                window.addEventListener('hashchange', hashChange);
                setTimeout(function() {
                    window.location.hash = '/levela';
                }, 50);
            });
            it('route triggered #/levela/levelb, should execute following DOM', function(done) {
                var hashChange = function() {
                    window.removeEventListener('hashchange', hashChange);
                    setTimeout(function() {
                        expect(panel.find('h4:first')).to.have.$text('Header LevelA');
                        expect(panel).to.contain.$text('Binded Item From AppA');
                        expect(panel).to.contain.$text('Body levelA/levelB');
                        expect(panel).to.contain.$text('Binded Item From AppB');
                        done();
                    }, 50);
                }
                window.addEventListener('hashchange', hashChange);
                setTimeout(function() {
                    window.location.hash = '/levela/levelb';
                }, 50);
            });
            it('route triggered #/levela, again should execute following DOM', function(done) {
                var hashChange = function() {
                    window.removeEventListener('hashchange', hashChange);
                    setTimeout(function() {
                        expect(panel.find('h4:first')).to.have.$text('Header LevelA');
                        expect(panel).to.contain.$text('Binded Item From AppA');
                        expect(panel).not.to.contain.$text('Body levelA/levelB');
                        expect(panel).not.to.contain.$text('Binded Item From AppB');
                        done();
                    }, 50);
                }
                window.addEventListener('hashchange', hashChange);
                setTimeout(function() {
                    window.location.hash = '/levela';
                }, 50);
            });
            it('route triggered #, should execute following DOM', function(done) {
                var hashChange = function() {
                    window.removeEventListener('hashchange', hashChange);
                    setTimeout(function() {
                        expect(panel.find('h4:first')).not.to.have.$text('Header LevelA');
                        expect(panel).not.to.contain.$text('Binded Item From AppA');
                        expect(panel).not.to.contain.$text('Body levelA/levelB');
                        expect(panel).not.to.contain.$text('Binded Item From AppB');
                        done();
                    }, 50);
                }
                window.addEventListener('hashchange', hashChange);
                setTimeout(function() {
                    window.location.hash = '';
                }, 50);
            });

            it('route triggered #/levela/levelb/levelf, should execute following DOM', function(done) {
                var hashChange = function() {
                    window.removeEventListener('hashchange', hashChange);
                    setTimeout(function() {
                        expect(panel.find('h4:first')).to.have.$text('Header LevelA');
                        expect(panel).to.contain.$text('Binded Item From AppA');
                        expect(panel).to.contain.$text('Body levelA/levelB');
                        expect(panel).to.contain.$text('Binded Item From AppB');
                        expect(panel).to.contain.$text('Route inner Level F');
                        done();
                    }, 50);
                }
                window.addEventListener('hashchange', hashChange);
                setTimeout(function() {
                    window.location.hash = '/levela/levelb/levelf';
                }, 50);
            });
        });
        describe('Routes #/levelb tests', function() {
            it('route triggered #/levelb, should execute following DOM', function(done) {
                var hashChange = function() {
                    window.removeEventListener('hashchange', hashChange);
                    setTimeout(function() {
                        expect(panel.find('h4:first')).to.have.$text('Header levelB');
                        expect(panel).not.to.contain.$text('Binded Item From AppA');
                        expect(panel).not.to.contain.$text('Body levelA/levelB');

                        expect(panel).to.contain.$text('Body levelB');
                        expect(panel).to.contain.$text('Binded Item From AppB');
                        expect(panel).not.to.contain.$text('Route inner Level F');
                        done();
                    }, 50);
                }
                window.addEventListener('hashchange', hashChange);
                setTimeout(function() {
                    window.location.hash = '/levelb';
                }, 50);
            });
            it('route triggered #/levelb/levelf, should execute following DOM', function(done) {
                var hashChange = function() {
                    window.removeEventListener('hashchange', hashChange);
                    setTimeout(function() {

                        expect(panel.find('h4:first')).to.have.$text('Header levelB');
                        expect(panel).not.to.contain.$text('Binded Item From AppA');
                        expect(panel).not.to.contain.$text('Body levelA/levelB');

                        expect(panel).to.contain.$text('Body levelB');
                        expect(panel).to.contain.$text('Binded Item From AppB');
                        expect(panel).to.contain.$text('Route inner Level F');
                        done();
                    }, 50);
                }
                window.addEventListener('hashchange', hashChange);
                setTimeout(function() {
                    window.location.hash = '/levelb/levelf';
                }, 50);
            });
            it('route triggered #, should execute following DOM', function(done) {
                var hashChange = function() {
                    window.removeEventListener('hashchange', hashChange);
                    setTimeout(function() {

                        expect(panel.find('h4:first')).not.to.have.$text('Header levelB');
                        expect(panel).not.to.contain.$text('Binded Item From AppA');
                        expect(panel).not.to.contain.$text('Body levelA/levelB');

                        expect(panel).not.to.contain.$text('Body levelB');
                        expect(panel).not.to.contain.$text('Binded Item From AppB');
                        expect(panel).not.to.contain.$text('Route inner Level F');
                        done();
                    }, 50);
                }
                window.addEventListener('hashchange', hashChange);
                setTimeout(function() {
                    window.location.hash = '';
                }, 50);
            });
            it('route triggered #/levelb, should execute following DOM', function(done) {
                var hashChange = function() {
                    window.removeEventListener('hashchange', hashChange);
                    setTimeout(function() {

                        expect(panel.find('h4:first')).to.have.$text('Header levelB');
                        expect(panel).not.to.contain.$text('Binded Item From AppA');
                        expect(panel).not.to.contain.$text('Body levelA/levelB');

                        expect(panel).to.contain.$text('Body levelB');
                        expect(panel).to.contain.$text('Binded Item From AppB');
                        expect(panel).not.to.contain.$text('Route inner Level F');
                        done();
                    }, 50);
                }
                window.addEventListener('hashchange', hashChange);
                setTimeout(function() {
                    window.location.hash = '/levelb';
                }, 50);
            });
        });
        describe('Dinamic route tests', function() {
            it('Route #/leveln/844 id in DOM should be 844', function(done) {
                var hashChange = function() {
                    window.removeEventListener('hashchange', hashChange);
                    setTimeout(function() {


                        var showid = panel.find('.showId');
                        expect(panel).to.contain.$text('Component Header levelN/:ID');
                        expect(showid).to.have.$text('844');
                        done();
                    }, 50);
                }
                window.addEventListener('hashchange', hashChange);
                setTimeout(function() {
                    window.location.hash = '/leveln/844';
                }, 50);
            });
            it('Route #/leveln/845 id in DOM should be 845', function(done) {
                var hashChange = function() {
                    window.removeEventListener('hashchange', hashChange);
                    setTimeout(function() {

                        var showid = panel.find('.showId');
                        expect(panel).to.contain.$text('Component Header levelN/:ID');
                        expect(showid).to.have.$text('845');
                        done();
                    }, 50);

                }
                window.addEventListener('hashchange', hashChange);
                setTimeout(function() {
                    window.location.hash = '/leveln/845';
                }, 50);
            });
            it('Route #leveln not contain link-id and text', function(done) {
                var hashChange = function() {
                    window.removeEventListener('hashchange', hashChange);
                    setTimeout(function() {

                        var showid = panel.find('.showId');
                        expect(panel).not.to.contain.$text('Component Header levelN/:ID');
                        expect(showid).not.to.have.$text('845');
                        done();
                    }, 50);

                }
                window.addEventListener('hashchange', hashChange);
                setTimeout(function() {
                    window.location.hash = '/leveln';
                }, 50);
            });
        });
    });
});