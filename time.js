module.exports = function () {
    if (typeof performance !== 'undefined' && performance
    && typeof performance.now === 'function') {
        return function () { return performance.now() };
    }
    else return function () {
        return Date.now();
    };
};
