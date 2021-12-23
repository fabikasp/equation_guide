/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

test("expression with sqrt", () => {
  expect(performRearrangementStep("100x^2", "sqrt", "").replace(/\s/g, "")).toBe("10*abs(x)");
});

test("expression with power", () => {
  expect(performRearrangementStep("100x", "^2", "").replace(/\s/g, "")).toBe("10000*x^2");
});

test("expression with addition", () => {
  expect(performRearrangementStep("100x+20", "+", "10").replace(/\s/g, "")).toBe("100x+30");
});

test("expression with subtraction", () => {
  expect(performRearrangementStep("100x+20", "-", "10").replace(/\s/g, "")).toBe("100x+10");
});

test("expression with multiplication", () => {
  expect(performRearrangementStep("100x+20", "*", "2").replace(/\s/g, "")).toBe("200x+40");
});

test("expression with division", () => {
  expect(performRearrangementStep("100x+20", "/", "2").replace(/\s/g, "")).toBe("50x+10");
});
