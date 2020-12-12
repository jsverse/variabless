import { resolveName } from '../src/resolveName';

describe('resolveName', () => {
  const tokenValues = { valueKey: 'a', property: 'b' };

  it('should replace the tokens in the resolver', () => {
    expect(resolveName('no-tokens')).toBe('no-tokens');
    expect(resolveName('.valueKey')).toBe('.valueKey');
    expect(resolveName('.:valueKey-:property', tokenValues)).toBe('.a-b');
    expect(resolveName('.:valueKey-:property-:valueKey-:property', tokenValues)).toBe('.a-b-a-b');
  });

  it('should pass the resolver function with the tokens', () => {
    const spy = jest.fn();
    resolveName(spy);
    expect(spy).toHaveBeenCalledWith({});
    spy.mockClear();
    resolveName(spy, tokenValues);
    expect(spy).toHaveBeenCalledWith(tokenValues);
  });
});
