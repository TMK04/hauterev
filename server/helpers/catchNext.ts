import type { NextFunction } from "express";

const catchNext = <T>(fn: () => Promise<T>, next: NextFunction) => fn().catch(next);

export default catchNext;
