/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

/* test nerdamer feedback */

test("nerdamer feedback with sqrt rearrangement on equation with ^2", () => {
  expectedResult = {
    message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
    type: "info"
  };

  expect(generateFeedbackMessage("2x^2+20", "200", "x", "sqrt", "")).toStrictEqual(expectedResult);
});

test("nerdamer feedback with ^2 rearrangement on equation with sqrt", () => {
  expectedResult = {
    message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
    type: "info"
  };

  expect(generateFeedbackMessage("sqrt(2x+20)", "200", "x", "^2", "")).toStrictEqual(expectedResult);
});

test("nerdamer feedback with operand reduction in left equation part", () => {
  expectedResult = {
    message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
    type: "info"
  };

  expect(generateFeedbackMessage("2x^2+20", "200", "x", "-", "20")).toStrictEqual(expectedResult);
});

test("nerdamer feedback with operand reduction in right equation part", () => {
  expectedResult = {
    message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
    type: "info"
  };

  expect(generateFeedbackMessage("500", "sqrt(30x)+70", "x", "-", "70")).toStrictEqual(expectedResult);
});

test("nerdamer feedback with variable elimination in right equation part", () => {
  expectedResult = {
    message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
    type: "info"
  };

  expect(generateFeedbackMessage("50x", "30x+sqrt(100+2y)", "x", "-", "30x")).toStrictEqual(expectedResult);
});

test("nerdamer feedback with variable elimination in left equation part", () => {
  expectedResult = {
    message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
    type: "info"
  };

  expect(generateFeedbackMessage("50x-sqrt(400+10z)", "70x+600", "x", "-", "50x")).toStrictEqual(expectedResult);
});

test("nerdamer feedback with operand reducation in left equation part with variable in both parts", () => {
  expectedResult = {
    message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
    type: "info"
  };

  expect(generateFeedbackMessage("50x-400+10z^2", "600x+20", "x", "+", "400")).toStrictEqual(expectedResult);
});

test("nerdamer feedback with operand reducation in right equation part with variable in both parts", () => {
  expectedResult = {
    message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
    type: "info"
  };

  expect(generateFeedbackMessage("50x+20y^2", "600x+20+5y", "x", "-", "5y")).toStrictEqual(expectedResult);
});

test("empty nerdamer feedback", () => {
  expectedResult = {};

  expect(generateFeedbackMessage("50x+50y^2+50", "620", "x", "-", "5")).toStrictEqual(expectedResult);
});

/* test mathsteps feedback */

test("optimal mathsteps feedback due to correct addition", () => {
  generateRearrangementStepsArray("2x-20", "200", "x");

  expectedResult = {
    message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
    type: "info"
  };

  expect(generateFeedbackMessage("2x-20", "200", "x", "+", "20")).toStrictEqual(expectedResult);
});

test("optimal mathsteps feedback due to correct subtraction", () => {
  generateRearrangementStepsArray("2x+20", "200", "x");

  expectedResult = {
    message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
    type: "info"
  };

  expect(generateFeedbackMessage("2x+20", "200", "x", "-", "20")).toStrictEqual(expectedResult);
});

test("optimal mathsteps feedback due to correct division", () => {
  generateRearrangementStepsArray("2x+50", "200", "x");

  expectedResult = {
    message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
    type: "info"
  };

  expect(generateFeedbackMessage("2x+50", "200", "x", "/", "2")).toStrictEqual(expectedResult);
});

test("optimal mathsteps feedback due to correct multiplication", () => {
  generateRearrangementStepsArray("x/2+50", "200", "x");

  expectedResult = {
    message: "Sehr gut! Du hast einen der optimalen Umformungsschritte gefunden.",
    type: "info"
  };

  expect(generateFeedbackMessage("x/2+50", "200", "x", "*", "2")).toStrictEqual(expectedResult);
});

test("good mathsteps feedback due to nearly correct addition", () => {
  generateRearrangementStepsArray("x-50", "200", "x");

  expectedResult = {
    message: "Gut! Das ist der richtige Weg, aber versuch es vielleicht mit einem anderen Wert.",
    type: "warning"
  };

  expect(generateFeedbackMessage("x-50", "200", "x", "+", "30")).toStrictEqual(expectedResult);
});

test("good mathsteps feedback due to nearly correct subtraction", () => {
  generateRearrangementStepsArray("x+50", "200", "x");

  expectedResult = {
    message: "Gut! Das ist der richtige Weg, aber versuch es vielleicht mit einem anderen Wert.",
    type: "warning"
  };

  expect(generateFeedbackMessage("x+50", "200", "x", "-", "20")).toStrictEqual(expectedResult);
});

test("good mathsteps feedback due to nearly correct division", () => {
  generateRearrangementStepsArray("15x+50", "500", "x");

  expectedResult = {
    message: "Gut! Das ist der richtige Weg, aber versuch es vielleicht mit einem anderen Wert.",
    type: "warning"
  };

  expect(generateFeedbackMessage("15x+50", "500", "x", "/", "5")).toStrictEqual(expectedResult);
});

test("good mathsteps feedback due to nearly correct multiplication", () => {
  generateRearrangementStepsArray("x/30+50", "500", "x");

  expectedResult = {
    message: "Gut! Das ist der richtige Weg, aber versuch es vielleicht mit einem anderen Wert.",
    type: "warning"
  };

  expect(generateFeedbackMessage("x/30+50", "500", "x", "*", "15")).toStrictEqual(expectedResult);
});

test("bad mathsteps feedback", () => {
  generateRearrangementStepsArray("30x+50", "20x+800", "x");

  expectedResult = {
    message: "Das war leider kein optimaler Umformungsschritt. Du kannst den Schritt rückgängig oder einfach weiter machen.",
    type: "warning"
  };

  expect(generateFeedbackMessage("30x+50", "20x+800", "x", "*", "2")).toStrictEqual(expectedResult);
});
