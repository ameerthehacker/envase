import { getContainerAppInfoFromLabels, getAppLabels } from './docker';
import { FORMULA } from '../../../tests/fixtures/app.fixture';

jest.mock('../../formulas', () => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const { FORMULA } = require('../../../tests/fixtures/app.fixture');

  return {
    FORMULAS: [FORMULA]
  };
});
jest.mock('../native/native', () => ({}));

const values = {
  username: 'ameer',
  port: 3002,
  password: 'imameer$',
  version: 'latest'
};

describe('Docker Services', () => {
  it('getAppLabels() should return the containe labels to store', () => {
    expect(getAppLabels(FORMULA, values)).toEqual({
      'created-by-envase': 'yes',
      formulaName: FORMULA.name,
      formValues: JSON.stringify(values),
      image: FORMULA.image,
      version: values.version
    });
  });
  describe('getContainerAppInfoFromLabels', () => {
    it('should return the container info from labels', () => {
      const {
        formValues,
        getInterpolatedFormula,
        image,
        version
      } = getContainerAppInfoFromLabels({
        formulaName: 'MySQL',
        formValues: JSON.stringify(values),
        version: 'latest',
        image: 'library/mysql'
      });

      expect(formValues).toEqual(values);
      expect(getInterpolatedFormula()).toEqual({
        ...FORMULA,
        env: {
          PORT: '3002',
          PASSWORD: 'imameer$',
          USERNAME: 'ameer'
        }
      });
      expect(image).toBe('library/mysql');
      expect(version).toBe('latest');
    });

    it('should throw when the meta data not found', () => {
      try {
        getContainerAppInfoFromLabels({});
      } catch (err) {
        expect(err.message).toBe(
          'Unable to find formula meta data on the container'
        );
      }
    });

    it('should throw when the formula could not be found', () => {
      try {
        getContainerAppInfoFromLabels({
          formulaName: 'unknown',
          formValues: '{}',
          image: 'something',
          version: 'latest'
        });
      } catch (err) {
        expect(err.message).toBe('Unable to find formula for unknown');
      }
    });
  });
});
