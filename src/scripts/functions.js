function evaluateStartEquations(leftEquationPart, rightEquationPart) {
  let result = {
  	"left" : true,
  	"right" : true,
  	"errorMessages" : []
  }

  if (leftEquationPart == "") {
    result.left = false;
    result.errorMessages.push(
      "Der linke Teil der Gleichung darf nicht leer sein."
    );
  }

  if (rightEquationPart == "") {
    result.right = false;
    result.errorMessages.push(
      "Der rechte Teil der Gleichung darf nicht leer sein."
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
