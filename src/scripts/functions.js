const mathsteps = require("mathsteps");

function mathstepsTestFunction() {
  const steps = mathsteps.solveEquation('3*x+14=4'); //x^2+4x+6=0

  steps.forEach(step => {
    console.log("before change: " + step.oldEquation.ascii());  // e.g. before change: 2x + 3x = 35
    console.log("change: " + step.changeType);                  // e.g. change: SIMPLIFY_LEFT_SIDE
    console.log("after change: " + step.newEquation.ascii());   // e.g. after change: 5x = 35
    console.log("# of substeps: " + step.substeps.length);      // e.g. # of substeps: 2
  });
}

function simplifyExpression(expression) {
  try {
    return nerdamer("simplify(" + expression + ")").toString();
  } catch (e) {
    return expression;
  }
}

function getEquationResult(leftEquationPart, rightEquationPart, variable) {
  return nerdamer.solveEquations(
    leftEquationPart + "=" + rightEquationPart,
    variable
  ).toString();
}

function isFinalEquation(leftEquationPart, rightEquationPart, variable) {
  try {
    if (
      leftEquationPart == variable && !rightEquationPart.includes(variable)
      || rightEquationPart == variable && !leftEquationPart.includes(variable)
    ) {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
}

function evaluateStartEquations(leftEquationPart, rightEquationPart, variable) {
  var result = {
  	"leftEquationValid": true,
  	"rightEquationValid": true,
    "variableValid": true,
  	"errorMessages": []
  }

  try {
    if (leftEquationPart == "") {
      result.leftEquationValid = false;
      result.errorMessages.push(
        "Der linke Teil der Gleichung darf nicht leer sein"
      );
    }

    if (rightEquationPart == "") {
      result.rightEquationValid = false;
      result.errorMessages.push(
        "Der rechte Teil der Gleichung darf nicht leer sein"
      );
    }

    if (
      leftEquationPart.includes("^")
      || leftEquationPart.includes("√")
      || leftEquationPart.includes("sqrt")
      || rightEquationPart.includes("^")
      || rightEquationPart.includes("√")
      || rightEquationPart.includes("sqrt")
    ) {
      result.leftEquationValid = false;
      result.rightEquationValid = false;
      result.variableValid = false;
      result.errorMessages.push(
        "Die Gleichung darf keine Potenzen oder Wurzeln enthalten"
      );
    }

    if (variable == "") {
      result.variableValid = false;
      result.errorMessages.push(
        "Die Zielvariable darf nicht leer sein"
      );
    } else if (variable.length != 1) {
      result.variableValid = false;
      result.errorMessages.push(
        "Die Zielvariable darf nur ein Zeichen enthalten"
      );
    } else if (!variable.match("[a-zA-Z]")) {
      result.variableValid = false;
      result.errorMessages.push(
        "Die Zielvariable muss ein Klein- oder Großbuchstabe sein"
      );
    } else if (
      !leftEquationPart.includes(variable)
      && !rightEquationPart.includes(variable)
    ) {
      result.variableValid = false;
      result.errorMessages.push(
        "Die Zielvariable muss in der Gleichung vorkommen"
      );
    }
  } catch (e) {
    result.leftEquationValid = false;
    result.rightEquationValid = false;
    result.variableValid = false;
    result.errorMessages.push("Die Gleichung wird nicht unterstützt");
  }

  if (result.errorMessages.length == 0) {
    try {
      equationResult = getEquationResult(
        leftEquationPart,
        rightEquationPart,
        variable
      );

      if (equationResult == "") {
        throw new Error();
      }
    } catch (e) {
      result.leftEquationValid = false;
      result.rightEquationValid = false;
      result.variableValid = false;
      result.errorMessages.push("Die Gleichung wird nicht unterstützt");
    }

    if (
      isFinalEquation(leftEquationPart, rightEquationPart, variable)
      || leftEquationPart.toString() == rightEquationPart.toString()
    ) {
      result.leftEquationValid = false;
      result.rightEquationValid = false;
      result.variableValid = false;
      result.errorMessages.push("Die Gleichung ist bereits gelöst");
    }
  }

  return result;
}

function evaluateRearrangementStep(
  leftEquationPart,
  rightEquationPart,
  arithmeticOperation,
  rearrangementStep
) {
  if (rearrangementStep == "") {
    return "Der Umformungsschritt darf nicht leer sein";
  }

  try {
    leftRearrangementStep = "(" + leftEquationPart + ")"
      + arithmeticOperation
      + rearrangementStep;

    simplifiedLeftEquationPart = simplifyExpression(leftRearrangementStep);

    if (simplifiedLeftEquationPart == leftRearrangementStep) {
      return "Der Umformungsschritt wird nicht unterstützt";
    }

    rightRearrangementStep = "(" + rightEquationPart + ")"
      + arithmeticOperation
      + rearrangementStep;

    simplifiedRightEquationPart = simplifyExpression(rightRearrangementStep);

    if (simplifiedRightEquationPart == rightRearrangementStep) {
      return "Der Umformungsschritt wird nicht unterstützt";
    }
  } catch (e) {
    return "Der Umformungsschritt wird nicht unterstützt";
  }

  return "";
}

function performRearrangementStep(
  expression,
  arithmeticOperation,
  rearrangementStep
) {
  return simplifyExpression(
    "(" + expression + ")" + arithmeticOperation + rearrangementStep
  );
}

window.mathstepsTestFunction = mathstepsTestFunction;
window.simplifyExpression = simplifyExpression;
window.isFinalEquation = isFinalEquation;
window.evaluateStartEquations = evaluateStartEquations;
window.evaluateRearrangementStep = evaluateRearrangementStep;
window.performRearrangementStep = performRearrangementStep;
