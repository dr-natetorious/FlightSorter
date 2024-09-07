module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': 'babel-jest'
    },
    transformIgnorePatterns: [
      "/node_modules/(?!your-module)"
    ],
    testMatch: ['**/tests/**/*.test.ts']
  };
  