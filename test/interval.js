var loop = require('../');
var test = require('tape');

test('interval', function (t) {
    t.plan(2);
    var engine = loop();
    
    var i = 0;
    var iv = engine.setInterval(function () {
        i ++;
    }, 10);
    
    engine.setTimeout(function () {
        engine.clearInterval(iv);
        t.equal(i, 5);
    }, 51);
    
    engine.setTimeout(function () {
        t.equal(i, 5);
    }, 100);
    
    engine.run();
    
    t.on('end', function () { engine.pause() });
});
