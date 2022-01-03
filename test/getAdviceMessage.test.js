/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

/* test nerdamer advices */

test("nerdamer advice for power at first attempt", () => {
  resetAdviceButtonClickCounter();

  const expectedResult = "Versuch es erst einmal selbst.";

  expect(getAdviceMessage("2x^2+20", "200", "x")).toBe(expectedResult);
});

test("nerdamer advice for power at second attempt with root feedback", () => {
  resetAdviceButtonClickCounter();
  getAdviceMessage("x^2", "200");

  const expectedResult = "Versuch es doch mal mit Wurzelziehen";

  expect(getAdviceMessage("x^2", "200", "x")).toBe(expectedResult);
});

test("nerdamer advice for power at second attempt without root feedback", () => {
  resetAdviceButtonClickCounter();
  getAdviceMessage("2x^2+20", "200");

  const expectedResult = "Versuch es erst einmal ohne Wurzelziehen";

  expect(getAdviceMessage("2x^2+20", "200", "x")).toBe(expectedResult);
});

test("nerdamer advice for sqrt at first attempt", () => {
  resetAdviceButtonClickCounter();

  const expectedResult = "Versuch es erst einmal selbst.";

  expect(getAdviceMessage("sqrt(2x+20)", "200", "x")).toBe(expectedResult);
});

test("nerdamer advice for sqrt at second attempt with power feedback", () => {
  resetAdviceButtonClickCounter();
  getAdviceMessage("sqrt(2x+20)", "200");

  const expectedResult = "Versuch es doch mal mit Potenzieren";

  expect(getAdviceMessage("sqrt(2x+20)", "200", "x")).toBe(expectedResult);
});

test("nerdamer advice for sqrt at second attempt without power feedback", () => {
  resetAdviceButtonClickCounter();
  getAdviceMessage("sqrt(2x+20)+20", "200");

  const expectedResult = "Versuch es erst einmal ohne Potenzieren";

  expect(getAdviceMessage("sqrt(2x+20)+20", "200", "x")).toBe(expectedResult);
});

/* test mathsteps advices */

test("mathsteps advice with already solved equation", () => {
  generateRearrangementStepsArray("x", "60", "x");

  const expectedResult = "Du hast die Gleichung bereits gelöst.";

  expect(getAdviceMessage("x", "60", "x")).toBe(expectedResult);
});

test("mathsteps advice with too less attempts", () => {
  resetWrongCounter();
  generateRearrangementStepsArray("2x", "400", "x");

  const expectedResult = "Versuch es erst einmal selbst.";

  expect(getAdviceMessage("2x", "400", "x")).toBe(expectedResult);
});

test("weak mathsteps advice for addition", () => {
  resetWrongCounter();
  generateRearrangementStepsArray("x-20", "400", "x");
  generateFeedbackMessage("+", "5");
  generateFeedbackMessage("+", "5");

  const expectedResult = "Versuch es doch mal mit addieren.";

  expect(getAdviceMessage("x-20", "400", "x")).toBe(expectedResult);
});

test("weak mathsteps advice for subtraction", () => {
  resetWrongCounter();
  generateRearrangementStepsArray("x+20", "400", "x");
  generateFeedbackMessage("+", "5");
  generateFeedbackMessage("+", "5");

  const expectedResult = "Versuch es doch mal mit subtrahieren.";

  expect(getAdviceMessage("x-20", "400", "x")).toBe(expectedResult);
});

test("weak mathsteps advice for division", () => {
  resetWrongCounter();
  generateRearrangementStepsArray("2x", "400", "x");
  generateFeedbackMessage("+", "10");
  generateFeedbackMessage("+", "10");

  const expectedResult = "Versuch es doch mal mit dividieren.";

  expect(getAdviceMessage("2x", "400", "x")).toBe(expectedResult);
});

test("weak mathsteps advice for multiplication", () => {
  resetWrongCounter();
  generateRearrangementStepsArray("x/2", "400", "x");
  generateFeedbackMessage("+", "10");
  generateFeedbackMessage("+", "10");

  const expectedResult = "Versuch es doch mal mit multiplizieren.";

  expect(getAdviceMessage("x/2", "400", "x")).toBe(expectedResult);
});

test("strong mathsteps advice for addition", () => {
  resetWrongCounter();
  generateRearrangementStepsArray("x-20", "400", "x");
  generateFeedbackMessage("+", "2");
  generateFeedbackMessage("+", "2");
  generateFeedbackMessage("+", "2");
  generateFeedbackMessage("+", "2");

  const expectedResult = "Mit +20 umzuformen, wird dich bestimmt weiterbringen.";

  expect(getAdviceMessage("x-20", "400", "x")).toBe(expectedResult);
});

test("strong mathsteps advice for subtraction", () => {
  resetWrongCounter();
  generateRearrangementStepsArray("x+20", "400", "x");
  generateFeedbackMessage("+", "2");
  generateFeedbackMessage("+", "2");
  generateFeedbackMessage("+", "2");
  generateFeedbackMessage("+", "2");

  const expectedResult = "Mit -20 umzuformen, wird dich bestimmt weiterbringen.";

  expect(getAdviceMessage("x+20", "400", "x")).toBe(expectedResult);
});

test("strong mathsteps advice for division", () => {
  resetWrongCounter();
  generateRearrangementStepsArray("2x", "400", "x");
  generateFeedbackMessage("+", "10");
  generateFeedbackMessage("+", "10");
  generateFeedbackMessage("+", "10");
  generateFeedbackMessage("+", "10");

  const expectedResult = "Mit /2 umzuformen, wird dich bestimmt weiterbringen.";

  expect(getAdviceMessage("2x", "400", "x")).toBe(expectedResult);
});

test("strong mathsteps advice for multiplication", () => {
  resetWrongCounter();
  generateRearrangementStepsArray("x/30", "400", "x");
  generateFeedbackMessage("+", "10");
  generateFeedbackMessage("+", "10");
  generateFeedbackMessage("+", "10");
  generateFeedbackMessage("+", "10");

  const expectedResult = "Mit *30 umzuformen, wird dich bestimmt weiterbringen.";

  expect(getAdviceMessage("x/30", "400", "x")).toBe(expectedResult);
});

test("complex equations lead to no advice", () => {
  generateRearrangementStepsArray("(2x+1)/(3x+2)", "2", "x");

  const expectedResult = "Leider können für diese Art von Gleichungen keine Tipps gegeben werden.";

  expect(getAdviceMessage("(2x+1)/(3x+2)", "2")).toBe(expectedResult);
});
