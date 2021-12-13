/**
 * @jest-environment jsdom
 */

require("../src/scripts/functions.js");

test("equation is solved with one result", () => {
  expect(isFinalEquation("x", "200", "x")).toBe(true);
});
