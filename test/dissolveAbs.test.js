/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

test("unsolved equation", () => {
  const expectedResult = {
    "leftEquationPart": "abs(x)*30",
    "rightEquationPart": "30"
  };

  expect(dissolveAbs("abs(x)*30", "30", "x")).toStrictEqual(expectedResult);
});

test("equation without abs", () => {
  const expectedResult = {
    "leftEquationPart": "x",
    "rightEquationPart": "30"
  };

  expect(dissolveAbs("x", "30", "x")).toStrictEqual(expectedResult);
});

test("simple equation with abs in left equation part", () => {
  const expectedResult = {
    "leftEquationPart": "x",
    "rightEquationPart": "30, -(30)"
  };

  expect(dissolveAbs("abs(x)", "30", "x")).toStrictEqual(expectedResult);
});

test("complex equation with abs in left equation part", () => {
  const expectedResult = {
    "leftEquationPart": "x",
    "rightEquationPart": "20*z+200*y+360+sqrt(y), -(20*z+200*y+360+sqrt(y))"
  };

  expect(dissolveAbs("abs(x)", "20*z+200*y+360+sqrt(y)", "x")).toStrictEqual(expectedResult);
});

test("simple equation with abs in right equation part", () => {
  const expectedResult = {
    "leftEquationPart": "2x, -(2x)",
    "rightEquationPart": "y"
  };

  expect(dissolveAbs("2x", "abs(y)", "y")).toStrictEqual(expectedResult);
});

test("complex equation with abs in right equation part", () => {
  const expectedResult = {
    "leftEquationPart": "+20 x + 200 s + 336 + 90 z, -20 x + -200 s + -336 + -90 z",
    "rightEquationPart": "y"
  };

  expect(dissolveAbs("20x+200s+336+90z", "abs(y)", "y")).toStrictEqual(expectedResult);
});
