import { processEnv } from './envInput'
import { ValidationError } from './ValidationError'

type NumberOrEmptyString<T extends boolean> = T extends true ? '' | number : number

export const getNumberFromEnvParser =
  <AllowEmpty extends boolean = false>(
    envName: string,
    { allowEmptyString }: { allowEmptyString?: AllowEmpty } = {}
  ) =>
  (): NumberOrEmptyString<AllowEmpty> => {
    const envValue = processEnv[envName]?.trim()

    const isValueDisallowed = !allowEmptyString && envValue?.length === 0
    if (envValue === undefined || isValueDisallowed) {
      throw new ValidationError('Value is not set or it is empty string', envName)
    }

    if (allowEmptyString && envValue.length === 0) {
      return '' as NumberOrEmptyString<AllowEmpty>
    }

    const parsedNum = parseFloat(envValue ?? '')

    if (isNaN(parsedNum)) {
      throw new ValidationError('Value is not parsable as number', envName)
    }

    return parsedNum
  }

const defaultTransformFn = (value: string) => value

export const getStringFromEnvParser =
  (
    envName: string,
    {
      allowEmptyString = false,
      pattern = undefined as string | undefined,
      transform = defaultTransformFn,
    } = {}
  ) =>
  () => {
    const envValue = processEnv[envName]?.trim()
    const valueIsEmpty = envValue?.length === 0
    if (envValue === undefined || (valueIsEmpty && !allowEmptyString)) {
      throw new ValidationError('Value is not set or it is empty string', envName)
    }

    // do not check empty values
    if (pattern && !valueIsEmpty) {
      const validator = new RegExp(pattern)
      if (validator.test(envValue) === false) {
        throw new ValidationError(`Value does not match the regex pattern ${pattern}`, envName)
      }
    }
    return transform(envValue)
  }

export const getStringEnumFromEnvParser =
  <T extends string, AllowEmpty extends boolean = false>(
    envName: string,
    possibleEnumValues: readonly T[],
    { allowEmptyString }: { allowEmptyString?: AllowEmpty } = {}
  ) =>
  (): AllowEmpty extends true ? '' | T : T => {
    const envValue = processEnv[envName]?.trim() as T

    const isValueDisallowed = !allowEmptyString && envValue?.length === 0
    if (envValue === undefined || isValueDisallowed) {
      throw new ValidationError('Value is not set or it is empty string', envName)
    }

    if (allowEmptyString && envValue.length === 0) {
      return '' as AllowEmpty extends true ? '' | T : T
    }

    if (!possibleEnumValues.includes(envValue)) {
      throw new ValidationError(
        `Value does not match union: ${possibleEnumValues.join(' | ')}`,
        envName
      )
    }

    return envValue
  }

type BoolOrEmptyString<T extends boolean> = T extends true ? '' | boolean : boolean

export const getBoolFromEnvParser =
  <AllowEmpty extends boolean = false>(
    envName: string,
    { allowEmptyString }: { allowEmptyString?: AllowEmpty } = {}
  ) =>
  (): BoolOrEmptyString<AllowEmpty> => {
    const envValue = processEnv[envName]?.trim()

    const isValueDisallowed = !allowEmptyString && envValue?.length === 0
    if (envValue === undefined || isValueDisallowed) {
      throw new ValidationError('Value is not set or it is empty string', envName)
    }

    if (allowEmptyString && envValue.length === 0) {
      return '' as BoolOrEmptyString<AllowEmpty>
    }

    if (envValue?.toLowerCase() === 'true' || envValue === '1') {
      return true
    }
    if (envValue?.toLowerCase() === 'false' || envValue === '0') {
      return false
    }
    throw new ValidationError('Value is not parsable as boolean', envName)
  }

export const getListFromEnvParser =
  <T = string>(
    envName: string,
    // @ts-expect-error default String does not match function that Returns T
    valueParser: (arg: any) => T = String
  ) =>
  (): T[] => {
    const envValue = processEnv[envName]?.trim()
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
