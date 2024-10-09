if (typeof process === 'undefined') {
  // make it compatible for FE environments
  process = window.process
}

export * from './configEnvParsers'
export * from './validateConfig'
export * from './ValidationError'
