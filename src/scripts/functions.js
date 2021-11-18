function simplifyExpression(expression) {
  try {
    return nerdamer("simplify(" + expression + ")");
  } catch (e) {
    return expression;
  }
}

function getEquationResult(leftEquationPart, rightEquationPart, variable) {
  return nerdamer.solveEquations(
    leftEquationPart + "=" + rightEquationPart,
    variable
  );
}

function isFinalEquation(leftEquationPart, rightEquationPart, variable) {
  try {
    if (
      leftEquationPart == variable && !rightEquationPart.contains(variable)
      || rightEquationPart == variable && !leftEquationPart.contains(variable)
    ) {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
}

function evaluateStartEquations(leftEquationPart, rightEquationPart, variable) {
  let result = {
  	"leftEquationValid": true,
  	"rightEquationValid": true,
    "variableValid": true,
  	"errorMessages": []
  }

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
  } else if (!(
    leftEquationPart.contains(variable)
    || rightEquationPart.contains(variable)
  )) {
    result.variableValid = false;
    result.errorMessages.push(
      "Die Zielvariable muss in der Gleichung vorkommen"
    );
  }

  if (
    result.leftEquationValid
    && result.rightEquationPart
    && result.variableValid
  ) {
    try {
      if (leftEquationPart == rightEquationPart) {
        throw new Error("Die Gleichung ist nicht umformbar");
      }

      equationResult = getEquationResult(
        leftEquationPart,
        rightEquationPart,
        variable
      );

      if (isFinalEquation(leftEquationPart, rightEquationPart, variable)) {
        throw new Error("Die Gleichung ist bereits gelöst");
      }

      if (equationResult == "") {
        throw new Error("Die Gleichung wird nicht unterstützt");
      }
    } catch (e) {
      if (e.name == "NerdamerValueError") {
        result.errorMessages.push("Die Gleichung wird nicht unterstützt");
      } else {
        result.errorMessages.push(e.message);
      }

      result.leftEquationValid = false;
      result.rightEquationValid = false;
      result.variableValid = false;
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
