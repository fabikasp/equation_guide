/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

test("simplify simple expression", () => {
  expect(simplifyExpression("2x+20").replace(/\s/g, "")).toBe("2x+20");
});

test("simplify complex expression", () => {
  expect(simplifyExpression("20(x+10+2y)").replace(/\s/g, "")).toBe("20x+200+40y");
});

test("simplify redundant expression", () => {
  expect(simplifyExpression("200x+20x+10+30+20").replace(/\s/g, "")).toBe("220x+60");
});

test("simplify invalid expression", () => {
  expect(simplifyExpression("$$$10&&&").replace(/\s/g, "")).toBe("$$$10&&&");
});

test("simplify expression with sqrt", () => {
  expect(simplifyExpression("10x+sqrt(225+10y)").replace(/\s/g, "")).toBe("10x+sqrt(225+10y)");
});

test("simplify expression with power", () => {
  expect(simplifyExpression("(10x+20)^2").replace(/\s/g, "")).toBe("(10x+20)^2");
});

test("simplify expression with sqrt and power", () => {
  expect(simplifyExpression("10^2").replace(/\s/g, "")).toBe("10x+225+10y");
});

test("simplify invalid expression with sqrt", () => {
  expect(simplifyExpression("sqrt(&&&)").replace(/\s/g, "")).toBe("sqrt(&&&)");
});
