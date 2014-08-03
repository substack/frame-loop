var loop = require('../');
var keyname = require('keynames');

var player = document.querySelector('#player');
var pos = { x: 200, y: 200 };
var vel = { x: 0, y: 0 };

var engine = loop(function (dt) {
    pos.x += vel.x * dt / 5;
    pos.y += vel.y * dt / 5;
    player.style.left = pos.x;
    player.style.top = pos.y;
});
engine.run();

engine.on('fps', function (fps) {
    console.log('fps=', fps);
});

window.addEventListener('keydown', function (ev) {
    var name = keyname[ev.which];
    if (name === 'left') vel.x = -1;
    if (name === 'right') vel.x = 1;
    if (name === 'up') vel.y = -1;
    if (name === 'down') vel.y = 1;
});
window.addEventListener('keyup', function (ev) {
    var name = keyname[ev.which];
    if (name === 'left' || name === 'right') vel.x = 0;
    if (name === 'up' || name === 'down') vel.y = 0;
});
