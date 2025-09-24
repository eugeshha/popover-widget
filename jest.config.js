module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/js/setupTests.js"],
  moduleNameMapping: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  collectCoverageFrom: ["src/**/*.js", "!src/**/*.test.js", "!src/index.js"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};
