import { pathsToModuleNameMapper } from 'ts-jest/utils'

import { compilerOptions } from './tsconfig.json'

export default {
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/@types/*.ts',
    '!src/**/config/*.ts',
    '!src/infra/**/*.ts',
    '!src/core/infra/*.ts',
    '!src/**/mappers/*.ts',
    '!src/**/errors/*.ts',
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src',
  }),
  preset: 'ts-jest',
}
