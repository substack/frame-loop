module.exports = function time () {
  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    return performance.now();
  } else {
    return Date.now();
  }
};
