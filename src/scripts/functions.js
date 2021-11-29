const mathsteps = require("mathsteps");
let rearrangementSteps = [];
let lastOperations = [];

function simplifyExpression(expression) {
  expression = expression.replace(",", ".");

  try {
    return nerdamer("simplify(" + expression + ")").toString();
  } catch (e) {
    return expression;
  }
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
        "Der linke Teil der Gleichung darf nicht leer sein"
      );
    } else if (leftEquationPart.includes("=")) {
      result.leftEquationValid = false;
      result.errorMessages.push(
        "Der linke Teil der Gleichung darf kein Gleichheitszeichen enthalten"
      );
    } else if (leftEquationPart.includes("^")) {
      countPowerSymbols = leftEquationPart.split("^").length - 1;
      countSquarePowers = leftEquationPart.split("^2").length - 1;

      if (countPowerSymbols != countSquarePowers) {
        result.leftEquationValid = false;
        result.errorMessages.push(
          "Der linke Teil der Gleichung darf keine Exponenten ungleich 2 enthalten"
        );
      }
    }

    if (rightEquationPart == "") {
      result.rightEquationValid = false;
      result.errorMessages.push(
        "Der rechte Teil der Gleichung darf nicht leer sein"
      );
    } else if (rightEquationPart.includes("=")) {
      result.rightEquationValid = false;
      result.errorMessages.push(
        "Der rechte Teil der Gleichung darf kein Gleichheitszeichen enthalten"
      );
    } else if (rightEquationPart.includes("^")) {
      countPowerSymbols = rightEquationPart.split("^").length - 1;
      countSquarePowers = rightEquationPart.split("^2").length - 1;

      if (countPowerSymbols != countSquarePowers) {
        result.rightEquationValid = false;
        result.errorMessages.push(
          "Der rechte Teil der Gleichung darf keine Exponenten ungleich 2 enthalten"
        );
      }
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
        "Die Zielvariable muss ein Klein- oder Großbuchstabe (a-z, A-Z) sein"
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

      if (
        isFinalEquation(leftEquationPart, rightEquationPart, variable)
        || leftEquationPart == rightEquationPart
      ) {
        result.leftEquationValid = false;
        result.rightEquationValid = false;
        result.variableValid = false;
        result.errorMessages.push("Die Gleichung ist bereits gelöst");
      }
    } catch (e) {
      result.leftEquationValid = false;
      result.rightEquationValid = false;
      result.variableValid = false;
      result.errorMessages.push("Die Gleichung wird nicht unterstützt");
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
  } else if (rearrangementStep.includes("=")) {
    return "Der Umformungsschritt darf kein Gleichheitszeichen enthalten";
  } else if (rearrangementStep == "0" && arithmeticOperation == "*") {
    return "Die Multiplikation mit 0 wird nicht unterstützt";
  } else if (rearrangementStep == "0" && arithmeticOperation == "/") {
    return "Die Division durch 0 wird nicht unterstützt";
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

  lastOperations.push({type: arithmeticOperation, value: rearrangementStep});
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

function generateRearrangementStepsArray(leftEquationPart, rightEquationPart) {
  rearrangementSteps = []
  const equation = leftEquationPart + '=' + rightEquationPart;

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

function generateFeedbackMessage(arithmeticOperation, rearrangementStep) {
  let feedbackMessage = "";
  let arrayElement;
  const arithmeticOperatorToString = new Map([['+', 'add'], ['-', 'subtract'], ['*', 'multiply'], ['/', 'divide']]);

  arrayElement = rearrangementSteps.find(e => e.type === arithmeticOperatorToString.get(arithmeticOperation));

  if (arrayElement === undefined) {
    feedbackMessage = {
      message: "Das war leider nicht der perfekte Umformungsschritt. Du kannst es nochmal versuchen oder einfach weitermachen!",
      type: "danger"
    }
  } else {
    if (Number(rearrangementStep) === Number(arrayElement.value)) {
      if (rearrangementSteps.length === 1) {
        feedbackMessage = {message: "Gleichung gelößt.", type: "done"}
      } else {
        feedbackMessage = {
          message: "Perfect! Du hast einen der perfekten Umformungsschritte gefunden.",
          type: "success"
        }
      }
    } else {
      feedbackMessage = {
        message: "Gut! Das war der richtige Weg, aber vielleicht versuch es mit einem anderen Wert.",
        type: "warning"
      }
    }
  }
  return feedbackMessage;
}

function resetLastOperation() {
  lastOperations.pop();
}

function getLastOperationsLength() {
  return lastOperations.length;
}

window.getLastOperationsLength = getLastOperationsLength;
window.resetLastOperation = resetLastOperation;
window.generateFeedbackMessage = generateFeedbackMessage;
window.generateRearrangementStepsArray = generateRearrangementStepsArray;
window.simplifyExpression = simplifyExpression;
window.isFinalEquation = isFinalEquation;
window.evaluateStartEquation = evaluateStartEquation;
window.evaluateRearrangementStep = evaluateRearrangementStep;
window.performRearrangementStep = performRearrangementStep;
