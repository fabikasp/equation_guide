const mathsteps = require("mathsteps");
const nerdamer = require("nerdamer/all.min");
let rearrangementSteps = [];
let lastOperations = [];
let wrongCounter = 0;
let adviceButtonClickCounter = 0;

function simplifyExpression(expression) {
  if (expression.includes("sqrt") || expression.includes("^")) {
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
    } else if ((/([^0-9A-Za-z+*\/\-^\s(sqrt)().,])/g).test(leftEquationPart)) {
      result.leftEquationValid = false;
      result.errorMessages.push(
        "Der linke Teil der Gleichung darf keine unzulässigen Zeichen enthalten."
      );
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
    } else if ((/([^0-9A-Za-z+*\/\-^\s(sqrt)().,])/g).test(rightEquationPart)) {
      result.rightEquationValid = false;
      result.errorMessages.push(
        "Der rechte Teil der Gleichung darf keine unzulässigen Zeichen enthalten."
      );
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

  leftEquationPart = simplifyExpression(leftEquationPart);
  rightEquationPart = simplifyExpression(rightEquationPart);

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

    if (
      (/([^0-9A-Za-z+*\/\-^\s(sqrt)().,])/g).test(leftRearrangementStep)
      || (/([^0-9A-Za-z+*\/\-^\s(sqrt)().,])/g).test(rightRearrangementStep)
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
  if (arithmeticOperation === "sqrt") {
    return simplifyExpression("sqrt(" + expression + ")");
  }

  return simplifyExpression(
    "(" + expression + ")" + arithmeticOperation + rearrangementStep
  );
}

function generateRearrangementStepsArray(leftEquationPart, rightEquationPart, variable) {
  rearrangementSteps = []
  const equation = leftEquationPart + "=" + rightEquationPart;

  const steps = mathsteps.solveEquation(equation);

  steps.forEach(step => {
    switch (step.changeType) {
      case "ADD_TO_BOTH_SIDES":
        if (step.newEquation.leftNode.args[1].value !== undefined) {
          rearrangementSteps.push({type: "add", value: step.newEquation.leftNode.args[1].value});
        } else {
          rearrangementSteps.push({
            type: "add",
            value: step.newEquation.leftNode.args[1].args[0] + "/" + step.newEquation.leftNode.args[1].args[1]
          });
        }
        break;
      case "SUBTRACT_FROM_BOTH_SIDES":
        if (step.newEquation.leftNode.args[1].value !== undefined) {
          rearrangementSteps.push({type: "subtract", value: step.newEquation.leftNode.args[1].value});
        } else {
          rearrangementSteps.push({
            type: "subtract",
            value: step.newEquation.leftNode.args[1].args[0] + "/" + step.newEquation.leftNode.args[1].args[1]
          });
        }
        break;
      case "MULTIPLY_BOTH_SIDES_BY_INVERSE_FRACTION":
        if (step.newEquation.leftNode.args[1].value !== undefined) {
          rearrangementSteps.push({type: "multiply", value: step.newEquation.leftNode.args[1].value});
        } else {
          rearrangementSteps.push({
            type: "multiply",
            value: step.newEquation.leftNode.args[1].args[0] + "/" + step.newEquation.leftNode.args[1].args[1]
          });
        }
        break;
      case "MULTIPLY_TO_BOTH_SIDES":
        if (step.newEquation.leftNode.args[1].value !== undefined) {
          rearrangementSteps.push({type: "multiply", value: step.newEquation.leftNode.args[1].value});
        } else {
          rearrangementSteps.push({
            type: "multiply",
            value: step.newEquation.leftNode.args[1].args[0] + "/" + step.newEquation.leftNode.args[1].args[1]
          });
        }
        break;
      case "DIVIDE_FROM_BOTH_SIDES":
        if (step.newEquation.leftNode.args[1].value !== undefined) {
          rearrangementSteps.push({type: "divide", value: step.newEquation.leftNode.args[1].value});
        } else {
          rearrangementSteps.push({
            type: "divide",
            value: step.newEquation.leftNode.args[1].args[0] + "/" + step.newEquation.leftNode.args[1].args[1]
          });
        }
        break;
      case "FIND_ROOTS":
        const variablePosition = equation.search(variable);
        const equationArray = equation.split('');
        let number = "";
        for (let i = 0; i < variablePosition; i++) {
          if (!isNaN(Number(equationArray[i])) || equationArray[i] === "/") {
            number = number + equationArray[i];
          } else {
            number = "";
          }
        }
        if (number.includes("/")) {
          const splitNumber = number.split("/");
          rearrangementSteps.push({type: "multiply", value: splitNumber[1]});
        } else {
          rearrangementSteps.push({type: "divide", number});
        }
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
    equationContainsRoot(leftEquationPart, rightEquationPart)
    || equationContainsPower(leftEquationPart, rightEquationPart)
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
    adviceButtonClickCounter = 0;

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

function getAdviceMessage(leftEquationPart, rightEquationPart) {
  adviceButtonClickCounter += 1;

  if (equationContainsRoot(leftEquationPart, rightEquationPart)) {
    if (adviceButtonClickCounter < 2) {
      return "Versuch es erst einmal selbst.";
    }

    return "Versuch es doch mal mit Potenzieren";
  } else if (equationContainsPower(leftEquationPart, rightEquationPart)) {
    if (adviceButtonClickCounter < 2) {
      return "Versuch es erst einmal selbst.";
    }

    return "Versuch es doch mal mit Wurzelziehen";
  }

  if (rearrangementSteps.length === 0) {
    return "Du hast die Gleichung bereits gelößt.";
  } else {
    switch (true) {
      case (wrongCounter < 2):
        return "Versuch es erst einmal selbst.";
      case (wrongCounter < 4):
        return getAdvice("weak");
      case (wrongCounter >= 4):
        return getAdvice("strong");
    }
  }
}

function getAdvice(type) {
  switch (type) {
    case "weak":
      switch (rearrangementSteps[getRandomInt(0, rearrangementSteps.length - 1)].type) {
        case "add":
          return "Versuch es doch mal mit addieren.";
        case "subtract":
          return "Versuch es doch mal mit subtrahieren.";
        case "multiply":
          return "Versuch es doch mal mit multiplizieren.";
        case "divide":
          return "Versuch es doch mal mit dividieren.";
      }
      break;
    case "strong":
      const arrayElement = rearrangementSteps[getRandomInt(0, rearrangementSteps.length - 1)];
      switch (arrayElement.type) {
        case "add":
          return "Mit +" + arrayElement.value + " umzuformen, wird dich bestimmt weiterbringen.";
        case "subtract":
          return "Mit -" + arrayElement.value + " umzuformen, wird dich bestimmt weiterbringen.";
        case "multiply":
          return "Mit *" + arrayElement.value + " umzuformen, wird dich bestimmt weiterbringen.";
        case "divide":
          return "Mit /" + arrayElement.value + " umzuformen, wird dich bestimmt weiterbringen.";
      }
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function equationContainsRoot(leftEquationPart, rightEquationPart) {
  return leftEquationPart.includes("sqrt") || rightEquationPart.includes("sqrt");
}

function equationContainsPower(leftEquationPart, rightEquationPart) {
  return leftEquationPart.includes("^2") || rightEquationPart.includes("^2");
}

function resetWrongCounter() {
  wrongCounter = 0;
}

function resetAdviceButtonClickCounter() {
  adviceButtonClickCounter = 0;
}

window.resetWrongCounter = resetWrongCounter;
window.resetAdviceButtonClickCounter = resetAdviceButtonClickCounter;
window.getAdviceMessage = getAdviceMessage;
window.getLastOperationsLength = getLastOperationsLength;
window.resetLastOperation = resetLastOperation;
window.generateFeedbackMessage = generateFeedbackMessage;
window.generateRearrangementStepsArray = generateRearrangementStepsArray;
window.simplifyExpression = simplifyExpression;
window.getEquationResult = getEquationResult;
window.isFinalEquation = isFinalEquation;
window.evaluateStartEquation = evaluateStartEquation;
window.evaluateRearrangementStep = evaluateRearrangementStep;
window.performRearrangementStep = performRearrangementStep;
