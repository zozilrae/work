# research-agent

Claude AI 기반 자동 웹 리서치 에이전트. 주제를 입력하면 정보 수집, 분석, 종합을 자동으로 수행합니다.

## 산출물

| 파일 | 설명 | 갱신일 |
|---|---|---|
| `research-agent/agent.py` | 리서치 에이전트 메인 스크립트 | 2026-09-18 |
| `research-agent/output/*.md` | 생성된 리서치 리포트 (마크다운) | — |
| `research-agent/output/*.json` | 생성된 리포트 (구조화 데이터) | — |

## 사용법

### 기본 리서치 실행

```bash
python3 research-agent/agent.py "AI 에이전트의 최신 트렌드"
```

출력:
- `research-agent/output/ai-에이전트의-최신-트렌드.md` (마크다운 리포트)
- `research-agent/output/ai-에이전트의-최신-트렌드.json` (구조화 데이터)

### 심화 리서치

```bash
python3 research-agent/agent.py "주제" --depth=deep
```

더 자세한 분석과 여러 관점 포함.

### 커스텀 출력 파일명

```bash
python3 research-agent/agent.py "주제" --output my-report.md
```

### JSON 형식 출력만

```bash
python3 research-agent/agent.py "주제" --format=json
```

## 설정

`.env` 파일 생성:
```
CLAUDE_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-opus-5
```
