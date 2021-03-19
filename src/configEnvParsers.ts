import { ValidationError } from './ValidationError'

export const getNumberFromEnvParser = (envName: string) => () => {
  const envValue = process.env[envName]?.trim()
  const parsedNum = parseFloat(envValue ?? '')
  if (isNaN(parsedNum)) {
    throw new ValidationError('Value is not parsable as integer', envName)
  }
  return parsedNum
}

const defaultTransformFn = (value: string) => value

export const getStringFromEnvParser = (
  envName: string,
  {
    allowEmptyString = false,
    pattern = undefined as string | undefined,
    transform = defaultTransformFn,
  } = {}
) => () => {
  const envValue = process.env[envName]?.trim()
  if (envValue === undefined || (!allowEmptyString && envValue.length === 0)) {
    throw new ValidationError('Value is not set or it is empty string', envName)
  }
  if (pattern) {
    const validator = new RegExp(pattern)
    if (validator.test(envValue) === false) {
      throw new ValidationError(`Value does not match the regex pattern ${pattern}`, envName)
    }
  }
  return transform(envValue)
}

export const getStringEnumFromEnvParser = <T extends string>(
  envName: string,
  possibleEnumValues: T[] | readonly T[]
) => (): T => {
  const envValue = process.env[envName]?.trim() as T
  if (envValue === undefined || envValue.length === 0 || !possibleEnumValues.includes(envValue)) {
    throw new ValidationError(
      `Value does not match union: ${possibleEnumValues.join(' | ')}, or it is empty string`,
      envName
    )
  }
  return envValue
}

export const getBoolFromEnvParser = (envName: string) => () => {
  const envValue = process.env[envName]?.trim()
  if (envValue === 'true') {
    return true
  }
  if (envValue === 'false') {
    return false
  }
  throw new ValidationError('Value is not parsable as boolean', envName)
}

export const getListFromEnvParser = <T = string>(
  envName: string,
  // @ts-expect-error default String does not match function that Returns T
  valueParser: (arg: any) => T = String
) => (): T[] => {
  const envValue = process.env[envName]?.trim()
  const parsedArr = JSON.parse(envValue ?? '')
  if (!Array.isArray(parsedArr)) {
    throw new ValidationError('Passed value is not array', envName)
  }
  return parsedArr.map(i => valueParser(i))
}

const isClient = typeof window === 'object'

export const getEnvFromFileParser = (envName: string, required = true) => () => {
  if (isClient) {
    throw new Error(`You cant import 'getEnvFromFileParser' in the browser`)
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { existsSync, readFileSync } = require('fs')

  const envValue = process.env[envName]?.trim()
  if (!envValue || envValue.length === 0 || !existsSync(envValue)) {
    if (!required) {
      return ''
    }
    throw new ValidationError(`There is no file path stored in ${envName}`, envName)
  }
  return readFileSync(envValue, 'utf-8').trim()
}
