var loop = require('../');
var test = require('tape');

test('loop', function (t) {
    t.plan(17);
    var engine = loop({ fps: 3, fpsWindow: 1000 });
    var ticks = [];
    engine.on('tick', function (dt) { ticks.push(dt) });
    
    var fi = 0;
    engine.on('fps', function (fps) {
        if (fi === 0) {
            t.equal(ticks.length, 4);
            t.ok(ticks[0] < 50);
            t.ok(ticks[1] > 300 && ticks[0] < 360);
            t.ok(ticks[2] > 300 && ticks[1] < 360);
            t.ok(ticks[3] > 300 && ticks[2] < 360);
        }
        else {
            t.equal(ticks.length, 3);
            t.ok(ticks[0] > 300 && ticks[0] < 360);
            t.ok(ticks[1] > 300 && ticks[1] < 360);
            t.ok(ticks[2] > 300 && ticks[2] < 360);
        }
        ticks = [];
        fi ++;
    });
    
    engine.run();
    t.on('end', function () { engine.pause() });
});
