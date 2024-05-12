/* eslint-disable */
export default {
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
  testTimeout: 30_000,
  preset: '../../jest.preset.js',
};
