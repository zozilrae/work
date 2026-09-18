#!/usr/bin/env python3
"""
Claude AI 기반 자동 리서치 에이전트
주제를 입력하면 정보 수집, 분석, 종합을 자동으로 수행합니다.
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any
import re

from anthropic import Anthropic

# Claude API 초기화
client = Anthropic()
MODEL = os.getenv("CLAUDE_MODEL", "claude-opus-5")
API_KEY = os.getenv("CLAUDE_API_KEY")

if not API_KEY:
    print("❌ Error: CLAUDE_API_KEY 환경 변수가 설정되지 않았습니다.")
    print("   .env 파일에 CLAUDE_API_KEY=sk-ant-... 를 추가해주세요.")
    sys.exit(1)

# 출력 디렉토리
OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

# 도구 정의
TOOLS = [
    {
        "name": "search_topic",
        "description": "주제에 대한 정보를 검색합니다. 개념, 정의, 배경 정보를 수집합니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "검색 쿼리"
                }
            },
            "required": ["query"]
        }
    },
    {
        "name": "find_examples",
        "description": "주제와 관련된 실제 사례, 예제, 응용 분야를 찾습니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "topic": {
                    "type": "string",
                    "description": "주제"
                },
                "count": {
                    "type": "integer",
                    "description": "찾을 사례의 개수 (기본값: 3)",
                    "default": 3
                }
            },
            "required": ["topic"]
        }
    },
    {
        "name": "analyze_trends",
        "description": "주제의 최신 트렌드, 발전 동향, 미래 전망을 분석합니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "topic": {
                    "type": "string",
                    "description": "분석할 주제"
                },
                "aspect": {
                    "type": "string",
                    "description": "분석 관점 (기술, 시장, 사회 등)",
                    "enum": ["technology", "market", "society", "industry"]
                }
            },
            "required": ["topic", "aspect"]
        }
    },
    {
        "name": "evaluate_pros_cons",
        "description": "주제에 대한 장점과 단점, 찬반 의견을 평가합니다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "topic": {
                    "type": "string",
                    "description": "평가할 주제"
                }
            },
            "required": ["topic"]
        }
    }
]

# 도구 구현 (에뮬레이션)
def search_topic(query: str) -> dict:
    """정보 검색 (LLM 지식 기반)"""
    return {
        "status": "success",
        "query": query,
        "source": "Claude Knowledge Base",
        "timestamp": datetime.now().isoformat(),
        "note": "실제 구현 시 웹 API 또는 데이터베이스 쿼리로 대체"
    }

def find_examples(topic: str, count: int = 3) -> dict:
    """사례 찾기 (에뮬레이션)"""
    return {
        "status": "success",
        "topic": topic,
        "example_count": count,
        "source": "Claude Knowledge Base",
        "timestamp": datetime.now().isoformat(),
        "note": f"{topic}와 관련된 {count}개의 사례 수집"
    }

def analyze_trends(topic: str, aspect: str) -> dict:
    """트렌드 분석"""
    return {
        "status": "success",
        "topic": topic,
        "aspect": aspect,
        "source": "Claude Analysis",
        "timestamp": datetime.now().isoformat(),
        "note": f"{aspect} 관점에서 {topic}의 트렌드 분석"
    }

def evaluate_pros_cons(topic: str) -> dict:
    """장단점 평가"""
    return {
        "status": "success",
        "topic": topic,
        "source": "Claude Evaluation",
        "timestamp": datetime.now().isoformat(),
        "note": f"{topic}의 장점과 단점 평가"
    }

def process_tool_call(tool_name: str, tool_input: dict) -> str:
    """도구 호출 처리"""
    if tool_name == "search_topic":
        result = search_topic(**tool_input)
    elif tool_name == "find_examples":
        result = find_examples(**tool_input)
    elif tool_name == "analyze_trends":
        result = analyze_trends(**tool_input)
    elif tool_name == "evaluate_pros_cons":
        result = evaluate_pros_cons(**tool_input)
    else:
        result = {"error": f"Unknown tool: {tool_name}"}

    return json.dumps(result, ensure_ascii=False, indent=2)

def run_research_agent(topic: str, depth: str = "normal") -> dict:
    """리서치 에이전트 메인 루프"""
    print(f"\n🔍 리서치 시작: '{topic}'")
    print(f"   깊이: {depth}")
    print("=" * 60)

    # 프롬프트 구성
    if depth == "deep":
        instructions = f"""
'{topic}'에 대해 심화 리서치를 수행합니다.

다음 단계를 수행하세요:
1. 기본 개념과 정의 파악 (search_topic)
2. 실제 사례와 응용 분야 찾기 (find_examples)
3. 최신 기술 트렌드 분석 (analyze_trends with aspect='technology')
4. 시장 및 산업 트렌드 (analyze_trends with aspect='market')
5. 장점과 단점 평가 (evaluate_pros_cons)
6. 최종 요약 및 인사이트 도출

각 단계별로 도구를 사용하고, 수집한 정보를 종합하여 체계적인 리포트를 작성하세요.
"""
    else:
        instructions = f"""
'{topic}'에 대해 일반 리서치를 수행합니다.

다음 단계를 수행하세요:
1. 주제의 기본 개념 파악 (search_topic)
2. 주요 사례와 응용 분야 확인 (find_examples)
3. 현재의 트렌드와 동향 분석 (analyze_trends)
4. 주요 장점과 고려사항 평가 (evaluate_pros_cons)

수집한 정보를 정리하여 구조화된 리포트를 작성하세요.
"""

    messages = [
        {"role": "user", "content": instructions}
    ]

    # 대화 루프
    research_data = {
        "topic": topic,
        "depth": depth,
        "started_at": datetime.now().isoformat(),
        "messages": [],
        "tool_calls": []
    }

    max_iterations = 10
    iteration = 0

    while iteration < max_iterations:
        iteration += 1

        # Claude 호출
        response = client.messages.create(
            model=MODEL,
            max_tokens=4096,
            tools=TOOLS,
            messages=messages
        )

        # 응답 처리
        if response.stop_reason == "tool_use":
            # 도구 호출
            print(f"\n[반복 {iteration}] 도구 호출:")

            tool_calls_in_response = []
            for content_block in response.content:
                if content_block.type == "tool_use":
                    tool_name = content_block.name
                    tool_input = content_block.input
                    tool_use_id = content_block.id

                    print(f"  📌 {tool_name}: {list(tool_input.keys())}")

                    # 도구 실행
                    tool_result = process_tool_call(tool_name, tool_input)

                    tool_calls_in_response.append({
                        "tool": tool_name,
                        "input": tool_input,
                        "result": json.loads(tool_result)
                    })

                    # 메시지에 추가
                    messages.append({"role": "assistant", "content": response.content})
                    messages.append({
                        "role": "user",
                        "content": [
                            {
                                "type": "tool_result",
                                "tool_use_id": tool_use_id,
                                "content": tool_result
                            }
                        ]
                    })

            research_data["tool_calls"].extend(tool_calls_in_response)

        elif response.stop_reason == "end_turn":
            # 최종 응답
            final_text = ""
            for content_block in response.content:
                if hasattr(content_block, "text"):
                    final_text += content_block.text

            research_data["completed_at"] = datetime.now().isoformat()
            research_data["report"] = final_text
            research_data["status"] = "completed"

            print(f"\n✅ 리서치 완료!")
            print("=" * 60)

            return research_data

        else:
            print(f"⚠️  예상치 못한 stop_reason: {response.stop_reason}")
            break

    research_data["status"] = "incomplete"
    research_data["completed_at"] = datetime.now().isoformat()
    return research_data

def sanitize_filename(text: str) -> str:
    """파일명으로 사용 가능하게 정제"""
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text)
    return text.strip("-")

def save_report(research_data: dict, output_file: str = None) -> str:
    """리포트 저장"""
    if output_file:
        md_file = OUTPUT_DIR / output_file
        json_file = OUTPUT_DIR / output_file.replace(".md", ".json")
    else:
        base_name = sanitize_filename(research_data["topic"])
        md_file = OUTPUT_DIR / f"{base_name}.md"
        json_file = OUTPUT_DIR / f"{base_name}.json"

    # JSON 저장
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(research_data, f, ensure_ascii=False, indent=2)
    print(f"   📄 JSON: {json_file.name}")

    # 마크다운 저장
    md_content = f"""# {research_data['topic']}

**생성일**: {datetime.fromisoformat(research_data['started_at']).strftime('%Y-%m-%d %H:%M:%S')}
**리서치 깊이**: {research_data['depth']}
**상태**: {research_data['status']}

---

## 리포트

{research_data.get('report', '(리포트 없음)')}

---

## 수집 정보

- **도구 호출**: {len(research_data['tool_calls'])}회
- **완료 시간**: {datetime.fromisoformat(research_data['completed_at']).strftime('%Y-%m-%d %H:%M:%S')}

### 도구 사용 기록

"""

    for i, tool_call in enumerate(research_data['tool_calls'], 1):
        md_content += f"\n{i}. **{tool_call['tool']}**\n"
        md_content += f"   - 입력: {json.dumps(tool_call['input'], ensure_ascii=False)}\n"

    with open(md_file, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"   📋 마크다운: {md_file.name}")

    return str(md_file)

def main():
    parser = argparse.ArgumentParser(
        description="Claude AI 기반 자동 리서치 에이전트"
    )
    parser.add_argument("topic", help="리서치 주제")
    parser.add_argument(
        "--depth",
        choices=["normal", "deep"],
        default="normal",
        help="리서치 깊이 (기본값: normal)"
    )
    parser.add_argument(
        "--output",
        help="출력 파일명 (기본값: 주제에서 자동 생성)"
    )
    parser.add_argument(
        "--format",
        choices=["both", "md", "json"],
        default="both",
        help="출력 형식 (기본값: both)"
    )

    args = parser.parse_args()

    try:
        # 리서치 실행
        research_data = run_research_agent(args.topic, args.depth)

        # 리포트 저장
        print(f"\n💾 리포트 저장 중...")
        save_report(research_data, args.output)

        print(f"\n✨ 완료! {OUTPUT_DIR.name}/ 디렉토리에서 리포트를 확인하세요.")

    except KeyboardInterrupt:
        print("\n⚠️  리서치 중단됨")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ 오류 발생: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
