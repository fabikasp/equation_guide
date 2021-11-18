const mathsteps = require('mathsteps');

function mathstepsTestFunction() {
  const steps = mathsteps.solveEquation('3*x+6=4'); //x^2+4x+6=0

  steps.forEach(step => {
    console.log("before change: " + step.oldEquation.ascii());  // e.g. before change: 2x + 3x = 35
    console.log("change: " + step.changeType);                  // e.g. change: SIMPLIFY_LEFT_SIDE
    console.log("after change: " + step.newEquation.ascii());   // e.g. after change: 5x = 35
    console.log("# of substeps: " + step.substeps.length);      // e.g. # of substeps: 2
  });
}

window.mathstepsTestFunction = mathstepsTestFunction

function startEquationIsValid() {
  // Validierung

  return true;
}

function rearrangementIsValid() {
  // Validierung

  return true;
}

function performRearrangement() {
  // Umformung
}
