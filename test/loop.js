var loop = require('../');
var test = require('tape');

test('loop', function (t) {
    t.plan(4 * 3);
    var engine = loop({ fps: 3, fpsWindow: 1000 });
    var ticks = [];
    engine.on('tick', function (dt) { if (dt > 50) ticks.push(dt) });
    
    engine.on('fps', function (fps) {
        t.equal(ticks.length, 3);
        t.ok(ticks[0] > 300 && ticks[0] < 360);
        t.ok(ticks[1] > 300 && ticks[1] < 360);
        t.ok(ticks[2] > 300 && ticks[2] < 360);
        ticks = [];
    });
    
    engine.run();
    t.on('end', function () { engine.pause() });
});
