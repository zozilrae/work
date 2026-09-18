# presentations

HTML 콘텐츠를 자동으로 분석·구조화하여 PowerPoint 슬라이드를 생성하는 도구 모음.

## 산출물

| 파일 | 설명 | 갱신일 |
|---|---|---|
| `presentations/tools/html2ppt.py` | HTML → PPT 변환 엔진 (콘텐츠 분석, 구조 설계, 생성) | 2026-09-18 |
| [ai-agents-lecture.pptx](output/ai-agents-lecture.pptx) | AI 에이전트 강의 자료 (10장) | 2026-09-18 |
| `presentations/output/` | 생성된 `.pptx` 파일 모음 | — |

## 사용법

### 기본 PPT 생성

```bash
python3 presentations/tools/html2ppt.py presentations/content/page.html
```

출력: `presentations/output/page.pptx` (자동 생성)

### 콘텐츠 분석만 수행

```bash
python3 presentations/tools/html2ppt.py presentations/content/page.html --analyze-only
```

JSON 형식으로 분석 결과 출력 (주제, 목적, 대상 청중, 섹션 구조, 예상 슬라이드 수)

### 구조 설계 미리보기

```bash
python3 presentations/tools/html2ppt.py presentations/content/page.html --design-only
```

슬라이드 배분 계획 출력 (각 슬라이드의 타입과 콘텐츠 요약)
