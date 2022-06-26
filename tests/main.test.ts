import { describe, test, expect } from "vitest";
import { hello } from "../src/main";

describe("sample", () => {
  test("hello", () => {
    expect(hello()).toMatch("hello!");
  });
});
