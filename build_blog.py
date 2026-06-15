"""
Selectly blog builder — converteert /blog/*.md naar HTML met Selectly styling
en genereert een /blog/index.html overzichtspagina.

Run vanuit ~/selectly-v2/:
    python3 build_blog.py

Output:
    /blog/<slug>.html (per markdown bestand)
    /blog/index.html (overzicht)
"""
from __future__ import annotations

import re
import subprocess
from datetime import datetime
from pathlib import Path

try:
    import markdown
except ImportError:
    raise SystemExit("Run: pip3 install markdown")

ROOT = Path(__file__).parent
BLOG_DIR = ROOT / "blog"


HEAD = """<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — Selectly</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://selectly.be/blog/{slug}.html">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {{ theme: {{ extend: {{
    fontFamily: {{ sans: ['Inter','system-ui','sans-serif'] }},
    colors: {{
      ink: {{ 950:'#0a0e1a', 900:'#0f172a', 800:'#1e293b', 700:'#334155' }},
      accent: {{ 500:'#7c3aed', 400:'#a78bfa' }}
    }}
  }} }} }};
</script>
<style>
  body {{ font-family: 'Inter', system-ui, sans-serif; }}
  article h1 {{ font-size:2.4rem; font-weight:800; letter-spacing:-0.02em; margin: 0.5rem 0 1.2rem; line-height:1.15; color:#0f172a; }}
  article h2 {{ font-size:1.5rem; font-weight:700; margin: 2.2rem 0 0.8rem; color:#1e293b; border-left:4px solid #7c3aed; padding-left:0.7rem; }}
  article h3 {{ font-size:1.15rem; font-weight:700; margin: 1.6rem 0 0.5rem; color:#334155; }}
  article p {{ margin: 0.7rem 0; line-height: 1.7; color:#334155; }}
  article ul, article ol {{ padding-left: 1.5rem; margin: 0.7rem 0; color:#334155; }}
  article li {{ margin: 0.3rem 0; line-height: 1.7; }}
  article table {{ width:100%; border-collapse:collapse; margin: 1.2rem 0; font-size:0.95rem; }}
  article th, article td {{ border:1px solid #e2e8f0; padding:0.55rem 0.8rem; text-align:left; vertical-align:top; }}
  article th {{ background:#f8fafc; font-weight:600; color:#0f172a; }}
  article blockquote {{ border-left:4px solid #cbd5e1; padding-left:1rem; color:#64748b; margin:1rem 0; font-style:italic; }}
  article code {{ background:#f1f5f9; padding:0.1rem 0.35rem; border-radius:4px; font-size:0.92em; color:#0f172a; }}
  article pre {{ background:#0f172a; color:#e2e8f0; padding:1rem; border-radius:8px; overflow-x:auto; }}
  article hr {{ border:none; border-top:1px solid #e2e8f0; margin:2rem 0; }}
  article strong {{ color:#0f172a; }}
</style>
</head>
<body class="bg-white text-ink-900">

<nav class="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-slate-200">
  <div class="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-blue-500 flex items-center justify-center text-white font-bold" style="background:linear-gradient(135deg,#7c3aed,#2563eb);">S</div>
      <span class="text-xl font-bold tracking-tight">Selectly</span>
    </a>
    <div class="flex items-center gap-6 text-sm">
      <a href="/" class="hidden sm:inline text-ink-700 hover:text-ink-900">Home</a>
      <a href="/calculator.html" class="hidden sm:inline text-ink-700 hover:text-ink-900">Calculator</a>
      <a href="/blog/" class="hidden sm:inline text-ink-700 hover:text-ink-900">Blog</a>
      <a href="/#contact" class="bg-ink-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink-800">Plan gesprek</a>
    </div>
  </div>
</nav>
"""

ARTICLE_WRAPPER = """
<main class="max-w-3xl mx-auto px-5 py-12 sm:py-16">
  <div class="text-xs uppercase tracking-wider text-accent-500 font-semibold mb-3">Blog</div>
  <article>
{body}
  </article>

  <div class="mt-16 pt-10 border-t border-slate-200">
    <a href="/blog/" class="text-sm text-ink-700 hover:text-ink-900">← Terug naar overzicht</a>
  </div>

  <div class="mt-12 bg-ink-900 text-white rounded-2xl p-8">
    <h3 class="text-xl font-bold mb-2">Plan een 30 min strategie gesprek</h3>
    <p class="text-slate-300 text-sm mb-5">Geen verkooppitch. We kijken naar je huidige flow en geven een eerlijk ja/nee advies.</p>
    <a href="/#contact" class="inline-block bg-white text-ink-900 font-semibold px-5 py-3 rounded-lg hover:bg-slate-100">Plan gesprek</a>
  </div>
</main>
"""

FOOTER = """
<footer class="bg-ink-950 text-slate-400 mt-20 py-12">
  <div class="max-w-5xl mx-auto px-5 grid sm:grid-cols-3 gap-8 text-sm">
    <div>
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style="background:linear-gradient(135deg,#7c3aed,#2563eb);">S</div>
        <span class="font-bold text-white">Selectly</span>
      </div>
      <p>AI automation voor Belgische KMO's. Live binnen 4 weken.</p>
    </div>
    <div>
      <div class="text-white font-semibold mb-2">Navigatie</div>
      <ul class="space-y-1">
        <li><a href="/" class="hover:text-white">Home</a></li>
        <li><a href="/calculator.html" class="hover:text-white">Calculator</a></li>
        <li><a href="/blog/" class="hover:text-white">Blog</a></li>
      </ul>
    </div>
    <div>
      <div class="text-white font-semibold mb-2">Legal</div>
      <ul class="space-y-1">
        <li><a href="/privacy.html" class="hover:text-white">Privacy</a></li>
        <li><a href="/voorwaarden.html" class="hover:text-white">Voorwaarden</a></li>
        <li>BTW BE1037.580.195</li>
      </ul>
    </div>
  </div>
</footer>
</body>
</html>
"""


def derive_meta(md_text: str, fallback_title: str) -> tuple[str, str, str]:
    """Return (title, description, reading_time)."""
    title = fallback_title
    desc = ""
    for line in md_text.splitlines()[:5]:
        if line.startswith("# "):
            title = line[2:].strip()
            break
    # First paragraph after title for description
    body_after_title = re.split(r"\n# .+\n", md_text, maxsplit=1)
    body = body_after_title[-1]
    paras = [p.strip() for p in body.split("\n\n") if p.strip() and not p.startswith("#")]
    if paras:
        first = re.sub(r"\*\*|`", "", paras[0])
        desc = first[:170].rsplit(" ", 1)[0] + "…" if len(first) > 170 else first

    word_count = len(re.findall(r"\w+", md_text))
    reading = max(1, round(word_count / 200))
    return title, desc, f"{reading} min"


def build_post(md_path: Path) -> dict:
    md_text = md_path.read_text()
    title, desc, read_time = derive_meta(md_text, md_path.stem.replace("-", " ").title())
    slug = md_path.stem
    html_body = markdown.markdown(md_text, extensions=["tables", "fenced_code"])

    html = HEAD.format(title=title, desc=desc, slug=slug) + \
           ARTICLE_WRAPPER.format(body=html_body) + FOOTER

    out = BLOG_DIR / f"{slug}.html"
    out.write_text(html)

    return {
        "slug": slug,
        "title": title,
        "description": desc,
        "reading_time": read_time,
        "mtime": md_path.stat().st_mtime,
    }


def build_index(posts: list[dict]) -> None:
    posts_sorted = sorted(posts, key=lambda p: p["mtime"], reverse=True)
    cards = []
    for p in posts_sorted:
        cards.append(f"""
        <a href="/blog/{p['slug']}.html" class="block bg-white border border-slate-200 rounded-2xl p-7 hover:border-accent-500 transition shadow-sm hover:shadow-md">
          <div class="text-xs uppercase tracking-wider text-accent-500 font-semibold mb-3">{p['reading_time']} lezen</div>
          <h2 class="text-xl font-bold mb-2 text-ink-900">{p['title']}</h2>
          <p class="text-slate-600 text-sm leading-relaxed">{p['description']}</p>
          <div class="mt-4 text-sm text-accent-500 font-semibold">Lees artikel →</div>
        </a>""")

    html = HEAD.format(title="Blog", desc="Artikels van Selectly over AI automation, GHL implementatie en KMO automatisering.", slug="index") + f"""
<main class="max-w-5xl mx-auto px-5 py-12 sm:py-16">
  <header class="mb-12">
    <div class="text-sm font-semibold text-accent-500 uppercase tracking-wider mb-2">Blog</div>
    <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-ink-900 mb-3">Wat we leren tijdens het bouwen</h1>
    <p class="text-lg text-slate-700 max-w-2xl">Geen consultancy-praat. Concrete inzichten over AI automation, GoHighLevel en wat wel of niet werkt bij Belgische KMO's.</p>
  </header>
  <div class="grid md:grid-cols-2 gap-6">
    {''.join(cards)}
  </div>
</main>
""" + FOOTER

    (BLOG_DIR / "index.html").write_text(html)


def main():
    if not BLOG_DIR.exists():
        print("blog/ directory niet gevonden")
        return

    md_files = sorted(BLOG_DIR.glob("*.md"))
    if not md_files:
        print("Geen .md files gevonden in blog/")
        return

    posts = []
    for md in md_files:
        info = build_post(md)
        posts.append(info)
        print(f"  ✓ {info['slug']}.html ({info['reading_time']})")

    build_index(posts)
    print(f"\n✓ {len(posts)} blog posts + index.html gebouwd in {BLOG_DIR}")


if __name__ == "__main__":
    main()
