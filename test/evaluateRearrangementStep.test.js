/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

test("empty rearrangement step with sqrt", () => {
  const expectedResult = "";

  expect(evaluateRearrangementStep("20x", "200", "sqrt", "")).toBe(expectedResult);
});

test("empty rearrangement step with ^2", () => {
  const expectedResult = "";

  expect(evaluateRearrangementStep("20x", "200", "^2", "")).toBe(expectedResult);
});

test("empty rearrangement step without valid arithmetic operation", () => {
  const expectedResult = "Der Umformungsschritt darf nicht leer sein.";

  expect(evaluateRearrangementStep("20x", "200", "+", "")).toBe(expectedResult);
});

test("rearrangement step with equal sign", () => {
  const expectedResult = "Der Umformungsschritt darf kein Gleichheitszeichen enthalten.";

  expect(evaluateRearrangementStep("20x", "200", "+", "2=2")).toBe(expectedResult);
});

test("rearrangement step with multiplication with 0", () => {
  const expectedResult = "Die Multiplikation mit 0 wird nicht unterstützt.";

  expect(evaluateRearrangementStep("20x", "200", "*", "0")).toBe(expectedResult);
});

test("rearrangement step with forbidden character", () => {
  const expectedResult = "Der Umformungsschritt wird nicht unterstützt.";

  expect(evaluateRearrangementStep("20x", "200", "/", "$$x")).toBe(expectedResult);
});

test("rearrangement step with successful validation", () => {
  const expectedResult = "";

  expect(evaluateRearrangementStep("20x", "200", "-", "20")).toBe(expectedResult);
});
