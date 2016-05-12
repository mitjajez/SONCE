/* eslint-env mocha */
// These are Chimp globals */
/* globals browser assert */

const countCircuits = () => {
  browser.waitForExist('.circuit-element');
  const elements = browser.elements('.circuit-element');
  return elements.value.length;
};

describe('circuit ui', () => {
  beforeEach(() => {
    browser.url('http://localhost:3000');
  });

  it('can create a circuit @watch', () => {
    const initialCount = countCircuits();

    browser.click('.js-new-circuit');

    assert.equal(countCircuits(), initialCount + 1);
  });
});
