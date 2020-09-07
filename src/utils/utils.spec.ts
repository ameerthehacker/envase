import {
  capitalize,
  interpolate,
  getDockerHubLinkToTags,
  getFormulaByName,
  getImageRepoTag,
  interpolateFormula,
  getEnvForDockerAPI,
  getExposedPortsForDockerAPI,
  getVolumesForDockerAPI,
  keyToLabelText,
  requiredValidator,
  getAllTags,
  getReleaseNotes
} from './utils';
import { cloneDeep } from 'lodash-es';
import { FORMULA } from '../../tests/fixtures/app.fixture';

jest.mock('../formulas', () => ({
  FORMULAS: [
    {
      name: 'my-formula'
    }
  ]
}));

describe('utils', () => {
  it('capitalize() should capitalize the string', () => {
    expect(capitalize('name')).toBe('Name');
    expect(capitalize('')).toBe('');
  });

  it('interpolate() should interpolate variables', () => {
    expect(
      interpolate('%password%-%password%', { password: 'secret-password' })
    ).toBe('secret-password-secret-password');
  });

  it('getDockerHubLink() should return link for official images', () => {
    expect(getDockerHubLinkToTags('library/node')).toBe(
      'https://hub.docker.com/_/node/?tab=tags'
    );
  });

  it('getDockerHubLink() should return link for non official images', () => {
    expect(getDockerHubLinkToTags('ameerthehacker/node')).toBe(
      'https://hub.docker.com/r/ameerthehacker/node/tags'
    );
  });

  it('getFormulaByName() should return formula with given name', () => {
    expect(getFormulaByName('my-formula')).toEqual({
      name: 'my-formula'
    });
  });

  it('getFormulaByName() should return undefined when formula is not present', () => {
    expect(getFormulaByName('something')).toEqual(undefined);
  });

  it('getImageRepoTag() should return repo with tag', () => {
    expect(getImageRepoTag('library/mysql', '2')).toBe('library/mysql:2');
  });

  it('interpolateFormula() should interpolate env, ports, volumes', () => {
    expect(
      interpolateFormula(
        {
          data: {},
          defaultShell: '/bin/bash',
          env: {
            PASSWORD: '%password%'
          },
          volumes: {
            '/data': '%volume%'
          },
          image: 'library/mysql',
          logo: 'some-logo',
          name: 'mysql',
          ports: {
            '3000': '%port%'
          }
        },
        { password: 'my-pass', volume: 'my-volume', port: '3001' }
      )
    ).toEqual({
      data: {},
      defaultShell: '/bin/bash',
      env: {
        PASSWORD: 'my-pass'
      },
      volumes: {
        '/data': 'my-volume'
      },
      image: 'library/mysql',
      logo: 'some-logo',
      name: 'mysql',
      ports: {
        '3000': '3001'
      }
    });
  });

  it('interpolateFormula() should not mutate formula', () => {
    const formula = {
      data: {},
      defaultShell: '/bin/bash',
      env: {
        PASSWORD: '%password%'
      },
      volumes: {
        '/data': '%volume%'
      },
      image: 'library/mysql',
      logo: 'some-logo',
      name: 'mysql',
      ports: {
        '3000': '%port%'
      }
    };
    const clonedFormula = cloneDeep(formula);

    interpolateFormula(formula, {
      password: 'my-pass',
      volume: 'my-volume',
      port: '3001'
    });

    expect(formula).toEqual(clonedFormula);
  });

  it('getEnvForDockerAPI() should return envlist', () => {
    expect(
      getEnvForDockerAPI({
        PASSWORD: 'my-pass',
        USER: 'ameer'
      })
    ).toEqual(['PASSWORD=my-pass', 'USER=ameer']);
  });

  it('getExposedPortsForDockerAPI() should return port list', () => {
    expect(
      getExposedPortsForDockerAPI(
        {
          '3000': '3001'
        },
        ['8080']
      )
    ).toEqual({
      portBindings: {
        '3000/tcp': [
          {
            HostPort: '3001'
          }
        ],
        '8080/tcp': [
          {
            HostPort: '8080'
          }
        ]
      },
      exposedPorts: {
        '3000/tcp': {},
        '8080/tcp': {}
      }
    });
  });

  it('getVolumesForDockerAPI() should return volume list', () => {
    expect(
      getVolumesForDockerAPI({
        '/tmp': '/users/my-dir',
        '/bin': '/users/more-dir'
      })
    ).toEqual(['/users/my-dir:/tmp', '/users/more-dir:/bin']);
  });

  it('keyToLabelText() should convert key to label text', () => {
    expect(keyToLabelText('name_the_path')).toBe('Name the path');
  });

  it('requiredValidator() should return undefined when value is given', () => {
    const validator = requiredValidator('field');

    expect(validator('something')).toBeFalsy();
  });

  it('requiredValidator() should return error message when value is given', () => {
    const validator = requiredValidator('field_name');

    expect(validator('')).toBe('Field name is required');
  });

  it('getAllTags() should return all available tags', () => {
    const formula2 = { ...FORMULA };
    formula2.tags = ['Platform', 'Database'];

    expect(getAllTags([FORMULA, formula2])).toEqual({
      Database: false,
      Language: false,
      Platform: false
    });
  });

  it('getReleaseNotes() should return the array of changes', () => {
    expect(
      getReleaseNotes(`
      <ul>
        <li>fixed 1</li>
        <li>fixed 2</li>
      </ul>
    `)
    ).toEqual(['fixed 1', 'fixed 2']);
  });
});
