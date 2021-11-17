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
      "Die Variable, nach der umgeformt werden soll, darf nicht leer sein"
    );
  }

  if (leftEquationPart != "" && rightEquationPart != "" && variable != "") {
    try {
      if (leftEquationPart == rightEquationPart) {
        throw new Error("Die Gleichung ist nicht umformbar");
      }

      equationResult = nerdamer.solveEquations(
        leftEquationPart + "=" + rightEquationPart,
        variable
      );

      if (
        leftEquationPart == variable && rightEquationPart == equationResult
        || rightEquationPart == variable && leftEquationPart == equationResult
      ) {
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

function simplifyExpression(expression) {
  try {
    return nerdamer('simplify(' + expression + ')');
  } catch (e) {
    return expression;
  }
}

function rearrangementIsValid() {
  // Validierung

  return true;
}

function performRearrangement() {
  // Umformung
}
