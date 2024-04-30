/* eslint-disable */
export default {
  displayName: 'nx-plugin-openapi',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/nx-plugin-openapi',
  testTimeout: 30_000,
  preset: '../../jest.preset.js',
};
