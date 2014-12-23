var loop = require('../');
var engine = loop(function (dt) {
    // ...
});
engine.run();

engine.on('fps', function (fps) {
    console.log('fps=', fps);
});
