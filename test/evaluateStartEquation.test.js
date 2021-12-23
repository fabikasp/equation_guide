/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

/* test validation of left equation part */

test("equation with empty left equation part", () => {
  const expectedResult = {
    "leftEquationValid": false,
    "rightEquationValid": true,
    "variableValid": true,
    "errorMessages": ["Der linke Teil der Gleichung darf nicht leer sein."]
  };

  expect(evaluateStartEquation("", "200x", "x")).toStrictEqual(expectedResult);
});

test("equation with equal sign in left equation part", () => {
  const expectedResult = {
    "leftEquationValid": false,
    "rightEquationValid": true,
    "variableValid": true,
    "errorMessages": ["Der linke Teil der Gleichung darf kein Gleichheitszeichen enthalten."]
  };

  expect(evaluateStartEquation("2=x", "200x", "x")).toStrictEqual(expectedResult);
});

test("equation with ^3 in left equation part", () => {
  const expectedResult = {
    "leftEquationValid": false,
    "rightEquationValid": true,
    "variableValid": true,
    "errorMessages": ["Der linke Teil der Gleichung darf keine Exponenten ungleich 2 enthalten."]
  };

  expect(evaluateStartEquation("x^3", "200x", "x")).toStrictEqual(expectedResult);
});

test("equation with float power in left equation part", () => {
  const expectedResult = {
    "leftEquationValid": false,
    "rightEquationValid": true,
    "variableValid": true,
    "errorMessages": ["Der linke Teil der Gleichung darf keine Exponenten ungleich 2 enthalten."]
  };

  expect(evaluateStartEquation("x^1.3", "200x", "x")).toStrictEqual(expectedResult);
});

test("equation with forbidden characters in left equation part", () => {
  const expectedResult = {
    "leftEquationValid": false,
    "rightEquationValid": true,
    "variableValid": true,
    "errorMessages": ["Der linke Teil der Gleichung darf keine unzulässigen Zeichen enthalten."]
  };

  expect(evaluateStartEquation("2&&&x", "200x", "x")).toStrictEqual(expectedResult);
});

/* test validation of right equation part */

test("equation with empty right equation part", () => {
  const expectedResult = {
    "leftEquationValid": true,
    "rightEquationValid": false,
    "variableValid": true,
    "errorMessages": ["Der rechte Teil der Gleichung darf nicht leer sein."]
  };

  expect(evaluateStartEquation("100x", "", "x")).toStrictEqual(expectedResult);
});

test("equation with equal sign in right equation part", () => {
  const expectedResult = {
    "leftEquationValid": true,
    "rightEquationValid": false,
    "variableValid": true,
    "errorMessages": ["Der rechte Teil der Gleichung darf kein Gleichheitszeichen enthalten."]
  };

  expect(evaluateStartEquation("100x", "2=x", "x")).toStrictEqual(expectedResult);
});

test("equation with ^5 in right equation part", () => {
  const expectedResult = {
    "leftEquationValid": true,
    "rightEquationValid": false,
    "variableValid": true,
    "errorMessages": ["Der rechte Teil der Gleichung darf keine Exponenten ungleich 2 enthalten."]
  };

  expect(evaluateStartEquation("100x", "x^5", "x")).toStrictEqual(expectedResult);
});

test("equation with float power in right equation part", () => {
  const expectedResult = {
    "leftEquationValid": true,
    "rightEquationValid": false,
    "variableValid": true,
    "errorMessages": ["Der rechte Teil der Gleichung darf keine Exponenten ungleich 2 enthalten."]
  };

  expect(evaluateStartEquation("100x", "x^3.4", "x")).toStrictEqual(expectedResult);
});

test("equation with forbidden characters in right equation part", () => {
  const expectedResult = {
    "leftEquationValid": true,
    "rightEquationValid": false,
    "variableValid": true,
    "errorMessages": ["Der rechte Teil der Gleichung darf keine unzulässigen Zeichen enthalten."]
  };

  expect(evaluateStartEquation("200", "2§$x", "x")).toStrictEqual(expectedResult);
});

/* test validation of variable */

test("equation with empty variable", () => {
  const expectedResult = {
    "leftEquationValid": true,
    "rightEquationValid": true,
    "variableValid": false,
    "errorMessages": ["Die Zielvariable darf nicht leer sein."]
  };

  expect(evaluateStartEquation("200", "20x", "")).toStrictEqual(expectedResult);
});

test("equation with variable with more than one character", () => {
  const expectedResult = {
    "leftEquationValid": true,
    "rightEquationValid": true,
    "variableValid": false,
    "errorMessages": ["Die Zielvariable darf nur ein Zeichen enthalten."]
  };

  expect(evaluateStartEquation("200", "20x", "xy")).toStrictEqual(expectedResult);
});

test("equation with variable with invalid characters", () => {
  const expectedResult = {
    "leftEquationValid": true,
    "rightEquationValid": true,
    "variableValid": false,
    "errorMessages": ["Die Zielvariable muss ein Klein- oder Großbuchstabe (a-z, A-Z) sein."]
  };

  expect(evaluateStartEquation("200", "20x", "5")).toStrictEqual(expectedResult);
});

test("equation with unreferenced variable", () => {
  const expectedResult = {
    "leftEquationValid": true,
    "rightEquationValid": true,
    "variableValid": false,
    "errorMessages": ["Die Zielvariable muss in der Gleichung vorkommen."]
  };

  expect(evaluateStartEquation("200", "20x", "y")).toStrictEqual(expectedResult);
});

/* hybrid test */

test("equation with multiple validation errors", () => {
  const expectedResult = {
    "leftEquationValid": false,
    "rightEquationValid": false,
    "variableValid": false,
    "errorMessages": [
      "Der linke Teil der Gleichung darf kein Gleichheitszeichen enthalten.",
      "Der rechte Teil der Gleichung darf keine unzulässigen Zeichen enthalten.",
      "Die Zielvariable muss in der Gleichung vorkommen."
    ]
  };

  expect(evaluateStartEquation("2=2", "15&&x", "z")).toStrictEqual(expectedResult);
});

/* test higher validations */

test("equation with nerdamer solution error", () => {
  const expectedResult = {
    "leftEquationValid": false,
    "rightEquationValid": false,
    "variableValid": false,
    "errorMessages": ["Die Gleichung wird nicht unterstützt."]
  };

  expect(evaluateStartEquation("20x+200", "20x+300", "x")).toStrictEqual(expectedResult);
});

test("already solved equation due to identical equation parts", () => {
  const expectedResult = {
    "leftEquationValid": false,
    "rightEquationValid": false,
    "variableValid": false,
    "errorMessages": ["Die Gleichung ist bereits gelöst."]
  };

  expect(evaluateStartEquation("20x", "20x", "x")).toStrictEqual(expectedResult);
});

test("already solved equation due to completely simplified equation", () => {
  const expectedResult = {
    "leftEquationValid": false,
    "rightEquationValid": false,
    "variableValid": false,
    "errorMessages": ["Die Gleichung ist bereits gelöst."]
  };

  expect(evaluateStartEquation("50x/50", "300y", "x")).toStrictEqual(expectedResult);
});

/* test success case */

test("successfully validated equation", () => {
  const expectedResult = {
    "leftEquationValid": true,
    "rightEquationValid": true,
    "variableValid": true,
    "errorMessages": []
  };

  expect(evaluateStartEquation("20(x+200y+300)", "200+10x", "x")).toStrictEqual(expectedResult);
});
