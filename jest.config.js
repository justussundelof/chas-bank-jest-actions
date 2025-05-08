const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./frontend",  // Path to your frontend directory
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/frontend/jest.setup.js"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",  // Use ts-jest for TypeScript files
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",  // Handle CSS imports
  },
  globals: {
    "ts-jest": {
      tsconfig: "frontend/tsconfig.json",  // Path to your TypeScript config
    },
  },
};

module.exports = createJestConfig(customJestConfig);
