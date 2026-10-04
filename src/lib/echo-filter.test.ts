import { describe, it, expect } from "vitest";
import { EchoFilter, jaccard } from "./echo-filter";

describe("jaccard", () => {
  it("scores identical and unrelated text", () => {
    expect(jaccard("Pourquoi je paierais 19 dollars ?", "pourquoi je paierais 19 dollars")).toBe(1);
    expect(jaccard("How long does it take?", "Let me show you the dashboard")).toBe(0);
    expect(jaccard("", "anything")).toBe(0);
  });
});

describe("EchoFilter", () => {
  it("drops a mic turn that repeats a recent prospect turn", () => {
    const f = new EchoFilter();
    f.addThem("Honestly the price feels high for a team of ten.", 1_000);
    expect(f.isEcho("honestly the price feels high for team of ten", 2_500)).toBe(true);
    expect(f.isEcho("Fair question, your CRM records the call.", 2_500)).toBe(false);
  });

  it("forgets prospect turns outside the window", () => {
    const f = new EchoFilter();
    f.addThem("Honestly the price feels high.", 1_000);
    expect(f.isEcho("Honestly the price feels high.", 20_000)).toBe(false);
  });
});
