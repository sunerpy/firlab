import { describe, expect, it } from "vitest";

import { inline, inlineLinks } from "../src/.vitepress/theme/components/inline";

describe("inline", () => {
  it("marks dropped words, links and line breaks, and escapes everything else", () => {
    expect(inline("~~um~~ <b>so</b> & then")).toBe("<del>um</del> &lt;b&gt;so&lt;/b&gt; &amp; then");
    expect(inline("one\ntwo")).toBe("one<br>two");
    expect(inline("see [Privacy](/privacy)")).toBe('see <a href="/privacy">Privacy</a>');
    expect(inline("[GitHub](https://github.com/sunerpy/voltip)")).toBe(
      '<a href="https://github.com/sunerpy/voltip" target="_blank" rel="noreferrer">GitHub</a>',
    );
  });

  it("leaves a link to anything but a site path or a web address as text", () => {
    expect(inline("[x](javascript:alert(1))")).toBe("[x](javascript:alert(1))");
    expect(inline('[x](/a"onmouseover="b)')).toBe('<a href="/a&quot;onmouseover=&quot;b">x</a>');
  });

  it("applies the base to site paths and lists every link target", () => {
    expect(inline("[a](/zh/phone/)", (p) => `/base${p}`)).toBe('<a href="/base/zh/phone/">a</a>');
    expect(inlineLinks("[a](/x) and [b](https://y.test/z#q)")).toEqual(["/x", "https://y.test/z#q"]);
  });
});
