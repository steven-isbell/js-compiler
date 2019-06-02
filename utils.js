function pipe(...fns) {
  return val =>
    fns.reduce((currentVal, currentFunc) => currentFunc(currentVal), val);
}

module.exports = {
  pipe
};
