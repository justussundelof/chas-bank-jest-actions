/* const nextJest = require("next/jest");

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
 */

module.exports = {
    preset: 'ts-jest',      // Use ts-jest preset for transforming TypeScript
    testEnvironment: 'node', // You can change this if you're working in the browser (e.g., 'jsdom')
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest', // Transform TypeScript and TSX files
    },
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',  // Make sure Jest uses your TypeScript config
      },
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],  // Add TS/TSX file extensions
    // other Jest configurations if needed
  };
  