# reports — 기술 조사 보고서

한국어 기술보고서를 쓰고 A4 PDF로 내는 항목이다. 산출물은 `reports/docs/` 의 마크다운 원본과 같은 이름의 PDF이며, `reports/tools/md2pdf.py` 는 그 PDF를 만들기 위한 단일 목적 스크립트다. 빌드·테스트·린트 설정은 없다.

- `reports/docs/` — 보고서 원본(`.md`)과 산출 PDF. 둘 다 커밋한다.
- `reports/tools/` — `md2pdf.py` 하나. 사용법과 폰트 선택 근거는 `reports/tools/README.md` 에 있다.
- `reports/notes/` — 작업용 메모 폴더.
- `reports/README.md` — 보고서 목록 표 + 보고서별 개요. **문서를 추가/변경하면 반드시 함께 갱신한다.**

## PDF 생성

아래 명령은 모두 저장소 루트에서 실행한다.

```bash
python3 reports/tools/md2pdf.py reports/docs/report.md              # reports/docs/report.pdf
python3 reports/tools/md2pdf.py reports/docs/report.md out.pdf --note "표지 하단 문구"
python3 reports/tools/md2pdf.py reports/docs/report.md --keep-html  # 중간 HTML 보존(레이아웃 디버깅)
```

기존 산출물 재생성:

```bash
python3 reports/tools/md2pdf.py reports/docs/self-pulse-heating-lib-assb-report.md \
  --note "본 문서의 정량 데이터는 2026년 9월 기준 공개 문헌 및 제조사 발표자료에 근거한다."
```

의존성: `pip install markdown playwright` + 시스템 `unifont`. Chromium은 `/opt/pw-browsers/chromium-*/chrome-linux/chrome` 를 먼저 찾고 없으면 Playwright 기본 경로를 쓴다(이 환경에는 이미 설치되어 있으므로 `playwright install` 을 실행하지 말 것).

결과 확인은 렌더링해서 눈으로 본다 — 특히 ASCII 도식이 들어간 페이지:

```bash
python3 -c "
import pypdfium2 as pdfium
pdf = pdfium.PdfDocument('reports/docs/report.pdf')
print('페이지:', len(pdf))
pdf[0].render(scale=2).to_pil().save('/tmp/p1.png')"
```

## 보고서 문서 규약

`md2pdf.py` 가 파싱하는 형식이므로 구조를 지켜야 표지·목차·머리말이 생성된다.

```markdown
# 보고서 제목

**문서번호** TR-2026-002
**작성일** 2026-09-17
**주제** ...
**분류** 실무 기술보고서 (엔지니어링 검토용)
**선행문서** TR-2026-001 「...」(2026-09-14)

---

## 요약 (Executive Summary)
## 1. 서론
...
## 부록 A. 주요 수식 정리
## 참고문헌
```

- 제목 다음 `**키** 값` 블록이 표지 메타데이터가 된다. 이 블록과 `---` 이 없으면 표지가 만들어지지 않는다. `문서번호` → 각 페이지 머리말, `제목 · 작성일` → 꼬리말. 표지 값 안의 `「…」` 는 이탤릭으로 렌더된다.
- 문서번호는 `TR-<연도>-<3자리>` 순번. 선행 문서를 확장하는 보고서는 `**선행문서**` 로 연결한다.
- 목차는 `##`/`###` 두 단계만 자동 수집된다. 본문 절 제목은 `## N. 제목` / `### N.M 제목` 번호 체계를 따른다.
- 구성 순서는 두 기존 보고서가 공유한다: 요약 → 서론 → 본론 → 실무 도입 지침 → 한계 및 향후 과제 → 결론 및 권고 → 부록(수식 정리, 파라미터 초기값) → 참고문헌.
- 참고문헌은 주제별 `###` 소제목 아래 번호 매긴 목록, 각 항목에 DOI 또는 URL을 넣는다. 본문에서 `[1]` 식으로 번호를 달지는 않는다.

### 마크다운 작성 시 주의

- **문단은 한 줄로 쓴다.** `nl2br` 확장이 켜져 있어 문단 중간의 개행이 PDF에서 그대로 줄바꿈이 된다.
- 수식·도식은 코드블록(```` ``` ````)에 유니코드 평문으로 넣는다. LaTeX/MathJax는 쓰지 않는다. 아래첨자는 `R_ct`, 위첨자는 `⁻²`, 그리스 문자는 `Ω σ μ` 처럼 직접 쓴다.
- ASCII 도식은 박스드로잉(`─│┌┘┬`)·대각선(`╲╱`)·화살표(`→↑`)를 쓰고 **공백으로 열을 맞춘다.** 코드블록 폰트가 Unifont인 이유가 이것이다 — 필요한 글리프를 모두 갖고 있고 한글이 라틴 문자의 정확히 2배폭이라 한글 레이블이 섞여도 정렬이 유지된다. 도식을 편집하면 PDF를 다시 렌더해 정렬을 확인한다.
- `pre` 는 `overflow:hidden` 이므로 코드블록 한 줄이 본문폭을 넘으면 잘린다. A4 본문폭은 Unifont 8.6pt 기준 약 110칸(한글은 2칸)이고, 기존 보고서의 도식은 84칸 이내다. 여유를 두고 90칸 안쪽으로 맞춘다.

## md2pdf.py 구조

`마크다운 → HTML(폰트 임베드 + 인쇄용 CSS) → Chromium page.pdf()` 단일 파이프라인.

- `build_html()` — 표지 메타 분리, `markdown` 변환(`tables, fenced_code, nl2br, toc, sane_lists`), `md.toc_tokens` 로 2단 목차 생성.
- `ensure_fonts()` — Noto Sans KR woff를 `~/.cache/md2pdf-fonts` 에 캐시해 base64로 임베드. Google Fonts v1 API 호출에 **구형 User-Agent**(없으면 woff2 묶음이 옴)와 **`subset=korean`**(없으면 한글 빠진 17 KB 라틴 서브셋이 옴)이 둘 다 필요하다. 100 KB 미만이면 서브셋으로 보고 실패시킨다.
- 인쇄 레이아웃은 모듈 상수 `CSS` 에 모여 있다(A4, 여백, 표/코드블록 page-break 회피). 레이아웃 수정은 여기서 한다.
