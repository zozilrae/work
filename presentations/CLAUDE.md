# presentations — HTML 기반 PPT 생성

HTML 콘텐츠를 자동으로 분석하고 구조화하여 PowerPoint 슬라이드를 생성하는 항목이다. 산출물은 `presentations/output/` 의 `.pptx` 파일이며, `presentations/tools/html2ppt.py` 는 HTML 파싱, 콘텐츠 분석, 슬라이드 설계, PPT 생성을 수행하는 통합 도구다.

- `presentations/content/` — HTML 원본 파일들
- `presentations/output/` — 생성된 `.pptx` 파일들
- `presentations/tools/` — `html2ppt.py` 와 구성 파일. 사용법, 분석 규칙, 슬라이드 템플릿은 `presentations/tools/README.md` 에 있다.
- `presentations/README.md` — 프로젝트 개요 + 생성된 PPT 목록

## 자주 쓰는 명령

```bash
python3 presentations/tools/html2ppt.py presentations/content/page.html              # presentations/output/page.pptx 생성
python3 presentations/tools/html2ppt.py presentations/content/page.html --analyze-only    # 콘텐츠 분석만 수행 (JSON)
python3 presentations/tools/html2ppt.py presentations/content/page.html --design-only     # 구조설계 미리보기
```

의존성: `pip install python-pptx beautifulsoup4 requests`

## 이 항목의 규약

- **HTML 입력 형식**: 헤딩 계층 구조(`<h1>` → `<h2>` → `<h3>`), 이미지는 `<img alt="설명">` 필수, 표는 `<table><tr><td>` 구조
- **Audience 타입**: `technical` (기술 용어, 코드), `business` (비즈니스 차트), `general` (일반 언어)
- **슬라이드 제약**: 한 슬라이드 최대 200단어, 불릿 7개 이하, 코드 15줄 이하
- **메타데이터**: HTML `<head>` 에 `<title>`, `<meta name="description">`, `<meta name="audience">` 포함하면 분석 정확도 향상

## 구조

**분석 → 설계 → 생성 단일 파이프라인.**

1. **콘텐츠 분석**: HTML 파싱으로 제목, 목적, 대상 청중, 주요 섹션, 블록 추출. BeautifulSoup 사용.
2. **구조 설계**: 분석 결과로부터 슬라이드 타입(표지, 목차, 본문, 이미지, 코드, 마무리), 배분 결정.
3. **PPT 생성**: python-pptx 로 설계된 구조를 PowerPoint 파일로 변환. Audience 유형에 따라 색상 스키마 적용.
