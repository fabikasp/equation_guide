const mathsteps = require("mathsteps");
let rearrangementSteps = []

function mathstepsTestFunction() {
  console.log(rearrangementSteps);

  /*const steps = mathsteps.solveEquation('3*x+14=4'); //x^2+4x+6=0

  steps.forEach(step => {
    console.log("before change: " + step.oldEquation.ascii());  // e.g. before change: 2x + 3x = 35
    console.log("change: " + step.changeType);                  // e.g. change: SIMPLIFY_LEFT_SIDE
    console.log("after change: " + step.newEquation.ascii());   // e.g. after change: 5x = 35
    console.log("# of substeps: " + step.substeps.length);      // e.g. # of substeps: 2
  });*/
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

function generateRearrangementStepsArray(leftEquationPart, rightEquationPart, variable) {
  rearrangementSteps = []
  const equation = leftEquationPart + '=' + rightEquationPart;

  const steps = mathsteps.solveEquation(equation);

  steps.forEach(step => {
    //console.log(step.changeType);

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
      message: "Das war leider nicht der richtige Umformungsschritt. Du kannst es nochmal versuchen oder einfach weitermachen!",
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
  editRearrangementStepsArray(arithmeticOperatorToString.get(arithmeticOperation), rearrangementStep);
  return feedbackMessage;
}

function editRearrangementStepsArray(arithmeticOperator, rearrangementStep) {
  console.log(rearrangementSteps);
  rearrangementSteps = rearrangementSteps.filter(e => {
    if (e.type !== arithmeticOperator || e.value - rearrangementStep !== 0) {
      return e;
    }
  });

  switch (arithmeticOperator) {
    case "add":
      rearrangementSteps.map(e => {
        if (e.type === "add") {
          e.value = Number(e.value) - Number(rearrangementStep);
        }
        if (e.type === "subtract") {
          e.value = Number(e.value) + Number(rearrangementStep);
        }
      });
      break;
    case "subtract":
      rearrangementSteps.map(e => {
        if (e.type === "subtract") {
          e.value = Number(e.value) - Number(rearrangementStep);
        }
        if (e.type === "add") {
          e.value = Number(e.value) + Number(rearrangementStep);
        }
      });
      break;
    case "multiply":
      rearrangementSteps.map(e => {
        if (e.type === "multiply") {
          e.value = Number(e.value) - Number(rearrangementStep);
        }
        if (e.type === "divide") {
          e.value = Number(e.value) + Number(rearrangementStep);
        }
      });
      break;
    case "divide":
      rearrangementSteps.map(e => {
        if (e.type === "divide") {
          e.value = Number(e.value) - Number(rearrangementStep);
        }
        if (e.type === "multiply") {
          e.value = Number(e.value) + Number(rearrangementStep);
        }
      });
      break;
  }
  console.log(rearrangementSteps);
}

window.generateFeedbackMessage = generateFeedbackMessage;
window.generateRearrangementStepsArray = generateRearrangementStepsArray;
window.mathstepsTestFunction = mathstepsTestFunction;
window.simplifyExpression = simplifyExpression;
window.isFinalEquation = isFinalEquation;
window.evaluateStartEquations = evaluateStartEquations;
window.evaluateRearrangementStep = evaluateRearrangementStep;
window.performRearrangementStep = performRearrangementStep;
