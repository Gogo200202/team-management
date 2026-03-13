import type { Config } from "jest";

const config: Config = {
  verbose: true,
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: { "\\.(css|less|sass|scss)$": "identity-obj-proxy" },
  transform: { "^.+\\.(t|j)sx?$": "babel-jest" },
};

export default config;
