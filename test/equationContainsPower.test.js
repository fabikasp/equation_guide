/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

test("equation with power in left equation part", () => {
  expect(equationContainsPower("(y+200)^2", "200x")).toBe(true);
});

test("equation with power in right equation part", () => {
  expect(equationContainsPower("y+200", "200x^2")).toBe(true);
});

test("equation with power in both equation parts", () => {
  expect(equationContainsPower("(y+200)^2", "200x^2")).toBe(true);
});

test("equation without power", () => {
  expect(equationContainsPower("y+200", "200x")).toBe(false);
});
