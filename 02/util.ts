import fs from "node:fs";
import path from "node:path";

export const readLines = (fileName: string) => {
  const data = fs.readFileSync(
    path.resolve(import.meta.dirname, fileName),
    "utf-8"
  );
  return data
    .trim()
    .split("\n")
    .map((s) => s.trim());
};

export const compNumbers = (a: number, b: number) => a - b;

export const parseNumbers = (s: string) =>
  s
    .trim()
    .split(/\s+/)
    .map((s) => Number.parseInt(s));
