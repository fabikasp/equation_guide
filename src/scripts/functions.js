const mathsteps = require("mathsteps");
let rearrangementSteps = [];
let lastOperations = [];
let wrongCounter = 0;

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
  if (rearrangementStep == "") {
    if (!["^2", "sqrt"].includes(arithmeticOperation)) {
      return "Der Umformungsschritt darf nicht leer sein.";
    }
  } else if (rearrangementStep.includes("=")) {
    return "Der Umformungsschritt darf kein Gleichheitszeichen enthalten.";
  } else if (rearrangementStep == "0" && arithmeticOperation == "*") {
    return "Die Multiplikation mit 0 wird nicht unterstützt.";
  } else if (rearrangementStep == "0" && arithmeticOperation == "/") {
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

    if (
      arithmeticOperation != "sqrt"
      && simplifiedLeftEquationPart == leftRearrangementStep
    ) {
      return "Der Umformungsschritt wird nicht unterstützt.";
    }

    simplifiedRightEquationPart = simplifyExpression(rightRearrangementStep);

    if (
      arithmeticOperation != "sqrt"
      && simplifiedRightEquationPart == rightRearrangementStep
    ) {
      return "Der Umformungsschritt wird nicht unterstützt.";
    }
  } catch (e) {
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
  if (arithmeticOperation == "sqrt") {
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
    wrongCounter += 1;
    feedbackMessage = {
      message: "Das war leider kein optimaler Umformungsschritt. Du kannst den Schritt rückgängig oder einfach weiter machen.",
      type: "warning"
    }
  } else {
    if (Number(rearrangementStep) === Number(arrayElement.value)) {
      if (rearrangementSteps.length > 1) {
        wrongCounter = 0;
        feedbackMessage = {
          message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
          type: "info"
        }
      }
    } else {
      wrongCounter += 1;
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
    countLeftNumbersBeforeRearrangement = leftEquationPart.replace(/[^0-9]/g,"").length;
    countRightNumbersBeforeRearrangement = rightEquationPart.replace(/[^0-9]/g,"").length;

    rearrangedLeftEquationPart = performRearrangementStep(leftEquationPart, arithmeticOperation, rearrangementStep);
    rearrangedRightEquationPart = performRearrangementStep(rightEquationPart, arithmeticOperation, rearrangementStep);

    countLeftNumbersAfterRearrangement = rearrangedLeftEquationPart.replace(/[^0-9]/g,"").length;
    countRightNumbersAfterRearrangement = rearrangedRightEquationPart.replace(/[^0-9]/g,"").length;

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

function getAdviceMessage() {
  console.log(rearrangementSteps);
  switch (true) {
    case (wrongCounter < 2):
      return "Probier doch erstmal ein bisschen."
    case (wrongCounter < 4):
      return window.getAdvice("weak");
    case (wrongCounter >= 4):
      return window.getAdvice("strong");
  }
}

function getAdvice(type) {
  if (rearrangementSteps.length === 0) {
    return "Du hast die Gleichung bereits gelößt."
  } else {
    switch (type) {
      case "weak":
        switch (rearrangementSteps[getRandomInt(0, rearrangementSteps.length - 1)].type) {
          case "add":
            return "Versuch es doch mal mit addieren."
          case "subtract":
            return "Versuch es doch mal mit subtrahieren."
          case "multiply":
            return "Versuch es doch mal mit multiplizieren."
          case "divide":
            return "Versuch es doch mal mit dividieren."
        }
        break;
      case "strong":
        const arrayElement = rearrangementSteps[getRandomInt(0, rearrangementSteps.length - 1)];
        switch (arrayElement.type) {
          case "add":
            return "Mit +" + arrayElement.value + " umzuformen, wird dich bestimmt weiterbringen."
          case "subtract":
            return "Mit -" + arrayElement.value + " umzuformen, wird dich bestimmt weiterbringen."
          case "multiply":
            return "Mit *" + arrayElement.value + " umzuformen, wird dich bestimmt weiterbringen."
          case "divide":
            return "Mit /" + arrayElement.value + " umzuformen, wird dich bestimmt weiterbringen."
        }
    }
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


function checkIfEquationContainsRootOrPower(leftEquationPart, rightEquationPart) {
  return !(!leftEquationPart.includes("sqrt") && !rightEquationPart.includes("sqrt")
    && !leftEquationPart.includes("^2") && !rightEquationPart.includes("^2"));
}

function testMathStepsSimplify() {
  /*const steps = mathsteps.simplifyExpression('(15+2*x)/2');
  console.log(steps[steps.length - 1].newNode.toString());

  const steps = mathsteps.solveEquation('2*(2+x) = 0');

  steps.forEach(step => {
    console.log("before change: " + step.oldEquation.ascii());  // e.g. before change: 2x + 3x = 35
    console.log("change: " + step.changeType);                  // e.g. change: SIMPLIFY_LEFT_SIDE
    console.log("after change: " + step.newEquation.ascii());   // e.g. after change: 5x = 35
    console.log("# of substeps: " + step.substeps.length);      // e.g. # of substeps: 2
  });*/
}

function resetWrongCounter() {
  wrongCounter = 0;
}

window.resetWrongCounter = resetWrongCounter;
window.getAdviceMessage = getAdviceMessage;
window.checkIfEquationContainsRootOrPower = checkIfEquationContainsRootOrPower;
window.testMathStepsSimplify = testMathStepsSimplify;
window.getAdvice = getAdvice;
window.getLastOperationsLength = getLastOperationsLength;
window.resetLastOperation = resetLastOperation;
window.generateFeedbackMessage = generateFeedbackMessage;
window.generateRearrangementStepsArray = generateRearrangementStepsArray;
window.simplifyExpression = simplifyExpression;
window.isFinalEquation = isFinalEquation;
window.evaluateStartEquation = evaluateStartEquation;
window.evaluateRearrangementStep = evaluateRearrangementStep;
window.performRearrangementStep = performRearrangementStep;
