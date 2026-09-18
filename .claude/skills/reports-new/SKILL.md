# 새 보고서 추가 (New Report)

한국어 기술 보고서를 새로 추가하는 워크플로우를 자동화한다.

## 워크플로우

**입력:** 보고서 제목, 주제, 선택사항(선행 문서, 분류)

**출력:**
- `reports/docs/{번호}_{slug}.md` 마크다운 원본
- `reports/docs/{번호}_{slug}.pdf` 변환된 PDF
- `reports/README.md` 업데이트 (목록에 새 행 추가)

### 단계

1. **다음 문서번호 결정**
   - `reports/docs/` 의 기존 보고서 스캔해 `TR-YYYY-NNN` 형식의 최대 번호 찾기
   - 올해 첫 번호면 001, 아니면 기존 최대값 + 1
   - 예: 이미 `TR-2026-001`, `TR-2026-002` 있으면 → `TR-2026-003`

2. **메타데이터 블록 생성**
   ```markdown
   # 보고서 제목

   **문서번호** TR-YYYY-NNN
   **작성일** YYYY-MM-DD (오늘 날짜)
   **주제** <사용자 입력>
   **분류** <사용자 선택, 기본값: 실무 기술보고서 (엔지니어링 검토용)>
   **선행문서** <선택사항>
   ```

3. **템플릿 생성**
   - 메타 블록 뒤에 `---` 구분선
   - 표준 섹션 추가:
     ```markdown
     ## 요약 (Executive Summary)
     ## 1. 서론
     ## 부록 A. 주요 수식 정리
     ## 참고문헌
     ```

4. **파일 저장**
   - 파일명: `reports/docs/TR-YYYY-NNN_{slug}.md` (slug는 제목의 영문 변환)
   - 예: `reports/docs/TR-2026-003_cooling-system-comparison.md`

5. **README.md 업데이트**
   - `reports/README.md` 의 보고서 목록 표에 새 행 추가:
     ```markdown
     | [TR-YYYY-NNN](docs/TR-YYYY-NNN_{slug}.md) | <제목 요약> | YYYY-MM-DD |
     ```

6. **PDF 생성**
   ```bash
   python3 reports/tools/md2pdf.py reports/docs/TR-YYYY-NNN_{slug}.md
   ```
   선행문서가 있으면 `--note` 옵션 추가 (md2pdf.py 참조)

7. **검증**
   - 마크다운 문법 확인: 헤딩, 메타 블록, 섹션 구조
   - PDF 생성 성공 확인: 파일 존재 + 크기 > 0
   - README.md 표 형식 검증

## 사용자 입력

### 필수 항목
- `title`: 보고서 제목 (한국어, 예: "냉각 시스템 비교 분석")
- `topic`: 주제 (한 문장, 예: "전기차 배터리 냉각 시스템의 효율 비교")

### 선택 항목
- `classification`: 분류 (기본값: `실무 기술보고서 (엔지니어링 검토용)`)
- `prev_doc`: 선행문서 (예: `TR-2026-001 「배터리 시스템 개요」(2026-09-14)`)
- `note`: PDF 표지 하단 주석 (예: "본 문서의 정량 데이터는 2026년 9월 기준...")

## 규약 및 제약

- **문서번호 형식:** `TR-<연도>-<3자리 순번>`
- **파일명 slug:** 제목의 영문 축약형. 하이픈(-)으로 단어 구분, 소문자. 띄어쓰기/특수문자는 제거.
  - "냉각 시스템 비교" → `cooling-system-comparison`
  - "배터리 충방전 성능" → `battery-charge-discharge-performance`
- **메타 블록 순서 고정:** 문서번호 → 작성일 → 주제 → 분류 → 선행문서
- **작성일:** 오늘 날짜 (YYYY-MM-DD)
- **마크다운 규약:** `reports/CLAUDE.md` 의 "보고서 문서 규약" 섹션 참조
  - 문단은 한 줄로
  - 수식/도식은 코드블록, LaTeX 미사용
  - ASCII 도식: Unifont, 90칸 이하

## 실패 처리

- **문서번호 충돌:** 같은 번호의 파일이 이미 있으면 오류 후 중단
- **마크다운 문법 오류:** 메타 블록 누락이나 형식 오류 시 PDF 변환 실패 가능. 템플릿에서 자동 생성되므로 입력 검증 필요.
- **PDF 생성 실패:** 의존성(playwright, markdown) 미설치 또는 Chromium 문제 → 에러 메시지 출력 후 중단

## 호출 시나리오

```
user: "냉각 시스템 비교 보고서를 새로 추가해줘"
↓
skill: 문서번호(다음 순번) 결정 → 메타 블록 생성 → 템플릿 작성 → md 파일 저장 → 
        README.md 업데이트 → PDF 생성 → 검증 → 완료
```

## 참고

- `reports/tools/md2pdf.py --help` 로 옵션 확인
- 각 절 제목은 `## N. 제목` / `### N.M 소제목` 번호 체계 준수
- 참고문헌은 주제별 소제목, DOI/URL 필수
