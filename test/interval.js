var loop = require('../');
var test = require('tape');

test('interval', function (t) {
    t.plan(2);
    var engine = loop();
    
    var i = 0;
    var iv = engine.setInterval(function () {
        console.error(i, engine.time);
        i ++;
    }, 2);
    
    engine.setTimeout(function () {
        engine.clearInterval(iv);
        console.error('STOP', engine.time);
        t.equal(i, 25);
    }, 51);
    
    engine.setTimeout(function () {
        t.equal(i, 25);
    }, 100);
    
    engine.run();
    
    t.on('end', function () { engine.pause() });
});
