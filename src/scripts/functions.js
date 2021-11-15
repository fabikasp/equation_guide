function evaluateStartEquations(leftEquationPart, rightEquationPart) {
  let result = {
  	"leftEquationValid" : true,
  	"rightEquationValid" : true,
  	"errorMessages" : []
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

  return result;
}

function rearrangementIsValid() {
  // Validierung

  return true;
}

function performRearrangement() {
  // Umformung
}
