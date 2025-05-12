// calculateTotalAmount.test.ts
import { describe, it, expect } from "vitest";
import calculateTotalAmount from "./calculateTotal";

describe("calculateTotalAmount", () => {
  it("calculates the sum of comma-separated numbers", () => {
    // const input = "10,20,30";
    expect(calculateTotalAmount("10,20,30")).toBe(60);
    expect(calculateTotalAmount("50,20,30")).toBe(100);
    expect(calculateTotalAmount("100,200,300")).toBe(600);
  });

  it("calculates the sum of newline-separated numbers", () => {
    // const input = "5\n15\n25";
    expect(calculateTotalAmount("5\n15\n25")).toBe(45);
    expect(calculateTotalAmount("50\n20\n30")).toBe(100);
    expect(calculateTotalAmount("500\n150\n250")).toBe(900);
  });

  it("handles mixed commas and newlines", () => {
    // const input = "1,2\n3,4\n5";
    expect(calculateTotalAmount("1,2\n3,4\n5")).toBe(15);
    expect(calculateTotalAmount("10,25\n35,45\n50")).toBe(165);
    expect(calculateTotalAmount("100\n200\n300,400\n500")).toBe(1500);
  });

  it("ignores extra whitespace and empty entries", () => {
    const input = "  10 , \n 20\n , 30  ";
    expect(calculateTotalAmount(input)).toBe(60);
  });

  it("ignores non-numeric and empty values", () => {
    const input = "100,abc,250,,350\nempty";
    expect(calculateTotalAmount(input)).toBe(700);
    expect(calculateTotalAmount("abc,def,ghi")).toBe(0);
    expect(calculateTotalAmount(",,")).toBe(0);
  });

  it("returns 0 for empty string", () => {
    expect(calculateTotalAmount("")).toBe(0);
  });

  it("handles decimal values correctly", () => {
    const input = "1.5,2.25\n3.75";
    expect(calculateTotalAmount(input)).toBeCloseTo(7.5, 5);
  });
});
