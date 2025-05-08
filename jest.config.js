const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./frontend",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/frontend/jest.setup.js"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};

module.exports = createJestConfig(customJestConfig);
