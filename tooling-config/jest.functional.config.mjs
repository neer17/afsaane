export default {
  testEnvironment: "node",
  testEnvironmentOptions: {
    NODE_ENV: "test",
  },
  preset: 'ts-jest/presets/default-esm',
  rootDir: "../",
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    '^@[a-z]*/(.*).js$': '<rootDir>/src/$1'
  },
  restoreMocks: true,
  coveragePathIgnorePatterns: [
    "node_modules",
    "<rootDir>/src/config",
    "<rootDir>src/*/api/(controllers|router)",
    "<rootDir>src/*/cmd",
    "<rootDir>src/*/database"
  ],
  transform: {},
  transformIgnorePatterns: [
      "<rootDir>/node_modules",
  ],
  coverageReporters: ["text", "lcov", "clover", "html"],
  coverageDirectory: "./coverageReport/",
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "test-results",
        outputName: "jest-junit.xml",
        suiteName: "DOL Nodejs boilerplate service functional tests",
      },
    ],
  ],
  testMatch: [
    "<rootDir>/src/**/api/**/*.functional.test.ts",
  ],
};
