import { describe, expect, test } from "bun:test";
import { extractParams, pickTitleFontSize } from "../src/lib/og-helpers";

describe("extractParams", () => {
  test("returns defaults when no input", () => {
    expect(extractParams(undefined)).toEqual({
      title: "patapata",
      eyebrow: "@love-rox/ptpt-*",
      author: "Love-Rox",
    });
  });

  test("returns defaults when input is not an object", () => {
    expect(extractParams("not an object")).toEqual({
      title: "patapata",
      eyebrow: "@love-rox/ptpt-*",
      author: "Love-Rox",
    });
  });

  test("parses url string with all params", () => {
    const input = {
      url: "https://example.com/api/og?title=Hello&eyebrow=Blog&author=Roxチーム",
    };
    expect(extractParams(input)).toEqual({
      title: "Hello",
      eyebrow: "Blog",
      author: "Roxチーム",
    });
  });

  test("falls back to defaults for missing url params", () => {
    const input = { url: "https://example.com/api/og?title=OnlyTitle" };
    expect(extractParams(input)).toEqual({
      title: "OnlyTitle",
      eyebrow: "@love-rox/ptpt-*",
      author: "Love-Rox",
    });
  });

  test("ignores invalid url and falls through", () => {
    const input = { url: "::not a url::", query: { title: "FromQuery" } };
    expect(extractParams(input).title).toBe("FromQuery");
  });

  test("reads searchParams object", () => {
    const sp = new URLSearchParams({ title: "Foo", author: "Bar" });
    expect(extractParams({ searchParams: sp })).toEqual({
      title: "Foo",
      eyebrow: "@love-rox/ptpt-*",
      author: "Bar",
    });
  });

  test("parses query string", () => {
    expect(extractParams({ query: "title=A&eyebrow=B&author=C" })).toEqual({
      title: "A",
      eyebrow: "B",
      author: "C",
    });
  });

  test("reads query object", () => {
    expect(extractParams({ query: { title: "X", eyebrow: "Y", author: "Z" } })).toEqual({
      title: "X",
      eyebrow: "Y",
      author: "Z",
    });
  });

  test("ignores non-string values in query object", () => {
    expect(extractParams({ query: { title: 42, eyebrow: null, author: undefined } })).toEqual({
      title: "patapata",
      eyebrow: "@love-rox/ptpt-*",
      author: "Love-Rox",
    });
  });

  test("handles Japanese title in url", () => {
    const input = {
      url: `https://x/api/og?title=${encodeURIComponent("縦中横の話")}`,
    };
    expect(extractParams(input).title).toBe("縦中横の話");
  });
});

describe("pickTitleFontSize", () => {
  test("largest size for very short titles", () => {
    expect(pickTitleFontSize("tcy")).toBe(128);
    expect(pickTitleFontSize("12345678")).toBe(128);
  });

  test("step down at 8/16/26/40 char boundaries", () => {
    expect(pickTitleFontSize("a".repeat(9))).toBe(104);
    expect(pickTitleFontSize("a".repeat(16))).toBe(104);
    expect(pickTitleFontSize("a".repeat(17))).toBe(84);
    expect(pickTitleFontSize("a".repeat(26))).toBe(84);
    expect(pickTitleFontSize("a".repeat(27))).toBe(68);
    expect(pickTitleFontSize("a".repeat(40))).toBe(68);
    expect(pickTitleFontSize("a".repeat(41))).toBe(56);
  });

  test("counts code points, not UTF-16 units (surrogate pair safety)", () => {
    // "𠮷" is a surrogate pair: .length === 2 but [...str].length === 1.
    // pickTitleFontSize must count it as one character.
    const tenSurrogates = "𠮷".repeat(10);
    expect(tenSurrogates.length).toBe(20);
    expect([...tenSurrogates].length).toBe(10);
    expect(pickTitleFontSize(tenSurrogates)).toBe(104);
  });

  test("Japanese character counting", () => {
    expect(pickTitleFontSize("縦中横")).toBe(128);
    expect(pickTitleFontSize("tate-chu-yoko v0.2.0 リリース")).toBe(84);
  });
});
