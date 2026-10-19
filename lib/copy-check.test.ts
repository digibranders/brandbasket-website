// lib/copy-check.test.ts
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOTS = ["app", "components", "content", "lib"];
const EXTENSIONS = [".ts", ".tsx", ".css", ".md"];
const BANNED = /[–—]/;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return EXTENSIONS.some((ext) => path.endsWith(ext)) ? [path] : [];
  });
}

describe("copy rules", () => {
  it("has no em or en dashes in source copy", () => {
    // Roots that do not exist yet (components/, content/ before they are created) are skipped.
    const offenders = ROOTS.filter((root) => existsSync(root))
      .flatMap((root) => files(root))
      .filter((path) => !path.endsWith("copy-check.test.ts"))
      .flatMap((path) =>
        readFileSync(path, "utf8")
          .split("\n")
          .map((line, i) => ({ path, line: i + 1, text: line }))
          .filter(({ text }) => BANNED.test(text)),
      );
    expect(offenders).toEqual([]);
  });
});
