import { validateRule } from '../src/validateRule';

describe('validateRule', () => {
  let spy: jest.SpyInstance;

  beforeAll(() => {
    spy = jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    jest.spyOn(console, 'error').mockImplementation((() => {}) as any);
  });

  function assertError(options, shouldError = true) {
    validateRule(options);
    (shouldError ? expect(spy) : expect(spy).not).toHaveBeenLastCalledWith(1);
    spy.mockClear();
  }

  function assertNoError(options) {
    assertError(options, false);
  }

  describe('variableName', () => {
    it('should throw when passing multiple values and a static variableName', () => {
      assertNoError({ variableName: ':property' });
      assertNoError({ variableName: () => {} });
      assertError({ variableName: 'static' });
    });
  });

  describe('properties', () => {
    const options = (properties, value: any = 'test') => ({ value, variableName: ':property', properties });

    it('should throw when not an array', () => {
      assertError(options({}));
      assertNoError(options([]));
    });

    it('should throw when property is missing a selector', () => {
      assertError(options([{ prop: 'test' }]));
      assertNoError(options([{ prop: 'test', selector: 'bla' }]));
    });

    it('should throw when passing multiple values or props and a static selector', () => {
      assertError(options([{ prop: ['1', '2'], selector: 'bla' }]));
      assertError(options([{ prop: 'test', selector: 'bla' }], {}));

      for (const selector of [':valueKey', () => {}]) {
        assertNoError(options([{ prop: 'test', selector }], {}));
        assertNoError(options([{ prop: ['1', '2'], selector }]));
      }
    });
  });
});
