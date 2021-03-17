import {
  getBoolFromEnvParser,
  getNumberFromEnvParser,
  getSecretFromEnvFileParser,
  getStringFromEnvParser,
  getStringEnumFromEnvParser,
  validateConfig,
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
        blue: {
          siegFried: getBoolFromEnvParser('ENV_THREE'),
          green: {
            someWord: getBoolFromEnvParser('ENV_FOUR'),
            secret: getSecretFromEnvFileParser('ENV_FIVE'),
            thisIsNotFromEnv: 'Hello',
          },
        },
        ENV_NODE_ENV_GOOD: getStringEnumFromEnvParser('ENV_NODE_ENV_GOOD', [
          'production',
          'development',
        ]),
        plain: getStringFromEnvParser('ENV_TWO'),
      }

      const parsedConfig = {
        regExTest: 'http://www.kokodak.bagr/lopata',
        port: 888,
        hostAndSomething: 'sharkInDark/kokodák/sharkInDark',
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
      }
      expect(validateConfig(configValidators)).toStrictEqual(parsedConfig)
    })
  })
  describe('fails', () => {
    it('enum-values', () => {
      const confValidators = {
        regExTest: getStringFromEnvParser('ENV_ZERO', {
          pattern: `!!!!https?://*.`,
        }),
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
        ]),
      }
      expect(() => {
        validateConfig(confValidators)
      }).toThrowError()
    })

    it('one', () => {
      const confValidators = {
        blue: getNumberFromEnvParser('ENV_TWO'),
        yellow: { ja: getBoolFromEnvParser('ENV_ONE') },
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
