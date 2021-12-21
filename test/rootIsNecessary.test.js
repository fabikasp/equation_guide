/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

test("both equation parts contain no power", () => {
  expect(rootIsNecessary("200y+20+30x", "200", "x")).toBe(false);
});

test("left equation part contains only variable with power", () => {
  expect(rootIsNecessary("x^2", "200", "x")).toBe(true);
});

test("left equation part contains only expression with power including variable", () => {
  expect(rootIsNecessary("(200y+20+30x)^2", "200", "x")).toBe(true);
});

test("left equation part contains only expression with power not including variable", () => {
  expect(rootIsNecessary("(200y+20)^2", "200x", "x")).toBe(false);
});

test("left equation part contains variable with power and other expressions", () => {
  expect(rootIsNecessary("x^2+30", "200", "x")).toBe(false);
});

test("left equation part contains expression with power including variable and other expressions", () => {
  expect(rootIsNecessary("(200y+20x)^2+30", "200", "x")).toBe(false);
});

test("right equation part contains only variable with power", () => {
  expect(rootIsNecessary("500", "y^2", "y")).toBe(true);
});

test("right equation part contains only expression with power including variable", () => {
  expect(rootIsNecessary("20+30x", "(x+y+z)^2", "y")).toBe(true);
});

test("right equation part contains only expression with power not including variable", () => {
  expect(rootIsNecessary("700y", "(x+z)^2", "y")).toBe(false);
});

test("right equation part contains variable with power and other expressions", () => {
  expect(rootIsNecessary("1000+20x+70z", "y^2+700", "y")).toBe(false);
});

test("right equation part contains expression with power including variable and other expressions", () => {
  expect(rootIsNecessary("600+20z", "(200y+70z)^2+20x+400", "y")).toBe(false);
});

test("both equation parts contain only expression with power including variable", () => {
  expect(rootIsNecessary("(20+30y)^2", "(x+y+z)^2", "y")).toBe(true);
});

test("both equation parts contain expression with power including variable and other expressions", () => {
  expect(rootIsNecessary("(600+20y)^2+900", "(200y+70z)^2+20x+400", "y")).toBe(false);
});
