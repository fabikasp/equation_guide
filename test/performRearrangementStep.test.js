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

test("expression with basic arithmetic operation", () => {
  expect(performRearrangementStep("100x+20", "-", "10").replace(/\s/g, "")).toBe("100x+10");
});
