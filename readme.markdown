# frame-loop

timing for simulations and games for node and the browser

[![testling badge](https://ci.testling.com/substack/frame-loop.png)](https://ci.testling.com/substack/frame-loop)

[![build status](https://secure.travis-ci.org/substack/frame-loop.png)](http://travis-ci.org/substack/frame-loop)

# example

Here is a simple game where you can drive a purple square with the keyboard:

``` js
var loop = require('frame-loop');
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
```

and the html:

```
<!doctype html5>
<html>
  <head>
    <style>
      #player {
        position: absolute;
        background-color: purple;
        width: 100px;
        height: 100px;
      }
    </style>
  </head>
  <body>
    <div id="player"></div>
    <script src="bundle.js"></script>
  </body>
</html>
```

Compile with [browserify](http://browserify.org):

```
$ browserify loop.js > bundle.js
```

# methods

``` js
var loop = require('frame-loop')
```

## var engine = loop(opts, fn)

If a function `fn(dt)` is given, it will be registered as a listener for the
`'tick'` event.

`opts` are:

* `opts.fps` - the target fps to aim for, default: 60
* `opts.fpsWindow` - how often to emit the `'fps'` event in milliseconds,
default: 1000
* `opts.requestFrame` - the function to use to request a frame
* `opts.now` - function to use for timing in milliseconds like `Date.
now()`. By default, this is `window.performance.now()` in browsers and a wrapper
for `process.hrtime()` that returns floating point milliseconds in node.

If `opts.requestFrame` isn't provided, it will be detected dynamically.

In the browser, `opts.requestFrame` defaults to `window.requestAnimationFrame`
or `self.requestAnimationFrame`.

On the server, `opts.requestFrame` defaults to `setImmediate` or
`setTimeout(fn, 0)`.

## engine.run()

Start or unpause the engine.

## engine.pause()

Stop the engine.

## engine.toggle()

If the engine was running, pause it. Otherwise, run the engine.

## var to = engine.setTimeout(fn, time)

Schedule an event `fn` to happen in `time` milliseconds of game time.

## engine.clearTimeout(to)

Clear a timeout `to` created with `engine.setTimeout()`.

## var iv = engine.setInterval(fn, time)

Schedule an event `fn` to happen every `time` milliseconds of game time.

## engine.clearInterval(iv)

Clear a timeout `iv` created with `engine.setInterval()`.

# properties

## engine.running

A boolean indicating whether the engine is paused or running.

## engine.time

The monotonically-increasing game time in milliseconds.

# events

## engine.on('tick', function (dt) {})

Whenever a frame is rendered, a tick event fires with the time difference
between frames, `dt` in milliseconds.

## engine.on('fps', function (fps) {})

Every fpsWindow (default: 1000ms), this event fires with the calculated frames
per second `fps`.

# install

With [npm](https://npmjs.org) do:

```
npm install frame-loop
```

# license

MIT
