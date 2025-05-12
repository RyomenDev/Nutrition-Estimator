const assumptions = [];

function log(msg) {
  assumptions.push(msg);
}

function getAssumptions() {
  return assumptions;
}

function reset() {
  assumptions.length = 0;
}

export { log, getAssumptions, reset };
