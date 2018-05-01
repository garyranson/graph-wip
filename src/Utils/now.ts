const now = ((p) => {
  if (!p) {
    const nowOffset = Date.now();
    return () => Date.now() - nowOffset;
  }
  return p.now;
})(window.performance);

export default now;
