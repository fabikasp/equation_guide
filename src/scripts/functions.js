const mathsteps = require("mathsteps");
const nerdamer = require("nerdamer/all.min");
let rearrangementSteps = [];
let lastOperations = [];
let wrongCounter = 0;
let adviceButtonClickCounter = 0;
let rearrangementStepsGenerated = true;

/* Simplifies an expression with the help of nerdamer or mathsteps
* The function returns an expression */
function simplifyExpression(expression) {
  /* If the expression includes sqrt or ^, nerdamer is used to simplify the expression, because mathsteps can't handle those operators */
  if (expression.includes("sqrt") || expression.includes("^")) {
    try {
      return nerdamer("simplify(" + expression + ")").toString().replace(/\s/g, "");
    } catch (e) {
      return expression.replace(/\s/g, "");
    }
    /* If the expression doesn't include sqrt or ^, mathsteps is used to simplify the expression */
  } else {
    const steps = mathsteps.simplifyExpression(expression);
    /* If the output of mathsteps.simplifyExpression is 0 (array.length) the expression can not be further simplified and is returned */
    if (steps.length === 0) {
      return expression.replace(/\s/g, "");
    } else {
      /* Otherwise the expression is extracted out of the steps array that mathsteps generates and is returned */
      return (steps[steps.length - 1].newNode.toString()).replace(/\s/g, "");
    }
  }
}

/* Get nerdamer result for equation */
function getEquationResult(leftEquationPart, rightEquationPart, variable) {
  leftEquationPart = leftEquationPart.replace(",", ".");
  rightEquationPart = rightEquationPart.replace(",", ".");

  return nerdamer.solveEquations(
    leftEquationPart + "=" + rightEquationPart,
    variable
  ).toString().replace(/\s/g, "");
}

/* Checks if given equation is already solved */
function isFinalEquation(leftEquationPart, rightEquationPart, variable) {
  try {
    /* If variable or abs(variable) is only string in one equation part and the other equation part does not contain the variable the equation is solved */
    if (
      (leftEquationPart === variable || leftEquationPart === "abs(" + variable + ")")
      && !rightEquationPart.includes(variable)
      || (rightEquationPart === variable || rightEquationPart === "abs(" + variable + ")")
      && !leftEquationPart.includes(variable)
    ) {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
}

/* Transform "abs(x) = y" into "x = y, -y" */
function dissolveAbs(leftEquationPart, rightEquationPart, variable) {
  result = {
    "leftEquationPart": leftEquationPart,
    "rightEquationPart": rightEquationPart
  };

  if (isFinalEquation(leftEquationPart, rightEquationPart, variable)) {
    if (leftEquationPart === "abs(" + variable + ")") {
      result.leftEquationPart = variable;
      result.rightEquationPart += ", " + simplifyExpression("-(" + result.rightEquationPart + ")");
    } else if (rightEquationPart === "abs(" + variable + ")") {
      result.rightEquationPart = variable;
      result.leftEquationPart += ", " + simplifyExpression("-(" + result.leftEquationPart + ")");
    }
  }

  return result;
}

/* Returns start equation validation information and the simplified equation */
function evaluateStartEquation(leftEquationPart, rightEquationPart, variable) {
  let result = {
    "leftEquationValid": true,
    "rightEquationValid": true,
    "variableValid": true,
    "leftEquationPart": leftEquationPart,
    "rightEquationPart": rightEquationPart,
    "errorMessages": []
  };

  try {
    if (leftEquationPart === "") {
      result.leftEquationValid = false;
      result.errorMessages.push(
        "Der linke Teil der Gleichung darf nicht leer sein."
      );
    } else if (leftEquationPart.includes("=")) {
      result.leftEquationValid = false;
      result.errorMessages.push(
        "Der linke Teil der Gleichung darf kein Gleichheitszeichen enthalten."
      );
    /* If left equation part contains power */
    } else if (leftEquationPart.includes("^")) {
      countPowerSymbols = leftEquationPart.split("^").length - 1;
      countSquarePowers = leftEquationPart.split("^2").length - 1;

      /* If number of square powers and number of powers is not equal the equation is invalid */
      if (countPowerSymbols != countSquarePowers) {
        result.leftEquationValid = false;
        result.errorMessages.push(
          "Der linke Teil der Gleichung darf keine Exponenten ungleich 2 enthalten."
        );
      }
    /* Regex verification */
    } else if ((/([^0-9A-Za-z+*\/\-^\s(sqrt)().,])/g).test(leftEquationPart)) {
      result.leftEquationValid = false;
      result.errorMessages.push(
        "Der linke Teil der Gleichung darf keine unzulässigen Zeichen enthalten."
      );
    }

    if (rightEquationPart === "") {
      result.rightEquationValid = false;
      result.errorMessages.push(
        "Der rechte Teil der Gleichung darf nicht leer sein."
      );
    } else if (rightEquationPart.includes("=")) {
      result.rightEquationValid = false;
      result.errorMessages.push(
        "Der rechte Teil der Gleichung darf kein Gleichheitszeichen enthalten."
      );
    /* If right equation part contains power */
    } else if (rightEquationPart.includes("^")) {
      countPowerSymbols = rightEquationPart.split("^").length - 1;
      countSquarePowers = rightEquationPart.split("^2").length - 1;

      /* If number of square powers and number of powers is not equal the equation is invalid */
      if (countPowerSymbols != countSquarePowers) {
        result.rightEquationValid = false;
        result.errorMessages.push(
          "Der rechte Teil der Gleichung darf keine Exponenten ungleich 2 enthalten."
        );
      }
    /* Regex verification */
    } else if ((/([^0-9A-Za-z+*\/\-^\s(sqrt)().,])/g).test(rightEquationPart)) {
      result.rightEquationValid = false;
      result.errorMessages.push(
        "Der rechte Teil der Gleichung darf keine unzulässigen Zeichen enthalten."
      );
    }

    if (variable === "") {
      result.variableValid = false;
      result.errorMessages.push(
        "Die Zielvariable darf nicht leer sein."
      );
    /* If variable contains more than one char */
    } else if (variable.length != 1) {
      result.variableValid = false;
      result.errorMessages.push(
        "Die Zielvariable darf nur ein Zeichen enthalten."
      );
    /* Regex verification */
    } else if (!variable.match("[a-zA-Z]")) {
      result.variableValid = false;
      result.errorMessages.push(
        "Die Zielvariable muss ein Klein- oder Großbuchstabe (a-z, A-Z) sein."
      );
    /* If variable is not included in equation the equation is invalid */
    } else if (
      !leftEquationPart.includes(variable)
      && !rightEquationPart.includes(variable)
    ) {
      result.variableValid = false;
      result.errorMessages.push(
        "Die Zielvariable muss in der Gleichung vorkommen."
      );
    }
  /* The equation is invalid if an exception is thrown */
  } catch (e) {
    result.leftEquationValid = false;
    result.rightEquationValid = false;
    result.variableValid = false;
    result.errorMessages.push("Die Gleichung wird nicht unterstützt.");
  }

  /* Simplify equation after basic validations */
  leftEquationPart = simplifyExpression(leftEquationPart);
  rightEquationPart = simplifyExpression(rightEquationPart);

  result.leftEquationPart = leftEquationPart;
  result.rightEquationPart = rightEquationPart;

  /* If equation passed basic validations */
  if (result.errorMessages.length === 0) {
    try {
      equationResult = getEquationResult(
        leftEquationPart,
        rightEquationPart,
        variable
      );

      if (!equationResult) {
        throw new Error();
      }

      /* If the equation is already solved it is invalid */
      if (
        isFinalEquation(leftEquationPart, rightEquationPart, variable)
        || leftEquationPart === rightEquationPart
      ) {
        result.leftEquationValid = false;
        result.rightEquationValid = false;
        result.variableValid = false;
        result.errorMessages.push("Die Gleichung ist bereits gelöst.");
      }
    /* If equation result is empty or flawed the equation is invalid */
    } catch (e) {
      result.leftEquationValid = false;
      result.rightEquationValid = false;
      result.variableValid = false;
      result.errorMessages.push("Die Gleichung wird nicht unterstützt.");
    }
  }

  return result;
}

/* Returns an empty string or an error message after rearrangement step validation */
function evaluateRearrangementStep(
  leftEquationPart,
  rightEquationPart,
  arithmeticOperation,
  rearrangementStep
) {
  if (rearrangementStep === "") {
    /* Rearrangement step can only be empty when arithmetic operation is power or sqrt */
    if (!["^2", "sqrt"].includes(arithmeticOperation)) {
      return "Der Umformungsschritt darf nicht leer sein.";
    }
  } else if (rearrangementStep.includes("=")) {
    return "Der Umformungsschritt darf kein Gleichheitszeichen enthalten.";
  /* Multiplication with 0 is not allowed */
  } else if (rearrangementStep === "0" && arithmeticOperation === "*") {
    return "Die Multiplikation mit 0 wird nicht unterstützt.";
  /* Division by 0 is not allowed */
  } else if (rearrangementStep === "0" && arithmeticOperation === "/") {
    return "Die Division durch 0 wird nicht unterstützt.";
  }

  if (arithmeticOperation === "sqrt") {
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

  /* Regex verification */
  if (
    (/([^0-9A-Za-z+*\/\-^\s(sqrt)().,])/g).test(leftRearrangementStep)
    || (/([^0-9A-Za-z+*\/\-^\s(sqrt)().,])/g).test(rightRearrangementStep)
  ) {
    return "Der Umformungsschritt wird nicht unterstützt.";
  }

  /* If rearrangement step is validated successfully it will be added to the operations array */
  lastOperations.push({type: arithmeticOperation, value: rearrangementStep});

  return "";
}

/* Perform rearrangement step on given equation part */
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

/* The function generates an array that stores the perfect rearrangement steps for the current equation */
function generateRearrangementStepsArray(leftEquationPart, rightEquationPart, variable) {
  rearrangementStepsGenerated = true;
  rearrangementSteps = []
  const equation = leftEquationPart + "=" + rightEquationPart;

  /* mathsteps.solveEquation generates an array with each step to solve the equation */
  const steps = mathsteps.solveEquation(equation);

  /* With the help of switch-cases it is determined what step need to be added to the rearrangementArray
  *  Only relevant steps are considered
  *  Only simple rearrangment steps are considered, such as -5 or -2/3
  *  More complex rearrangment steps are very difficult to extract of the steps structure, due to the missing documentation
  *  More complex rearrangment steps lead to the rearrangementStepsGenerated boolean to be set false, which leads to consequences in the feedback and advice section */
  steps.forEach(step => {
    switch (step.changeType) {
      /* Handles addition */
      case "ADD_TO_BOTH_SIDES":
        if (step.newEquation.leftNode.args[1].value !== undefined) {
          rearrangementSteps.push({type: "add", value: step.newEquation.leftNode.args[1].value});
        } else if (step.newEquation.leftNode.args[1].args !== undefined) {
          rearrangementSteps.push({
            type: "add",
            value: step.newEquation.leftNode.args[1].args[0] + "/" + step.newEquation.leftNode.args[1].args[1]
          });
        } else {
          rearrangementStepsGenerated = false;
        }
        break;
      /* Handles subtraction */
      case "SUBTRACT_FROM_BOTH_SIDES":
        if (step.newEquation.leftNode.args[1].value !== undefined) {
          rearrangementSteps.push({type: "subtract", value: step.newEquation.leftNode.args[1].value});
        } else if (step.newEquation.leftNode.args[1].args !== undefined) {
          rearrangementSteps.push({
            type: "subtract",
            value: step.newEquation.leftNode.args[1].args[0] + "/" + step.newEquation.leftNode.args[1].args[1]
          });
        } else {
          rearrangementStepsGenerated = false;
        }
        break;
      /* Handles multiplication by inverse fraction */
      case "MULTIPLY_BOTH_SIDES_BY_INVERSE_FRACTION":
        if (step.newEquation.leftNode.args[1].value !== undefined) {
          rearrangementSteps.push({type: "multiply", value: step.newEquation.leftNode.args[1].value});
        } else if (step.newEquation.leftNode.args[1].args !== undefined) {
          rearrangementSteps.push({
            type: "multiply",
            value: step.newEquation.leftNode.args[1].args[0] + "/" + step.newEquation.leftNode.args[1].args[1]
          });
        } else {
          rearrangementStepsGenerated = false;
        }
        break;
      /* Handles multiplication */
      case "MULTIPLY_TO_BOTH_SIDES":
        if (step.newEquation.leftNode.args[1].value !== undefined) {
          rearrangementSteps.push({type: "multiply", value: step.newEquation.leftNode.args[1].value});
        } else if (step.newEquation.leftNode.args[1].args !== undefined) {
          rearrangementSteps.push({
            type: "multiply",
            value: step.newEquation.leftNode.args[1].args[0] + "/" + step.newEquation.leftNode.args[1].args[1]
          });
        } else {
          rearrangementStepsGenerated = false;
        }
        break;
      /* Handles division */
      case "DIVIDE_FROM_BOTH_SIDES":
        if (step.newEquation.leftNode.args[1].value !== undefined) {
          rearrangementSteps.push({type: "divide", value: step.newEquation.leftNode.args[1].value});
        } else if (step.newEquation.leftNode.args[1].args !== undefined) {
          rearrangementSteps.push({
            type: "divide",
            value: step.newEquation.leftNode.args[1].args[0] + "/" + step.newEquation.leftNode.args[1].args[1]
          });
        } else {
          rearrangementStepsGenerated = false;
        }
        break;
      /* Handles find roots */
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

/* Generates feedback messages depending on mathsteps feedback array or equation characteristics */
function generateFeedbackMessage(
  leftEquationPart,
  rightEquationPart,
  variable,
  arithmeticOperation,
  rearrangementStep
) {
  /* If mathsteps feedback array could not be generated feedback is not possible */
  if (!rearrangementStepsGenerated) {
    return {message: "Leider kann für diese Art von Gleichungen kein Feedback gegeben werden.", type: "info"}
  }

  /* If only nerdamer can give feedback */
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

  /* If mathsteps can give feedback */
  return generateMathstepsFeedbackMessage(arithmeticOperation, rearrangementStep);
}

/* Generates feedback on the current operation, based on the steps generated by mathsteps
*  The function returns a feedbackMessage object, which includes a message and a type (for the alert display) */
function generateMathstepsFeedbackMessage(arithmeticOperation, rearrangementStep) {
  let feedbackMessage = {};
  let arrayElement;
  const arithmeticOperatorToString = new Map([["+", "add"], ["-", "subtract"], ["*", "multiply"], ["/", "divide"]]);

  /* Search the rearrangmentSteps array for a matching operation (arithmetic operator of current operation is included in array) */
  arrayElement = rearrangementSteps.find(e => e.type === arithmeticOperatorToString.get(arithmeticOperation));

  /* If nothing was found, it is assumed that it was not a optimal rearrangement step
  *  Send a feedback message to the user */
  if (arrayElement === undefined) {
    wrongCounter += 1;
    feedbackMessage = {
      message: "Das war leider kein optimaler Umformungsschritt. Du kannst den Schritt rückgängig oder einfach weiter machen.",
      type: "warning"
    }
  } else {
    /* If the arithmetic operator was found and the rearrangmentStep matches the value of the found arrayElement a optimal rearrangement step was found
    *  Send a feedback message to the user */
    if (Number(rearrangementStep) === Number(arrayElement.value)) {
      if (rearrangementSteps.length > 1) {
        wrongCounter = 0;
        feedbackMessage = {
          message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
          type: "info"
        }
      }
      /* If the arithmetic operator does not match the value of the arrayElement a correct operation was made but not with the correct value
      *  Send a feedback message to the user */
    } else {
      wrongCounter += 1;
      feedbackMessage = {
        message: "Gut! Das ist der richtige Weg, aber versuch es vielleicht mit einem anderen Wert.",
        type: "warning"
      }
    }
  }

  /* Returns the feedback message that was generated during the function */
  return feedbackMessage;
}

/* Generates a feedback message for equations containing power or sqrt */
function generateNerdamerFeedbackMessage(
  leftEquationPart,
  rightEquationPart,
  variable,
  arithmeticOperation,
  rearrangementStep
) {
  let optimalRearrangementStep = false;

  /* If no other arithmetic operation than root is useful and arithmetic operation is sqrt it is an optimal step */
  if (rootIsNecessary(leftEquationPart, rightEquationPart, variable) && arithmeticOperation === "sqrt") {
    optimalRearrangementStep = true;
  }

  /* If no other arithmetic operation than power is useful and arithmetic operation is power it is an optimal step */
  if (powerIsNecessary(leftEquationPart, rightEquationPart, variable) && arithmeticOperation === "^2") {
    optimalRearrangementStep = true;
  }

  /* If arithmetic operation is not sqrt or power and it is no optimal rearrangement step yet the result is final */
  if (!optimalRearrangementStep && !["sqrt", "^2"].includes(arithmeticOperation)) {
    /* Count numbers in both equation parts before and after rearrangement step */
    countLeftNumbersBeforeRearrangement = leftEquationPart.replace(/[^0-9]/g, "").length;
    countRightNumbersBeforeRearrangement = rightEquationPart.replace(/[^0-9]/g, "").length;

    rearrangedLeftEquationPart = performRearrangementStep(leftEquationPart, arithmeticOperation, rearrangementStep);
    rearrangedRightEquationPart = performRearrangementStep(rightEquationPart, arithmeticOperation, rearrangementStep);

    countLeftNumbersAfterRearrangement = rearrangedLeftEquationPart.replace(/[^0-9]/g, "").length;
    countRightNumbersAfterRearrangement = rearrangedRightEquationPart.replace(/[^0-9]/g, "").length;

    /* Check if amount of left numbers has reduced after rearrangement step when variable is only in left part */
    if (
      leftEquationPart.includes(variable)
      && !rightEquationPart.includes(variable)
      && countLeftNumbersAfterRearrangement < countLeftNumbersBeforeRearrangement
    ) {
      optimalRearrangementStep = true;
    }

    /* Check if amount of right numbers has reduced after rearrangement step when variable is only in right part */
    if (
      rightEquationPart.includes(variable)
      && !leftEquationPart.includes(variable)
      && countRightNumbersAfterRearrangement < countRightNumbersBeforeRearrangement
    ) {
      optimalRearrangementStep = true;
    }

    if (leftEquationPart.includes(variable) && rightEquationPart.includes(variable)) {
      /* If only one part contains variable after rearrangement step it is an optimal step */
      if (
        rearrangedLeftEquationPart.includes(variable)
        && !rearrangedRightEquationPart.includes(variable)
      ) {
        optimalRearrangementStep = true;
      }

      /* Check if amount of left numbers has reduced after rearrangement step when variable is in left part */
      if (
        rearrangedLeftEquationPart.includes(variable)
        && countLeftNumbersAfterRearrangement < countLeftNumbersBeforeRearrangement
      ) {
        optimalRearrangementStep = true;
      }

      /* If only one part contains variable after rearrangement step it is an optimal step */
      if (
        rearrangedRightEquationPart.includes(variable)
        && !rearrangedLeftEquationPart.includes(variable)
      ) {
        optimalRearrangementStep = true;
      }

      /* Check if amount of right numbers has reduced after rearrangement step when variable is in right part */
      if (
        rearrangedRightEquationPart.includes(variable)
        && countRightNumbersAfterRearrangement < countRightNumbersBeforeRearrangement
      ) {
        optimalRearrangementStep = true;
      }
    }
  }

  /* Return feedback depending on whether the step is optimal */
  if (optimalRearrangementStep) {
    adviceButtonClickCounter = 0;

    return {
      message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
      type: "info"
    };
  }

  return {
    message: "Das war leider kein optimaler Umformungsschritt. Du kannst den Schritt rückgängig oder einfach weiter machen.",
    type: "warning"
  };
}

/* Deletes last operation out of array */
function resetLastOperation() {
  lastOperations.pop();
}

/* Returns amount of saved operations */
function getLastOperationsLength() {
  return lastOperations.length;
}

/* Returns an advice message depending on the equation */
function getAdviceMessage(leftEquationPart, rightEquationPart, variable) {
  /* Increase the amount of tip button clicks */
  adviceButtonClickCounter += 1;

  if (equationContainsRoot(leftEquationPart, rightEquationPart)) {
    /* Nerdamer section */
    /* If the user clicks the tip button less than 2 times no useful tip is returned */
    if (adviceButtonClickCounter < 2) {
      return "Versuch es erst einmal selbst.";
    }

    /* If power is the only useful operation the user should use power as arithmetic operation */
    if (powerIsNecessary(leftEquationPart, rightEquationPart, variable)) {
      return "Versuch es doch mal mit Potenzieren";
    } else {
      return "Versuch es erst einmal ohne Potenzieren"
    }
  } else if (equationContainsPower(leftEquationPart, rightEquationPart)) {
    /* If the user clicks the tip button less than 2 times no useful tip is returned */
    if (adviceButtonClickCounter < 2) {
      return "Versuch es erst einmal selbst.";
    }

    /* If root is the only useful operation the user should use root as arithmetic operation */
    if (rootIsNecessary(leftEquationPart, rightEquationPart, variable)) {
      return "Versuch es doch mal mit Wurzelziehen";
    } else {
      return "Versuch es erst einmal ohne Wurzelziehen"
    }
  }

  /* mathsteps section */

  /* if the rearrangementStepsGenerated boolean is false, the generateRearragnementSteps function was unable to generate the optimal rearrangment steps */
  if (!rearrangementStepsGenerated) {
    return "Leider können für diese Art von Gleichungen keine Tipps gegeben werden.";
  }

  /* if rearrgementSteps length is equal to zero, the equation is already solved */
  if (rearrangementSteps.length === 0) {
    return "Du hast die Gleichung bereits gelöst.";
  } else {
    switch (true) {
      /* if the user did less than 2 wrong attempts the message is to first keep trying */
      case (wrongCounter < 2):
        return "Versuch es erst einmal selbst.";
      /* if the user did 2 or 3 wrong attempts, they get a weak feedback generated by the getAdvice function */
      case (wrongCounter < 4):
        return getAdvice("weak");
      /* if the user did more than 3 wrong attempts, they get a strong feedback generated by the getAdvice function */
      default:
        return getAdvice("strong");
    }
  }
}

/* Returns a feedback message depending on the type that is requested (weak or strong) */
function getAdvice(type) {
  switch (type) {
    /* A random entry of the rearragementSteps array is chosen
    *  Since the type is weak, only the type is being considered
    *  Depending on the type, the feedback message is generated and returned
    *  The feedback message only includes information about the type of the rearrangement step (e.g. add or subtract) */
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
    /* A random entry of the rearragementSteps array is chosen
    *  Since the type is strong, the whole entry is being considered (type and value)
    *  Depending on the type, the feedback message is generated and returned
    *  The feedback message includes information about the type and the value of the rearrangement step (e.g. add 5 or subtract 13) */
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

/* Get random integer value between min and max value */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/* Returns if equation contains sqrt or not */
function equationContainsRoot(leftEquationPart, rightEquationPart) {
  return leftEquationPart.includes("sqrt") || rightEquationPart.includes("sqrt");
}

/* Returns if equation contains power or not */
function equationContainsPower(leftEquationPart, rightEquationPart) {
  return leftEquationPart.includes("^2") || rightEquationPart.includes("^2");
}

/* Checks if root is the only useful arithmetic operation */
function rootIsNecessary(leftEquationPart, rightEquationPart, variable) {
  if (!equationContainsPower(leftEquationPart, rightEquationPart)) {
    return false;
  }

  /* If equation has the shape "x^2=y" root is necessary */
  if (leftEquationPart === variable + "^2") {
    return true;
  }

  /* If equation has the shape "(x+y+z)^2=g" and the variable is included in the bracket root is necessary */
  if ((/^\([0-9A-Za-z+*\/\-^\s(sqrt)().,]+\)\^2$/g).test(leftEquationPart)) {
    if (leftEquationPart.includes(variable)) {
      return true;
    }
  }

  /* If equation has the shape "x^2=y" root is necessary */
  if (rightEquationPart === variable + "^2") {
    return true;
  }

  /* If equation has the shape "(x+y+z)^2=g" and the variable is included in the bracket root is necessary */
  if ((/^\([0-9A-Za-z+*\/\-^\s(sqrt)().,]+\)\^2$/g).test(rightEquationPart)) {
    if (rightEquationPart.includes(variable)) {
      return true;
    }
  }

  return false;
}

/* Checks if power is the only useful arithmetic operation */
function powerIsNecessary(leftEquationPart, rightEquationPart, variable) {
  if (!equationContainsRoot(leftEquationPart, rightEquationPart)) {
    return false;
  }

  /* If equation has the shape "sqrt(x)=y" power is necessary */
  if (leftEquationPart === "sqrt(" + variable + ")") {
    return true;
  }

  /* If equation has the shape "sqrt(x+y+z)=g" and the variable is included in the bracket power is necessary */
  if ((/^sqrt\([0-9A-Za-z+*\/\-^\s(sqrt)().,]+\)$/g).test(leftEquationPart)) {
    if (leftEquationPart.includes(variable)) {
      return true;
    }
  }

  /* If equation has the shape "sqrt(x)=y" power is necessary */
  if (rightEquationPart === "sqrt(" + variable + ")") {
    return true;
  }

  /* If equation has the shape "sqrt(x+y+z)=g" and the variable is included in the bracket power is necessary */
  if ((/^sqrt\([0-9A-Za-z+*\/\-^\s(sqrt)().,]+\)$/g).test(rightEquationPart)) {
    if (rightEquationPart.includes(variable)) {
      return true;
    }
  }

  return false;
}

/* assign wrong counter value 0 due to equation restart or something like that */
function resetWrongCounter() {
  wrongCounter = 0;
}

/* assign advice button click counter value 0 due to equation restart or something like that */
function resetAdviceButtonClickCounter() {
  adviceButtonClickCounter = 0;
}

/* Getter for mathsteps feedback array */
function getRearrangementStepsArray() {
  return rearrangementSteps;
}

/* Getter for the information whether mathsteps feedback array has been generated or not */
function getRearrangementStepsGenerated() {
  return rearrangementStepsGenerated;
}

/* Make functions available for other files */
window.simplifyExpression = simplifyExpression;
window.getEquationResult = getEquationResult;
window.isFinalEquation = isFinalEquation;
window.dissolveAbs = dissolveAbs;
window.evaluateStartEquation = evaluateStartEquation;
window.evaluateRearrangementStep = evaluateRearrangementStep;
window.performRearrangementStep = performRearrangementStep;
window.generateRearrangementStepsArray = generateRearrangementStepsArray;
window.generateFeedbackMessage = generateFeedbackMessage;
window.resetLastOperation = resetLastOperation;
window.getLastOperationsLength = getLastOperationsLength;
window.getAdviceMessage = getAdviceMessage;
window.equationContainsRoot = equationContainsRoot;
window.equationContainsPower = equationContainsPower;
window.rootIsNecessary = rootIsNecessary;
window.powerIsNecessary = powerIsNecessary;
window.resetWrongCounter = resetWrongCounter;
window.resetAdviceButtonClickCounter = resetAdviceButtonClickCounter;
window.getRearrangementStepsArray = getRearrangementStepsArray;
window.getRearrangementStepsGenerated = getRearrangementStepsGenerated;
