/**
 * @jest-environment node
 */
import {
  getBoolFromEnvParser,
  getNumberFromEnvParser,
  getStringFromEnvParser,
  getStringEnumFromEnvParser,
  validateConfig,
  getListFromEnvParser,
  getEnvFromFileParser,
} from '../src'

const testEnvironmentVariables = {
  ENV_ZERO: 'http://www.kokodak.bagr/lopata',
  ENV_ONE: ' 888',
  ENV_TWO: 'sharkInDark ',
  ENV_THREE: ' true ',
  ENV_FOUR: 'false',
  ENV_FIVE: `${__dirname}/validateConfig.spec.fixture`,
  ENV_NODE_ENV_GOOD: 'production',
  ENV_NODE_ENV_BAD: '___production',
  ENV_NODE_ARR_STR_1: '["a", "b", "c"]',
  ENV_NODE_ARR_STR_2: '["d", "e", "f"]',
  ENV_NODE_ARR_STR_3: '["a", null, "b"]',
  ENV_NODE_ARR_FLOAT: '[1, 1.1, 1.11]',
  ENV_NODE_ARR_INT: '[1, 1, 1]',
  ENV_EMPTY: '',
}

// original env  - put it back after tests done to not interferes with another tests that may use env
const oldValues = Object.fromEntries(
  Object.keys(testEnvironmentVariables).map(key => [key, process.env[key]])
)

// set test env variables
beforeAll(() => {
  Object.entries(testEnvironmentVariables).forEach(([key, newValue]) => {
    process.env[key] = newValue
  })
})

// reset test env variables to state prior test
afterAll(() => {
  Object.entries(oldValues).forEach(([key, oldValue]) => {
    process.env[key] = oldValue
  })
})

describe('validateConfig', () => {
  describe('should pass', () => {
    it('basic config', () => {
      const configValidators = {
        regExTest: getStringFromEnvParser('ENV_ZERO', {
          pattern: `https?://*.`,
        }),
        port: getNumberFromEnvParser('ENV_ONE'),
        hostAndSomething: getStringFromEnvParser('ENV_TWO', {
          transform: parsedEnv => `${parsedEnv}/kokodák/${parsedEnv}`,
        }),
        usersIds1: [1, 2, 3],
        usersIds2: () => [1, 2, 3],
        blue: {
          siegFried: getBoolFromEnvParser('ENV_THREE'),
          green: {
            someWord: getBoolFromEnvParser('ENV_FOUR'),
            secret: getEnvFromFileParser('ENV_FIVE'),
            thisIsNotFromEnv: 'Hello',
          },
        },
        ENV_NODE_ENV_GOOD: getStringEnumFromEnvParser('ENV_NODE_ENV_GOOD', [
          'production',
          'development',
        ] as const),
        plain: getStringFromEnvParser('ENV_TWO'),
        arrStr1: getListFromEnvParser('ENV_NODE_ARR_STR_1'),
        arrStr2: getListFromEnvParser('ENV_NODE_ARR_STR_2', String),
        arrStr3: getListFromEnvParser('ENV_NODE_ARR_STR_3'),
        arrFloat: getListFromEnvParser('ENV_NODE_ARR_FLOAT', parseFloat),
        arrInt: getListFromEnvParser('ENV_NODE_ARR_INT', parseInt),
        emptyString: getStringFromEnvParser('ENV_EMPTY', { allowEmptyString: true }),
        emptyStringWithPattern: getStringFromEnvParser('ENV_EMPTY', {
          allowEmptyString: true,
          pattern: `https?://*.`,
        }),
        emptyBool: getBoolFromEnvParser('ENV_EMPTY', { allowEmptyString: true }),
        emptyEnum: getStringEnumFromEnvParser('ENV_EMPTY', [
          'production',
          'development',
        ] as const,
          {
            allowEmptyString: true,
          }),
      }

      const parsedConfig = {
        regExTest: 'http://www.kokodak.bagr/lopata',
        port: 888,
        hostAndSomething: 'sharkInDark/kokodák/sharkInDark',
        usersIds1: [1, 2, 3],
        usersIds2: [1, 2, 3],
        blue: {
          siegFried: true,
          green: {
            someWord: false,
            secret: 'secret_here',
            thisIsNotFromEnv: 'Hello',
          },
        },
        ENV_NODE_ENV_GOOD: 'production',
        plain: 'sharkInDark',
        arrStr1: ['a', 'b', 'c'],
        arrStr2: ['d', 'e', 'f'],
        arrStr3: ['a', 'null', 'b'],
        arrFloat: [1, 1.1, 1.11],
        arrInt: [1, 1, 1],
        emptyString: '',
        emptyStringWithPattern: '',
        emptyBool: '',
        emptyEnum: '',
      }
      expect(validateConfig(configValidators)).toStrictEqual(parsedConfig)
    })
  })
  describe('fails', () => {
    it('test array 1', () => {
      const confValidators = {
        foo: getListFromEnvParser('ENV_ONE'),
      }
      expect(() => {
        validateConfig(confValidators)
      }).toThrowError()
    })

    it('test array 2', () => {
      const confValidators = {
        foo: getListFromEnvParser('ENV_TWO'),
      }
      expect(() => {
        validateConfig(confValidators)
      }).toThrowError()
    })

    it('enum-values', () => {
      const confValidators = {
        ENV_NODE_ENV_BAD: getStringEnumFromEnvParser('ENV_NODE_ENV_BAD', [
          'production',
          'development',
        ] as const),
      }
      expect(() => {
        validateConfig(confValidators)
      }).toThrowError()
    })

    it('one', () => {
      const confValidators = {
        blue: getNumberFromEnvParser('ENV_TWO'),
        yellow: { ja: getBoolFromEnvParser('ENV_ONE', { allowEmptyString: true }) },
      }
      expect(() => {
        validateConfig(confValidators)
      }).toThrowError()
    })

    it('two', () => {
      const configValidators = {
        nonExistingEnv: getBoolFromEnvParser('HILDA_UND_GUNTER'),
      }
      expect(() => {
        validateConfig(configValidators)
      }).toThrowError()
    })

    it('three', () => {
      const configValidators = {
        ich: {
          bin: {
            mi: {
              ob: getBoolFromEnvParser('ENV_TWO'),
            },
          },
        },
      }

      expect(() => {
        validateConfig(configValidators)
      }).toThrowError()
    })
  })
})
