import type { InitialOptionsTsJest } from "ts-jest/dist/types";

const config: InitialOptionsTsJest = {
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1"
  },
  moduleDirectories: ["node_modules", "src"],
  preset: "ts-jest",
  testEnvironment: "node"
};

export default config;
