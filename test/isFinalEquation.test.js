/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

test("equation is solved with one result", () => {
  expect(isFinalEquation("x", "200", "x")).toBe(true);
});

test("equation is solved with two results", () => {
  expect(isFinalEquation("abs(x)", "200", "x")).toBe(true);
});

test("equation is not solved", () => {
  expect(isFinalEquation("2x+50", "200", "x")).toBe(false);
});
