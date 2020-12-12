import { buildVariables } from '../src/buildVariables';

import { rulesDefinitions } from './buildVariables.mocks';

describe('buildVariables', () => {
  for (const rule of rulesDefinitions) {
    it('should build variables correctly', () => {
      expect(buildVariables({ rule })).toMatchSnapshot();
    });
  }
});
