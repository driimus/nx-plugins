/* eslint-disable */
import type { Config } from 'jest';

module.exports = {
  displayName: 'nx-plugin-openapi',

  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/nx-plugin-openapi',
  preset: '../../jest.preset.js',
} satisfies Config;
