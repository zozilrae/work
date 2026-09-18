# tools

## md2pdf.py — 마크다운 보고서를 한글 PDF로

`reports/docs/` 의 기술보고서를 A4 PDF로 변환한다. Chromium 인쇄 엔진(Playwright)으로
렌더링하며 표지·2단 목차·머리말/꼬리말을 자동 구성한다.

### 사용법

```bash
python3 reports/tools/md2pdf.py reports/docs/report.md                 # reports/docs/report.pdf 생성
python3 reports/tools/md2pdf.py reports/docs/report.md out.pdf         # 출력 경로 지정
python3 reports/tools/md2pdf.py reports/docs/report.md --note "문구"   # 표지 하단 문구
python3 reports/tools/md2pdf.py reports/docs/report.md --keep-html     # 중간 HTML 보존 (디버깅)
```

실제 산출물 재생성 예:

```bash
python3 reports/tools/md2pdf.py reports/docs/self-pulse-heating-lib-assb-report.md \
  --note "본 문서의 정량 데이터는 2026년 9월 기준 공개 문헌 및 제조사 발표자료에 근거한다."
```

### 설치

```bash
pip install markdown playwright
apt-get install unifont        # 코드블록용 — 아래 참조
```

Chromium은 `/opt/pw-browsers/chromium-*/chrome-linux/chrome` 를 자동 탐색하고,
없으면 Playwright 기본 경로를 쓴다.

### 문서 형식

제목 다음의 `**키** 값` 블록을 표지 메타데이터로 인식한다. 없으면 표지를 만들지 않는다.

```markdown
# 보고서 제목

**문서번호** TR-2026-002
**작성일** 2026-09-17
**주제** ...

---

## 1. 서론
```

`문서번호` 는 각 페이지 머리말, `제목 · 작성일` 은 꼬리말 왼쪽,
페이지 번호는 꼬리말 오른쪽에 들어간다. 목차는 `##` / `###` 두 단계를 자동 수집한다.

### 폰트 — ASCII 도식이 깨지지 않게 하는 부분

| 용도 | 폰트 | 비고 |
|---|---|---|
| 본문 | Noto Sans KR | 최초 실행 시 Google Fonts에서 받아 `~/.cache/md2pdf-fonts` 에 캐시 |
| 코드블록 | **Unifont** | 시스템 설치본 |
| 인라인 코드 | DejaVu Sans Mono | 정렬이 필요 없으므로 기호 커버리지 우선 |

코드블록에 Unifont를 쓰는 이유는 두 가지다.

1. **글리프 커버리지** — 박스드로잉(`─│┌┘┬`), 대각선(`╲╱`), 화살표(`→↑►`),
   윗줄(`‾`), 위첨자(`⁻²⁹`), 그리스 문자(`Ωσμ`)를 모두 보유한다.
2. **한글이 라틴 문자의 정확히 2배폭** — ASCII 도식의 열 정렬이 보존된다.

Google Fonts의 한국어 서브셋 코딩 폰트(Nanum Gothic Coding 등)는 위 글리프가
대부분 빠져 있어 도식이 통째로 깨진다. WenQuanYi Zen Hei Mono는 커버리지는
낫지만 박스드로잉이 반각이라 축과 눈금 레이블이 어긋난다.

Noto Sans KR을 받을 때는 Google Fonts v1 API에 **구형 User-Agent**와
**`subset=korean`** 을 함께 보내야 한다. 전자가 없으면 서브셋 woff2 묶음이 오고,
후자가 없으면 한글이 빠진 약 17 KB짜리 라틴 서브셋이 온다.

### 결과 확인

```bash
pip install pypdfium2 pillow
python3 -c "
import pypdfium2 as pdfium
pdf = pdfium.PdfDocument('reports/docs/report.pdf')
print('페이지:', len(pdf))
pdf[0].render(scale=2).to_pil().save('/tmp/p1.png')"
```
