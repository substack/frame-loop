var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var defined = require('defined');

module.exports = Engine;
inherits(Engine, EventEmitter);

function Engine (opts, fn) {
    if (!(this instanceof Engine)) return new Engine(opts, fn);
    EventEmitter.call(this);
    
    if (typeof opts === 'function') {
        fn = opts;
        opts = {};
    }
    if (!opts) opts = {};
    
    this.running = false;
    this.last = Date.now();
    this.time = 0;
    this._timers = [];
    this._fpsTarget = opts.fps || 60;
    this._fpsWindow = defined(opts.fpsWindow, 1000);
    this._info = null;
    this.fps = 0;
    this._requestFrame = opts.requestFrame || detectRequestFrame();
    
    if (fn) this.on('tick', fn);
}

Engine.prototype.run = function () {
    var self = this;
    if (this.running) return;
    this.running = true;
    this.last = Date.now();
    this._info = { frames: 0, start: this.last };
    
    (function tick () {
        if (!self.running) return;
        self.tick();
        var elapsed = (Date.now() - self.last) / 1000;
        var delay = Math.max(0, (1 / self._fpsTarget) - elapsed);
        var dms = Math.floor(delay * 1000);
        if (dms <= 4) self._requestFrame(tick)
        else setTimeout(function () { self._requestFrame(tick) }, dms)
    })();
};

Engine.prototype.pause = function () {
    this.running = false;
};

Engine.prototype.toggle = function () {
    if (this.running) this.pause()
    else this.run()
};

Engine.prototype.tick = function () {
    if (!this.running) return;
    
    var now = Date.now();
    var dt = now - this.last;
    this.last = now;
    this.time += dt;
    this.emit('tick', dt);
    
    if (this._info && this._fpsWindow
    && now - this._info.start > this._fpsWindow) {
        this.fps = this._info.frames / this._fpsWindow * 1000;
        this._info = { frames: 0, start: now };
        this.emit('fps', this.fps);
    }
    if (this._info) { this._info.frames ++ }
    
    var due = [];
    for (var i = 0; i < this._timers.length; i++) {
        var t = this._timers[i];
        if (t[1] <= this.time) {
            due.push(t[0]);
            this._timers.splice(i, 1);
            i --;
        }
    }
    for (var i = 0; i < due.length; i++) due[i]();
};

Engine.prototype.setTimeout = function (fn, ts) {
    this._timers.push([ fn, this.time + ts ]);
};

Engine.prototype.setInterval = function (fn, ts) {
    var self = this;
    var last = self.time;
    var f = function () {
        fn();
        var skew = ts - (self.time - last);
        last = self.time;
        self._timers.push([ f, self.time + ts + skew ]);
    };
    this._timers.push([ f, ts ]);
};

function detectRequestFrame () {
    if (typeof window !== 'undefined' && window
    && window.requestAnimationFrame) {
        return function (fn) { window.requestAnimationFrame(fn) };
    }
    if (typeof self !== 'undefined' && self
    && self.requestAnimationFrame) {
        return function (fn) { self.requestAnimationFrame(fn) };
    }
    if (typeof setImmediate !== 'undefined') {
        return function (fn) { setImmediate(fn) };
    }
    return function (fn) { setTimeout(fn, 0) };
}
