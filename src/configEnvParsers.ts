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
  const isValueDisallowed = !allowEmptyString && envValue?.length === 0
  if (envValue === undefined || isValueDisallowed) {
    throw new ValidationError('Value is not set or it is empty string', envName)
  }
  if (pattern && isValueDisallowed) {
    const validator = new RegExp(pattern)
    if (validator.test(envValue) === false) {
      throw new ValidationError(`Value does not match the regex pattern ${pattern}`, envName)
    }
  }
  return transform(envValue)
}

export const getStringEnumFromEnvParser = <T extends string, AllowEmpty extends boolean = false>(
  envName: string,
  possibleEnumValues: readonly T[],
  { allowEmptyString }: { allowEmptyString?: AllowEmpty } = {}
) => (): AllowEmpty extends true ? ('' | T) : T => {
  const envValue = process.env[envName]?.trim() as T

  const isValueDisallowed = !allowEmptyString && envValue?.length === 0
  if (envValue === undefined || isValueDisallowed) {
    throw new ValidationError('Value is not set or it is empty string', envName)
  }

  if (allowEmptyString && envValue.length === 0) {
    return '' as AllowEmpty extends true ? "" | T : T
  }

  if (!possibleEnumValues.includes(envValue)) {
    throw new ValidationError(
      `Value does not match union: ${possibleEnumValues.join(' | ')}`,
      envName
    )
  }

  return envValue
}

type BoolOrEmptyString<T extends boolean> = T extends true ? ('' | boolean) : boolean

export const getBoolFromEnvParser = <AllowEmpty extends boolean = false>(
  envName: string,
  { allowEmptyString }: { allowEmptyString?: AllowEmpty } = {}
) => (): BoolOrEmptyString<AllowEmpty> => {
  const envValue = process.env[envName]?.trim()

  const isValueDisallowed = !allowEmptyString && envValue?.length === 0
  if (envValue === undefined || isValueDisallowed) {
    throw new ValidationError('Value is not set or it is empty string', envName)
  }

  if (allowEmptyString && envValue.length === 0) {
    return '' as BoolOrEmptyString<AllowEmpty>
  }

  if (envValue?.toLowerCase() === 'true' || envValue === '1') {
    return true as BoolOrEmptyString<AllowEmpty>
  }
  if (envValue?.toLowerCase() === 'false' || envValue === '0') {
    return false as BoolOrEmptyString<AllowEmpty>
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

const isBrowser = typeof window === 'object'

export const getEnvFromFileParser: (env: string, required?: boolean) => () => string = isBrowser
  ? () => {
    throw new Error(`You cant import 'getEnvFromFileParser' in the browser`)
  }
  : // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('./node/parsers').getEnvFromFileParser
