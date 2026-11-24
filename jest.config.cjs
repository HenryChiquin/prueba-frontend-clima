const nextJest = require('next/jest');

module.exports = nextJest({ dir: './' })({
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  coverageProvider: 'v8',
  collectCoverageFrom: ['app/**/*.js'],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
});
