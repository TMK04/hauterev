import { NextFunction } from "express";

export const catchNext = <T>(fn: () => Promise<T>, next: NextFunction) => fn().catch(next);
