/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

test("solve simple equation", () => {
  expect(getEquationResult("2x+20", "200", "x").replace(/\s/g, "")).toBe("90");
});

test("solve complex equation", () => {
  expect(getEquationResult("20(2x+3y+20)+5x", "30y+10x-500", "x").replace(/\s/g, "")).toBe("(-1/35)*(30*y+900)");
});

test("solve equation with sqrt", () => {
  expect(getEquationResult("sqrt(100+16x)", "sqrt(y)", "x").replace(/\s/g, "")).toBe("(1/16)*(-100+y),(-1/16)*(-y+100)");
});

test("solve equation with power", () => {
  expect(getEquationResult("x^2", "169", "x").replace(/\s/g, "")).toBe("13,-13");
});

test("handle invalid equation", () => {
  expect(() => { getEquationResult("&&&", "200", "x"); }).toThrow();
});
