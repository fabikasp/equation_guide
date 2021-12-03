const mathsteps = require("mathsteps");
let rearrangementSteps = [];
let lastOperations = [];

function simplifyExpression(expression) {
  if (expression.includes("sqrt")) {
    try {
      return nerdamer("simplify(" + expression + ")").toString();
    } catch (e) {
      return expression;
    }
  } else {
    const steps = mathsteps.simplifyExpression(expression);
    if (steps.length === 0) {
      return expression.replace(/[()]/g, '');
    } else {
      return (steps[steps.length - 1].newNode.toString()).replace(/[()]/g, '');
    }
  }
}

function testMathStepsSimplify() {
  console.log((/([^0-9+*\/\-x])/g).test('st2'));
  console.log((/([^0-9+*\/\-x^[sqrt]()])/g).test('sqrt(x)'));



 /* const steps = mathsteps.simplifyExpression('4*(x+20)/4');
  console.log(steps);
  console.log(steps[steps.length - 1].newNode.toString());
  console.log(nerdamer("simplify(" + "((3)/2)" + ")").toString());*/

  /*steps.forEach(step => {
    console.log("before change: " + step.oldEquation.ascii());  // e.g. before change: 2x + 3x = 35
    console.log("change: " + step.changeType);                  // e.g. change: SIMPLIFY_LEFT_SIDE
    console.log("after change: " + step.newEquation.ascii());   // e.g. after change: 5x = 35
    console.log("# of substeps: " + step.substeps.length);      // e.g. # of substeps: 2
  });*/
}

function getEquationResult(leftEquationPart, rightEquationPart, variable) {
  leftEquationPart = leftEquationPart.replace(",", ".");
  rightEquationPart = rightEquationPart.replace(",", ".");

  return nerdamer.solveEquations(
    leftEquationPart + "=" + rightEquationPart,
    variable
  ).toString();
}

function isFinalEquation(leftEquationPart, rightEquationPart, variable) {
  try {
    if (
      (leftEquationPart == variable || leftEquationPart == "abs(" + variable + ")")
      && !rightEquationPart.includes(variable)
      || (rightEquationPart == variable || rightEquationPart == "abs(" + variable + ")")
      && !leftEquationPart.includes(variable)
    ) {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
}

function evaluateStartEquation(leftEquationPart, rightEquationPart, variable) {
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
        "Der linke Teil der Gleichung darf nicht leer sein."
      );
    } else if (leftEquationPart.includes("=")) {
      result.leftEquationValid = false;
      result.errorMessages.push(
        "Der linke Teil der Gleichung darf kein Gleichheitszeichen enthalten."
      );
    } else if (leftEquationPart.includes("^")) {
      countPowerSymbols = leftEquationPart.split("^").length - 1;
      countSquarePowers = leftEquationPart.split("^2").length - 1;

      if (countPowerSymbols != countSquarePowers) {
        result.leftEquationValid = false;
        result.errorMessages.push(
          "Der linke Teil der Gleichung darf keine Exponenten ungleich 2 enthalten."
        );
      }
    }

    if (rightEquationPart == "") {
      result.rightEquationValid = false;
      result.errorMessages.push(
        "Der rechte Teil der Gleichung darf nicht leer sein."
      );
    } else if (rightEquationPart.includes("=")) {
      result.rightEquationValid = false;
      result.errorMessages.push(
        "Der rechte Teil der Gleichung darf kein Gleichheitszeichen enthalten."
      );
    } else if (rightEquationPart.includes("^")) {
      countPowerSymbols = rightEquationPart.split("^").length - 1;
      countSquarePowers = rightEquationPart.split("^2").length - 1;

      if (countPowerSymbols != countSquarePowers) {
        result.rightEquationValid = false;
        result.errorMessages.push(
          "Der rechte Teil der Gleichung darf keine Exponenten ungleich 2 enthalten."
        );
      }
    }

    if (variable == "") {
      result.variableValid = false;
      result.errorMessages.push(
        "Die Zielvariable darf nicht leer sein."
      );
    } else if (variable.length != 1) {
      result.variableValid = false;
      result.errorMessages.push(
        "Die Zielvariable darf nur ein Zeichen enthalten."
      );
    } else if (!variable.match("[a-zA-Z]")) {
      result.variableValid = false;
      result.errorMessages.push(
        "Die Zielvariable muss ein Klein- oder Großbuchstabe (a-z, A-Z) sein."
      );
    } else if (
      !leftEquationPart.includes(variable)
      && !rightEquationPart.includes(variable)
    ) {
      result.variableValid = false;
      result.errorMessages.push(
        "Die Zielvariable muss in der Gleichung vorkommen."
      );
    }
  } catch (e) {
    result.leftEquationValid = false;
    result.rightEquationValid = false;
    result.variableValid = false;
    result.errorMessages.push("Die Gleichung wird nicht unterstützt.");
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

      if (
        isFinalEquation(leftEquationPart, rightEquationPart, variable)
        || leftEquationPart == rightEquationPart
      ) {
        result.leftEquationValid = false;
        result.rightEquationValid = false;
        result.variableValid = false;
        result.errorMessages.push("Die Gleichung ist bereits gelöst.");
      }
    } catch (e) {
      result.leftEquationValid = false;
      result.rightEquationValid = false;
      result.variableValid = false;
      result.errorMessages.push("Die Gleichung wird nicht unterstützt.");
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
  if (rearrangementStep === "") {
    if (!["^2", "sqrt"].includes(arithmeticOperation)) {
      return "Der Umformungsschritt darf nicht leer sein.";
    }
  } else if (rearrangementStep.includes("=")) {
    return "Der Umformungsschritt darf kein Gleichheitszeichen enthalten.";
  } else if (rearrangementStep === "0" && arithmeticOperation === "*") {
    return "Die Multiplikation mit 0 wird nicht unterstützt.";
  } else if (rearrangementStep === "0" && arithmeticOperation === "/") {
    return "Die Division durch 0 wird nicht unterstützt.";
  }

  try {
    if (arithmeticOperation == "sqrt") {
      leftRearrangementStep = "sqrt(" + leftEquationPart + ")";
      rightRearrangementStep = "sqrt(" + rightEquationPart + ")";
    } else {
      leftRearrangementStep = "(" + leftEquationPart + ")"
        + arithmeticOperation
        + rearrangementStep;
      rightRearrangementStep = "(" + rightEquationPart + ")"
        + arithmeticOperation
        + rearrangementStep;
    }

    simplifiedLeftEquationPart = simplifyExpression(leftRearrangementStep);

    if ((/([^0-9+*\/\-x^[sqrt]()])/g).test(leftRearrangementStep) || (/([^0-9+*\/\-x^[sqrt]()])/g).test(rightRearrangementStep)) {
      return "Der Umformungsschritt wird nicht unterstützt.";
    }

    /*
    if (
      arithmeticOperation !== "sqrt"
      && simplifiedLeftEquationPart === leftRearrangementStep
    ) {
      console.log("1");
      return "Der Umformungsschritt wird nicht unterstützt.";
    }

    simplifiedRightEquationPart = simplifyExpression(rightRearrangementStep);

    if (
      arithmeticOperation !== "sqrt"
      && simplifiedRightEquationPart === rightRearrangementStep
    ) {
      console.log("2");
      return "Der Umformungsschritt wird nicht unterstützt.";
    }*/
  } catch (e) {
    console.log("3");
    return "Der Umformungsschritt wird nicht unterstützt.";
  }

  lastOperations.push({type: arithmeticOperation, value: rearrangementStep});

  return "";
}

function performRearrangementStep(
  expression,
  arithmeticOperation,
  rearrangementStep
) {
  if (arithmeticOperation === "sqrt") {
    return simplifyExpression("sqrt(" + expression + ")");
  }

  return simplifyExpression(
    "(" + expression + ")" + arithmeticOperation + rearrangementStep
  );
}

function generateRearrangementStepsArray(leftEquationPart, rightEquationPart) {
  rearrangementSteps = []
  const equation = leftEquationPart + "=" + rightEquationPart;

  const steps = mathsteps.solveEquation(equation);

  steps.forEach(step => {
    switch (step.changeType) {
      case "ADD_TO_BOTH_SIDES":
        rearrangementSteps.push({type: "add", value: step.newEquation.leftNode.args[1].value});
        break;
      case "SUBTRACT_FROM_BOTH_SIDES":
        rearrangementSteps.push({type: "subtract", value: step.newEquation.leftNode.args[1].value});
        break;
      case "MULTIPLY_BOTH_SIDES_BY_INVERSE_FRACTION":
        rearrangementSteps.push({type: "multiply", value: step.newEquation.leftNode.args[1].value});
        break;
      case "MULTIPLY_TO_BOTH_SIDES":
        rearrangementSteps.push({type: "multiply", value: step.newEquation.leftNode.args[1].value});
        break;
      case "DIVIDE_FROM_BOTH_SIDES":
        rearrangementSteps.push({type: "divide", value: step.newEquation.leftNode.args[1].value});
        break;
    }
  });
}

function generateFeedbackMessage(
  leftEquationPart,
  rightEquationPart,
  variable,
  arithmeticOperation,
  rearrangementStep
) {
  if (
    leftEquationPart.includes("sqrt") || leftEquationPart.includes("^2")
    || rightEquationPart.includes("sqrt") || rightEquationPart.includes("^2")
  ) {
    return generateNerdamerFeedbackMessage(
      leftEquationPart,
      rightEquationPart,
      variable,
      arithmeticOperation,
      rearrangementStep
    );
  }

  return generateMathstepsFeedbackMessage(arithmeticOperation, rearrangementStep);
}

function generateMathstepsFeedbackMessage(arithmeticOperation, rearrangementStep) {
  let feedbackMessage = {};
  let arrayElement;
  const arithmeticOperatorToString = new Map([["+", "add"], ["-", "subtract"], ["*", "multiply"], ["/", "divide"]]);

  arrayElement = rearrangementSteps.find(e => e.type === arithmeticOperatorToString.get(arithmeticOperation));

  if (arrayElement === undefined) {
    feedbackMessage = {
      message: "Das war leider kein optimaler Umformungsschritt. Du kannst den Schritt rückgängig oder einfach weiter machen.",
      type: "warning"
    }
  } else {
    if (Number(rearrangementStep) === Number(arrayElement.value)) {
      if (rearrangementSteps.length > 1) {
        feedbackMessage = {
          message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
          type: "info"
        }
      }
    } else {
      feedbackMessage = {
        message: "Gut! Das ist der richtige Weg, aber versuch es vielleicht mit einem anderen Wert.",
        type: "warning"
      }
    }
  }

  return feedbackMessage;
}

function generateNerdamerFeedbackMessage(
  leftEquationPart,
  rightEquationPart,
  variable,
  arithmeticOperation,
  rearrangementStep
) {
  let optimalRearrangementStep = false;

  if (
    (leftEquationPart.includes("^2") || rightEquationPart.includes("^2"))
    && arithmeticOperation == "sqrt"
  ) {
    optimalRearrangementStep = true;
  }

  if (
    (leftEquationPart.includes("sqrt") || rightEquationPart.includes("sqrt"))
    && arithmeticOperation == "^2"
  ) {
    optimalRearrangementStep = true;
  }

  if (!optimalRearrangementStep) {
    countLeftNumbersBeforeRearrangement = leftEquationPart.replace(/[^0-9]/g, "").length;
    countRightNumbersBeforeRearrangement = rightEquationPart.replace(/[^0-9]/g, "").length;

    rearrangedLeftEquationPart = performRearrangementStep(leftEquationPart, arithmeticOperation, rearrangementStep);
    rearrangedRightEquationPart = performRearrangementStep(rightEquationPart, arithmeticOperation, rearrangementStep);

    countLeftNumbersAfterRearrangement = rearrangedLeftEquationPart.replace(/[^0-9]/g, "").length;
    countRightNumbersAfterRearrangement = rearrangedRightEquationPart.replace(/[^0-9]/g, "").length;

    if (
      leftEquationPart.includes(variable)
      && !rightEquationPart.includes(variable)
      && countLeftNumbersAfterRearrangement < countLeftNumbersBeforeRearrangement
    ) {
      optimalRearrangementStep = true;
    }

    if (
      rightEquationPart.includes(variable)
      && !leftEquationPart.includes(variable)
      && countRightNumbersAfterRearrangement < countRightNumbersBeforeRearrangement
    ) {
      optimalRearrangementStep = true;
    }

    if (leftEquationPart.includes(variable) && rightEquationPart.includes(variable)) {
      if (
        rearrangedLeftEquationPart.includes(variable)
        && !rearrangedRightEquationPart.includes(variable)
      ) {
        optimalRearrangementStep = true;
      }

      if (
        rearrangedLeftEquationPart.includes(variable)
        && countLeftNumbersAfterRearrangement < countLeftNumbersBeforeRearrangement
      ) {
        optimalRearrangementStep = true;
      }

      if (
        rearrangedRightEquationPart.includes(variable)
        && !rearrangedLeftEquationPart.includes(variable)
      ) {
        optimalRearrangementStep = true;
      }

      if (
        rearrangedRightEquationPart.includes(variable)
        && countRightNumbersAfterRearrangement < countRightNumbersBeforeRearrangement
      ) {
        optimalRearrangementStep = true;
      }
    }
  }

  if (optimalRearrangementStep) {
    return {
      message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
      type: "info"
    }
  }

  return {};
}

function resetLastOperation() {
  lastOperations.pop();
}

function getLastOperationsLength() {
  return lastOperations.length;
}

window.testMathStepsSimplify = testMathStepsSimplify;
window.getLastOperationsLength = getLastOperationsLength;
window.resetLastOperation = resetLastOperation;
window.generateFeedbackMessage = generateFeedbackMessage;
window.generateRearrangementStepsArray = generateRearrangementStepsArray;
window.simplifyExpression = simplifyExpression;
window.isFinalEquation = isFinalEquation;
window.evaluateStartEquation = evaluateStartEquation;
window.evaluateRearrangementStep = evaluateRearrangementStep;
window.performRearrangementStep = performRearrangementStep;
