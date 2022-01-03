/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

test("both equation parts contain no power", () => {
  expect(powerIsNecessary("200y+20+30x", "200", "x")).toBe(false);
});

test("left equation part contains only variable with power", () => {
  expect(powerIsNecessary("sqrt(x)", "200", "x")).toBe(true);
});

test("left equation part contains only expression with power including variable", () => {
  expect(powerIsNecessary("sqrt(200y+20+30x)", "200", "x")).toBe(true);
});

test("left equation part contains only expression with power not including variable", () => {
  expect(powerIsNecessary("sqrt(200y+20)", "200x", "x")).toBe(false);
});

test("left equation part contains variable with power and other expressions", () => {
  expect(powerIsNecessary("sqrt(x)+30", "200", "x")).toBe(false);
});

test("left equation part contains expression with power including variable and other expressions", () => {
  expect(powerIsNecessary("sqrt(200y+20x)+30", "200", "x")).toBe(false);
});

test("right equation part contains only variable with power", () => {
  expect(powerIsNecessary("500", "sqrt(y)", "y")).toBe(true);
});

test("right equation part contains only expression with power including variable", () => {
  expect(powerIsNecessary("20+30x", "sqrt(x+y+z)", "y")).toBe(true);
});

test("right equation part contains only expression with power not including variable", () => {
  expect(powerIsNecessary("700y", "sqrt(x+z)", "y")).toBe(false);
});

test("right equation part contains variable with power and other expressions", () => {
  expect(powerIsNecessary("1000+20x+70z", "sqrt(y)+700", "y")).toBe(false);
});

test("right equation part contains expression with power including variable and other expressions", () => {
  expect(powerIsNecessary("600+20z", "sqrt(200y+70z)+20x+400", "y")).toBe(false);
});

test("both equation parts contain only expression with power including variable", () => {
  expect(powerIsNecessary("sqrt(20+30y)", "sqrt(x+y+z)", "y")).toBe(true);
});

test("both equation parts contain expression with power including variable and other expressions", () => {
  expect(powerIsNecessary("sqrt(600+20y)+900", "sqrt(200y+70z)+20x+400", "y")).toBe(false);
});
