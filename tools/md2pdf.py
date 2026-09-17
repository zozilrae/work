#!/usr/bin/env python3
"""마크다운 기술보고서를 한글 PDF로 변환한다.

Chromium 인쇄 엔진(Playwright)으로 렌더링하며, 표지·목차·머리말/꼬리말을
자동 구성한다. 문서 첫머리가 아래 형식이면 표지 메타데이터로 인식한다.

    # 보고서 제목

    **문서번호** TR-2026-002
    **작성일** 2026-09-17
    ...

    ---

사용법
    python3 tools/md2pdf.py docs/report.md [out.pdf] [--note "표지 하단 문구"]

의존성
    pip install markdown playwright
    Unifont (코드블록용) — apt-get install unifont

폰트
    본문   Noto Sans KR   — 최초 실행 시 Google Fonts에서 받아 캐시에 보관
    코드   Unifont        — 시스템 설치본. 박스드로잉·대각선·위첨자를 모두 보유하고
                           한글이 라틴 문자의 정확히 2배폭이라 ASCII 도식 정렬이 보존된다.
                           (Nanum Gothic Coding 등 한국어 서브셋 웹폰트는 이 글리프들이
                            빠져 있어 도식이 깨진다.)
    인라인 DejaVu Sans Mono — 정렬이 필요 없으므로 기호 커버리지 우선
"""
import argparse, asyncio, base64, pathlib, re, subprocess, sys, urllib.request

CACHE = pathlib.Path.home() / ".cache" / "md2pdf-fonts"
LEGACY_UA = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0"
CHROMIUM_GLOB = "/opt/pw-browsers/chromium-*/chrome-linux/chrome"


def fetch_font(family: str, weight: int, dest: pathlib.Path) -> None:
    """Google Fonts v1 API에서 단일 woff를 받는다.

    구형 UA를 써야 서브셋 woff2 묶음 대신 통짜 woff가 온다.
    subset=korean 을 붙이지 않으면 한글이 빠진 라틴 서브셋(약 17 KB)이 내려온다.
    """
    css_url = (f"https://fonts.googleapis.com/css?family={family.replace(' ', '+')}"
               f":{weight}&subset=korean")
    req = urllib.request.Request(css_url, headers={"User-Agent": LEGACY_UA})
    css = urllib.request.urlopen(req, timeout=60).read().decode()
    m = re.search(r"https://[^)]+", css)
    if not m:
        raise RuntimeError(f"{family} {weight} 폰트 URL을 찾지 못했다")
    dest.write_bytes(urllib.request.urlopen(m.group(0), timeout=120).read())
    if dest.stat().st_size < 100_000:
        raise RuntimeError(f"{dest.name}: 한글이 빠진 서브셋으로 보인다 "
                           f"({dest.stat().st_size} B)")


def ensure_fonts(font_dir: pathlib.Path) -> str:
    font_dir.mkdir(parents=True, exist_ok=True)
    faces = []
    for weight in (400, 700):
        path = font_dir / f"notosanskr-{weight}.woff"
        if not path.exists():
            print(f"  폰트 내려받는 중: Noto Sans KR {weight}", file=sys.stderr)
            fetch_font("Noto Sans KR", weight, path)
        b64 = base64.b64encode(path.read_bytes()).decode()
        faces.append(f"@font-face{{font-family:'NotoKR';font-style:normal;"
                     f"font-weight:{weight};src:url(data:font/woff;base64,{b64}) "
                     f"format('woff');font-display:block;}}")
    return "".join(faces)


def check_unifont() -> None:
    try:
        out = subprocess.run(["fc-list", ":family=Unifont"], capture_output=True,
                             text=True, timeout=20).stdout
    except (FileNotFoundError, subprocess.SubprocessError):
        return  # fc-list가 없으면 확인을 건너뛴다
    if not out.strip():
        print("  경고: Unifont가 없다. ASCII 도식의 박스드로잉·대각선이 깨질 수 있다.\n"
              "        apt-get install unifont", file=sys.stderr)


def find_chromium() -> str | None:
    hits = sorted(pathlib.Path("/").glob(CHROMIUM_GLOB.lstrip("/")))
    return str(hits[-1]) if hits else None


CSS = """
*{box-sizing:border-box}
@page{size:A4;margin:19mm 16mm 17mm 16mm}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'NotoKR',sans-serif;font-size:9.6pt;line-height:1.62;color:#16191d;margin:0;
     word-break:keep-all;overflow-wrap:break-word}

.cover{height:252mm;display:flex;flex-direction:column;justify-content:center;page-break-after:always}
.cover .rule{height:3px;background:#16191d;margin-bottom:9mm}
.cover h1{font-size:23pt;font-weight:700;line-height:1.38;margin:0 0 11mm;letter-spacing:-.02em}
.cover table{border-collapse:collapse;font-size:9.6pt;width:100%;max-width:135mm}
.cover th{text-align:left;font-weight:700;color:#5b6572;width:24mm;padding:2.6mm 0;vertical-align:top;
          white-space:nowrap}
.cover td{padding:2.6mm 0;vertical-align:top}
.cover .note{margin-top:14mm;font-size:8.4pt;color:#78828f;line-height:1.7}

.toc-page{page-break-after:always}
.toc-page h2{margin-top:0}
ul.toc{list-style:none;padding:0;margin:0;font-size:9.4pt;column-count:2;column-gap:9mm}
ul.toc li{margin:0 0 1.5mm;break-inside:avoid}
ul.toc li.l2{font-weight:700;margin-top:3mm}
ul.toc li.l2:first-child{margin-top:0}
ul.toc li.l3{padding-left:4.5mm;font-size:8.9pt;color:#4a5461}
ul.toc a{color:inherit;text-decoration:none}

h2{font-size:14pt;font-weight:700;margin:11mm 0 4mm;padding-top:3mm;border-top:2.5px solid #16191d;
   letter-spacing:-.015em;page-break-after:avoid;page-break-inside:avoid}
h3{font-size:11.2pt;font-weight:700;margin:7mm 0 2.6mm;color:#1f2933;page-break-after:avoid}
h4{font-size:9.9pt;font-weight:700;margin:5mm 0 2mm;color:#3c4653;page-break-after:avoid}
p{margin:0 0 2.8mm;text-align:justify}
strong{font-weight:700;color:#0b0e12}
a{color:#1a4f9c;text-decoration:none;word-break:break-all}
hr{border:0;border-top:1px solid #e3e7ec;margin:8mm 0}
ul,ol{margin:0 0 3mm;padding-left:5.5mm}
li{margin-bottom:1.3mm}

blockquote{margin:3.5mm 0;padding:3mm 4mm;background:#fff8e6;border-left:3px solid #d99b16;
           page-break-inside:avoid}
blockquote p:last-child{margin-bottom:0}

table{border-collapse:collapse;width:100%;margin:3mm 0 4.5mm;font-size:8.5pt;line-height:1.5;
      page-break-inside:avoid}
th,td{border:1px solid #d5dae1;padding:1.7mm 2.2mm;text-align:left;vertical-align:top}
th{background:#f1f4f7;font-weight:700;color:#1f2933}
tbody tr:nth-child(even){background:#fafbfc}

pre{font-family:'Unifont',monospace;font-size:8.6pt;line-height:1.5;background:#f6f8fa;
    border:1px solid #e0e5ea;border-radius:3px;padding:3mm 3.5mm;margin:3mm 0 4mm;
    white-space:pre;overflow:hidden;page-break-inside:avoid}
code{font-family:'DejaVu Sans Mono','NotoKR',monospace;font-size:8.4pt;background:#eef1f5;
     padding:.3mm 1mm;border-radius:2px}
pre code{background:none;padding:0;font-size:inherit}
"""


def build_html(src: pathlib.Path, fonts_css: str, note: str | None) -> tuple[str, dict]:
    import markdown

    text = src.read_text(encoding="utf-8")
    lines = text.split("\n")
    title = lines[0].lstrip("# ").strip()
    rest = "\n".join(lines[1:])

    # 제목 다음의 `**키** 값` 블록을 표지 메타데이터로 분리한다.
    meta, rows = {}, []
    if "\n---\n" in rest:
        head, body_md = rest.split("\n---\n", 1)
        if re.search(r"^\*\*.+?\*\*", head.strip(), re.M):
            for ln in head.strip().split("\n"):
                m = re.match(r"\*\*(.+?)\*\*\s*(.*)", ln.strip())
                if m:
                    meta[m.group(1)] = re.sub(r"<[^>]+>", "", m.group(2))
                    val = re.sub(r"「(.+?)」", r"<em>\1</em>", m.group(2))
                    rows.append(f"<tr><th>{m.group(1)}</th><td>{val}</td></tr>")
        else:
            body_md = rest
    else:
        body_md = rest

    md = markdown.Markdown(extensions=["tables", "fenced_code", "nl2br", "toc", "sane_lists"])
    body_html = md.convert(body_md)

    items = []
    for tok in md.toc_tokens:
        items.append(f'<li class="l2"><a href="#{tok["id"]}">{tok["name"]}</a></li>')
        for sub in tok["children"]:
            items.append(f'<li class="l3"><a href="#{sub["id"]}">{sub["name"]}</a></li>')
    toc_html = "<ul class='toc'>" + "".join(items) + "</ul>"

    cover = ""
    if rows:
        note_html = f"<div class='note'>{note}</div>" if note else ""
        cover = (f"<section class='cover'><div class='rule'></div><h1>{title}</h1>"
                 f"<table>{''.join(rows)}</table>{note_html}</section>")

    html = (f"<!DOCTYPE html><html lang='ko'><head><meta charset='utf-8'>"
            f"<title>{title}</title><style>{fonts_css}{CSS}</style></head><body>"
            f"{cover}<section class='toc-page'><h2>목차</h2>{toc_html}</section>"
            f"{body_html}</body></html>")
    meta.setdefault("제목", title)
    return html, meta


async def render(html_path: pathlib.Path, out: pathlib.Path, meta: dict) -> None:
    from playwright.async_api import async_playwright

    doc_no = meta.get("문서번호", "")
    foot_left = " · ".join(x for x in (meta.get("제목", ""), meta.get("작성일", "")) if x)
    style = "font-size:7.5pt;color:#8b95a1;width:100%;padding:0 16mm;font-family:sans-serif"
    async with async_playwright() as pw:
        launch = {"executable_path": find_chromium()} if find_chromium() else {}
        browser = await pw.chromium.launch(**launch)
        page = await browser.new_page()
        await page.goto(html_path.as_uri(), wait_until="networkidle")
        await page.evaluate("document.fonts.ready")
        await page.pdf(
            path=str(out), format="A4", print_background=True,
            margin={"top": "19mm", "bottom": "17mm", "left": "16mm", "right": "16mm"},
            display_header_footer=True,
            header_template=f"<div style='{style};font-size:7pt;text-align:right'>{doc_no}</div>",
            footer_template=(f"<div style='{style};display:flex;justify-content:space-between'>"
                             f"<span>{foot_left}</span><span class='pageNumber'></span></div>"))
        await browser.close()


def main() -> None:
    ap = argparse.ArgumentParser(description="마크다운 보고서 → 한글 PDF")
    ap.add_argument("source", type=pathlib.Path, help="입력 마크다운")
    ap.add_argument("output", type=pathlib.Path, nargs="?", help="출력 PDF (기본: 같은 경로 .pdf)")
    ap.add_argument("--note", help="표지 하단에 넣을 문구")
    ap.add_argument("--font-dir", type=pathlib.Path, default=CACHE, help=f"폰트 캐시 (기본: {CACHE})")
    ap.add_argument("--keep-html", action="store_true", help="중간 HTML을 남긴다")
    args = ap.parse_args()

    out = (args.output or args.source.with_suffix(".pdf")).resolve()
    check_unifont()
    fonts_css = ensure_fonts(args.font_dir)
    html, meta = build_html(args.source, fonts_css, args.note)

    html_path = out.with_suffix(".tmp.html")
    html_path.write_text(html, encoding="utf-8")
    try:
        asyncio.run(render(html_path, out, meta))
    finally:
        if not args.keep_html:
            html_path.unlink(missing_ok=True)
    print(f"생성 완료: {out} ({out.stat().st_size / 1024 / 1024:.2f} MB)")


if __name__ == "__main__":
    main()
