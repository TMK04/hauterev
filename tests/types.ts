import type { MockedFunction } from "ts-jest";

export type MockedAnyFn = MockedFunction<(...args: any[]) => any>;
