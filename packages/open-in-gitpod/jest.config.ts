/* eslint-disable */
export default {
  displayName: 'open-in-gitpod',

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
  moduleFileExtensions: ['ts', 'tsx', 'json', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/open-in-gitpod',
  preset: '../../jest.preset.js',
};
