import type { InitialOptionsTsJest } from "ts-jest";

const config: InitialOptionsTsJest = {
  globals: { "ts-jest": { tsconfig: "tests/tsconfig.json" } },
  forceExit: true,
  moduleDirectories: ["tests", "server", "node_modules"],
  preset: "ts-jest",
  testEnvironment: "node"
};

export default config;
