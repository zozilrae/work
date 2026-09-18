# research-agent — 웹 기반 리서치 자동화

주제를 입력하면 Claude AI가 자동으로 정보를 수집, 분석, 종합하여 구조화된 리서치 리포트를 생성하는 에이전트다. 산출물은 `research-agent/output/` 의 마크다운 및 JSON 형식 리포트이며, `research-agent/agent.py` 는 Claude API의 Tool use를 활용한 자동 리서치 엔진이다.

- `research-agent/agent.py` — 메인 에이전트 (정보 검색, 분석, 요약)
- `research-agent/tools/` — 검색, 분석, 요약 도구 모듈
- `research-agent/output/` — 생성된 리포트 (`.md`, `.json`)
- `research-agent/config.py` — Claude API 키, 모델 설정
- `research-agent/README.md` — 사용법 및 예제

## 자주 쓰는 명령

```bash
python3 research-agent/agent.py "AI 에이전트의 최신 트렌드"                 # 리서치 실행
python3 research-agent/agent.py "주제" --depth=deep                          # 심화 리서치
python3 research-agent/agent.py "주제" --format=json                         # JSON 형식 출력
python3 research-agent/agent.py "주제" --output custom-report.md            # 출력 파일명 지정
```

의존성: `pip install anthropic requests beautifulsoup4 python-dotenv`. Claude API 키는 `.env` 에 `CLAUDE_API_KEY` 로 설정.

## 이 항목의 규약

- **API 키 관리**: `.env` 파일에 `CLAUDE_API_KEY` 저장 (공개 저장소에 커밋하지 않음)
- **리포트 형식**: 마크다운 (`.md`)과 JSON (`.json`) 모두 생성
- **출처 추적**: 모든 리포트는 분석 기반 정보원 명시
- **모델 선택**: 기본값 `claude-opus-5` (복잡한 리서치용), 빠른 리서치는 `claude-sonnet-5` 사용 가능
- **타임아웃**: 단일 리서치 최대 2분 (API 제한)

## 구조

**에이전트 루프: 사용자 입력 → 계획 수립 → 정보 검색 → 분석 → 요약 → 리포트 생성**

1. **사용자 입력**: 리서치 주제 또는 질문 제시
2. **계획 수립**: Claude가 필요한 정보 영역 결정 (개념, 사례, 트렌드, 문제점 등)
3. **정보 검색**: Tool use로 각 영역별 정보 수집 (knowledge base 또는 web search 에뮬레이션)
4. **분석**: 수집된 정보의 신뢰성 검증, 상충 내용 조정
5. **요약**: 핵심 내용 추출, 인사이트 도출
6. **리포트 생성**: 구조화된 마크다운 및 JSON 형식 출력
