/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

/* test generateRearrangmentStepsArray function */

test("generateRearrangementStepsArray with simple addition", () => {
  generateRearrangementStepsArray("x-2", "10", "x");

  const expectedResult = [{"type": "add", "value": "2"}];

  expect(returnRearrangementStepsArray()).toStrictEqual(expectedResult);
  expect(returnRearrangementStepsGenerated()).toBe(true);
});

test("generateRearrangementStepsArray with simple subtraction", () => {
  generateRearrangementStepsArray("x+2", "10", "x");

  const expectedResult = [{"type": "subtract", "value": "2"}];

  expect(returnRearrangementStepsArray()).toStrictEqual(expectedResult);
  expect(returnRearrangementStepsGenerated()).toBe(true);
});

test("generateRearrangementStepsArray with simple multiplication", () => {
  generateRearrangementStepsArray("x/2", "10", "x");

  const expectedResult = [{"type": "multiply", "value": "2"}];

  expect(returnRearrangementStepsArray()).toStrictEqual(expectedResult);
  expect(returnRearrangementStepsGenerated()).toBe(true);
});

test("generateRearrangementStepsArray with simple division", () => {
  generateRearrangementStepsArray("2*x", "10", "x");

  const expectedResult = [{"type": "divide", "value": "2"}];

  expect(returnRearrangementStepsArray()).toStrictEqual(expectedResult);
  expect(returnRearrangementStepsGenerated()).toBe(true);
});

test("generateRearrangementStepsArray with multiple steps (add & multiply)", () => {
  generateRearrangementStepsArray("x/2-2", "10", "x");

  const expectedResult = [{"type": "add", "value": "2"},{"type": "multiply", "value": "2"}];

  expect(returnRearrangementStepsArray()).toStrictEqual(expectedResult);
  expect(returnRearrangementStepsGenerated()).toBe(true);
});

test("generateRearrangementStepsArray with multiple steps (add & divide)", () => {
  generateRearrangementStepsArray("2*x-2", "10", "x");

  const expectedResult = [{"type": "add", "value": "2"},{"type": "divide", "value": "2"}];

  expect(returnRearrangementStepsArray()).toStrictEqual(expectedResult);
  expect(returnRearrangementStepsGenerated()).toBe(true);
});

test("generateRearrangementStepsArray with multiple steps (subtract & divide)", () => {
  generateRearrangementStepsArray("2*x+2", "10", "x");

  const expectedResult = [{"type": "subtract", "value": "2"},{"type": "divide", "value": "2"}];

  expect(returnRearrangementStepsArray()).toStrictEqual(expectedResult);
  expect(returnRearrangementStepsGenerated()).toBe(true);
});

test("generateRearrangementStepsArray with multiple steps (subtract & multiply)", () => {
  generateRearrangementStepsArray("x/2+2", "10", "x");

  const expectedResult = [{"type": "subtract", "value": "2"},{"type": "multiply", "value": "2"}];

  expect(returnRearrangementStepsArray()).toStrictEqual(expectedResult);
  expect(returnRearrangementStepsGenerated()).toBe(true);
});

test("complex equations lead to no relevant steps being created", () => {
  generateRearrangementStepsArray("(2x+1)/(3x+2)", "2", "x");

  expect(returnRearrangementStepsGenerated()).toBe(false);
});

