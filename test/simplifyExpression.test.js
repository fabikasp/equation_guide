/**
 * @jest-environment jsdom
 */

require('../src/scripts/functions.js');

test('simplify simple expression', () => {
  expect(simplifyExpression("2x+20")).toBe("2x+20");
});
