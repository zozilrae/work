# 새 PPT 생성 (New Presentation)

HTML 콘텐츠를 분석·구조화하여 새로운 PowerPoint 슬라이드를 자동으로 생성하는 워크플로우를 자동화한다.

## 워크플로우

**입력:** HTML 파일 (또는 웹 URL), 출력 파일명(선택)

**출력:**
- `presentations/output/{파일명}.pptx` — 생성된 PowerPoint 슬라이드
- 분석/설계 로그 및 메타데이터

### 단계

1. **입력 소스 확인**
   - HTML 파일 경로: `presentations/content/` 에 배치
   - 또는 웹 URL: 자동으로 다운로드해 임시 파일로 변환
   - 파일명이 없으면 HTML의 `<title>` 에서 추출

2. **콘텐츠 분석 (Content Analysis)**
   ```bash
   python3 presentations/tools/html2ppt.py <html_path> --analyze-only
   ```
   
   추출되는 정보:
   - **Title**: `<h1>`, `<title>` 에서 자동 추출
   - **Purpose**: `<meta name="description">` 또는 첫 문단 요약
   - **Audience**: 콘텐츠 분석으로 자동 판단
     - `technical`: 기술 용어, 코드, 복잡도 높음
     - `business`: 비즈니스 용어, 차트, KPI
     - `general`: 일반 언어, 설명/소개 중심
   - **Sections**: `<h2>` 제목들 추출
   - **Estimated Slides**: 콘텐츠 볼륨 기반 예측
   
   **분석 출력 (JSON)**:
   ```json
   {
     "metadata": {
       "title": "HTML 페이지 제목",
       "purpose": "이 콘텐츠의 목표",
       "audience": "technical | business | general",
       "estimated_slides": 12,
       "word_count": 3500,
       "section_count": 5
     },
     "sections": [
       {"level": 2, "title": "1. 서론", "word_count": 400},
       {"level": 2, "title": "2. 주요 내용", "word_count": 2100}
     ],
     "content_types": {
       "paragraphs": 15,
       "lists": 8,
       "images": 3,
       "tables": 2,
       "code_blocks": 1
     }
   }
   ```

3. **구조 설계 (Structure Design)**
   ```bash
   python3 presentations/tools/html2ppt.py <html_path> --design-only
   ```
   
   결정 사항:
   - **슬라이드 타입 배분**:
     - Title slide (1개): 문서 제목 + 부제
     - TOC slide (1개, 섹션 3개 이상일 때): 목차
     - Content slides (본문): 섹션별 1-3개
       - 텍스트만: 1개
       - 텍스트 + 이미지: 1개
       - 텍스트 + 표: 1개
       - 텍스트 + 코드: 1개
     - Closing slide (1개): 감사합니다 또는 연락처
   
   - **Audience별 색상 스키마**:
     - `technical`: 다크 배경(#1a1a1a) + 하이라이트 색상(#00d4ff)
     - `business`: 밝은 배경(#ffffff) + 보수적 색상(#003366)
     - `general`: 중립 배경(#f5f5f5) + 친화적 색상(#ff6b35)
   
   **설계 미리보기 출력**:
   ```
   Slide 1: Title (제목)
   Slide 2: TOC (목차 - 5개 섹션)
   Slide 3-4: Section 1 (텍스트 + 이미지)
   Slide 5-6: Section 2 (텍스트)
   Slide 7-8: Section 3 (텍스트 + 표)
   Slide 9: Section 4 (코드)
   Slide 10-11: Section 5 (텍스트)
   Slide 12: Closing
   ```

4. **PPT 생성 (PPT Generation)**
   ```bash
   python3 presentations/tools/html2ppt.py presentations/content/page.html
   # 또는
   python3 presentations/tools/html2ppt.py presentations/content/page.html -o custom-name.pptx
   ```
   
   - python-pptx로 각 슬라이드 생성
   - Audience 타입에 따른 테마 적용
   - 텍스트 포맷팅: Noto Sans KR (본문), Noto Sans Mono (코드)
   - 이미지 삽입: 자동 스케일링, 캡션 추가
   - 표 포맷팅: 헤더 굵게, 행 번갈아 색상
   - 코드 강조: 배경색 적용, 들여쓰기 유지

5. **검증**
   - PPTX 파일 생성 확인 (크기 > 100KB)
   - 슬라이드 수 확인 (예상값 ± 2)
   - 메타데이터 확인 (제목, 작성자, 생성일)
   - 텍스트 인코딩 확인 (한글 렌더링)

6. **산출물 정리**
   - `presentations/output/{파일명}.pptx` 최종 저장
   - 분석 로그는 `presentations/output/{파일명}_analysis.json` 저장
   - `presentations/README.md` 에 생성 기록 추가

## 사용자 입력

### 필수 항목
- `html_source`: HTML 파일 경로 또는 웹 URL
  - 예: `presentations/content/ai-trends.html`
  - 예: `https://example.com/article/page.html`

### 선택 항목
- `output_filename`: 출력 PPTX 파일명 (기본값: HTML `<title>` 또는 파일명)
  - 예: `ai-trends-2026.pptx`
- `audience_override`: Audience 타입 강제 설정 (기본값: 자동)
  - `technical`, `business`, `general`
- `max_slides`: 최대 슬라이드 수 제한 (기본값: 무제한)
  - 예: 20 (초과하면 콘텐츠 요약)

## 규약 및 제약

### HTML 입력 규약

PPT 생성이 정확하려면 HTML이 다음을 따라야 한다:

```html
<!DOCTYPE html>
<html>
<head>
  <title>프레젠테이션 제목</title>
  <meta name="description" content="이 프레젠테이션의 목적">
  <meta name="audience" content="technical|business|general">
</head>
<body>
  <h1>프레젠테이션 제목</h1>
  <p>부제 또는 한 문장 소개</p>
  
  <h2>1. 첫 번째 섹션</h2>
  <p>섹션 소개 문단...</p>
  <p>추가 설명...</p>
  
  <h3>1.1 소제목</h3>
  <ul>
    <li>항목 1</li>
    <li>항목 2</li>
  </ul>
  
  <img src="image.png" alt="이미지 설명">
  
  <table>
    <tr><th>헤더1</th><th>헤더2</th></tr>
    <tr><td>데이터1</td><td>데이터2</td></tr>
  </table>
  
  <pre><code class="language-python">
  def hello():
      print("Hello, World!")
  </code></pre>
  
  <h2>2. 두 번째 섹션</h2>
  ...
</body>
</html>
```

**주의사항:**
- `<h1>`: 한 개만 (제목용)
- 헤딩 계층: `<h1>` → `<h2>` → `<h3>` (순서 유지)
- 이미지: `<img alt="설명">` 필수 (alt 텍스트가 캡션이 됨)
- 표: 셀 병합 피하기 (복잡도 증가)
- 코드: `<code class="language-python">` 형식 (언어 명시)
- 특수 문자: HTML 엔티티 사용 (`&lt;`, `&amp;` 등)

### 출력 제약

- **최대 슬라이드**: 50개 (초과 시 경고)
- **한 슬라이드 최대 단어**: 200 (가독성)
- **한 슬라이드 최대 불릿**: 7개 (시각적 부하)
- **코드 블록 최대 줄**: 15줄 (화면 맞춤)
- **이미지 최대 크기**: 슬라이드 너비 80% (테두리 여백 유지)

### 파일명 규약

- 출력 파일명: 소문자 + 하이픈 구분
  - 예: `ai-trends-2026.pptx`
  - 예: `quarterly-report-q3.pptx`
- 중복 파일 자동 처리: `file.pptx` → `file_v2.pptx` → `file_v3.pptx`

## 실패 처리

- **HTML 파싱 오류**: 잘못된 HTML 구조 시 상세 에러 메시지
- **콘텐츠 없음**: `<h1>` 또는 본문 없으면 오류
- **이미지 로드 실패**: 이미지 경로 잘못됨 시 건너뛰고 진행
- **표 포맷 오류**: 병합된 셀은 단순화
- **메모리 부족**: 매우 큰 파일(>100MB)은 경고

## 호출 시나리오

**시나리오 1: 로컬 HTML 파일**
```
user: "presentations/content/ai-report.html 을 PPT로 변환해줘"
↓
skill: HTML 파싱 → 콘텐츠 분석 → Audience 판정(기술) → 
       구조설계(12 slides, 다크 테마) → PPT 생성 → 검증 → 완료
output: presentations/output/ai-report.pptx
```

**시나리오 2: 웹 페이지에서 생성**
```
user: "https://example.com/blog/post.html 을 PPT로 만들어줘, business 스타일로"
↓
skill: URL 다운로드 → HTML 파싱 → 콘텐츠 분석(business 적용) → 
       구조설계(8 slides, 보수적 테마) → PPT 생성 → 검증 → 완료
output: presentations/output/post.pptx
```

**시나리오 3: 분석 먼저 확인**
```
user: "이 HTML을 PPT로 변환하기 전에 어떻게 될지 보고 싶은데?"
↓
skill: HTML 파싱 → 콘텐츠 분석(JSON 출력) ✓ → 구조설계 미리보기 출력 ✓
user: (분석/설계 확인 후) "좋아, 이제 PPT 만들어"
↓
skill: PPT 생성 → 검증 → 완료
```

## 참고

- `presentations/CLAUDE.md` 에 상세한 분석/설계/생성 알고리즘 설명
- `presentations/tools/README.md` 에 API 문서 및 커스터마이제이션 옵션
- 이미지/표/코드는 원본 HTML의 구조를 최대한 유지
- 한글 텍스트는 Noto Sans KR 자동 임베드 (폰트 미포함 시 시스템 폰트 폴백)
