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

      if (equationResult == "") {
        throw new Error("Die Gleichung ist nicht lösbar");
      }
    } catch (e) {
      result.leftEquationValid = false;
      result.rightEquationValid = false;
      result.variableValid = false;
      result.errorMessages.push(e.message);
    }
  }

  return result;
}

function rearrangementIsValid() {
  // Validierung

  return true;
}

function performRearrangement() {
  // Umformung
}
