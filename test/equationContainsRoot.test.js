/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

test("equation with root in left equation part", () => {
  expect(equationContainsRoot("sqrt(y+200)", "200x")).toBe(true);
});

test("equation with root in right equation part", () => {
  expect(equationContainsRoot("y+200", "sqrt(200x)")).toBe(true);
});

test("equation with root in both equation parts", () => {
  expect(equationContainsRoot("sqrt(y+200)", "sqrt(200x)")).toBe(true);
});

test("equation without root", () => {
  expect(equationContainsRoot("y+200", "200x")).toBe(false);
});
