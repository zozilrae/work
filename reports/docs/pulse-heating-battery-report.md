# 리튬이온전지 펄스 히팅(Pulse Heating) 기술 조사·분석 보고서

**문서번호** TR-2026-001
**작성일** 2026-09-14
**주제** 저온 환경 리튬이온전지의 펄스 전류 기반 자가발열(Pulse / AC Self-Heating) 기술
**분류** 실무 기술보고서 (엔지니어링 검토용)

---

## 요약 (Executive Summary)

저온(0 °C 이하)에서 리튬이온전지는 전해질 이온전도도 저하, 음극 전하이동 저항(R_ct) 급증, 고상 확산계수 감소로 인해 가용 용량·출력·충전속도가 급격히 떨어진다. −20 °C에서는 상온 대비 방전용량 20~40 % 손실, 내부저항 5~10배 증가가 일반적이며, 저온 충전은 리튬 석출(Li plating)로 인한 비가역 열화와 내부단락 위험을 수반한다.

**펄스 히팅**은 전지 자체에 큰 교번 전류(펄스 또는 AC)를 인가하여 내부 임피던스에서 발생하는 줄열(Joule heat)로 셀 내부를 직접 가열하는 기술이다. 외부 히터(PTC·필름·액랭) 대비 다음의 구조적 이점을 가진다.

- **열전달 경로가 없음** — 발열이 전극 계면·집전체에서 직접 일어나므로 셀 케이스→젤리롤 간 열저항을 우회한다. 문헌 보고 승온율은 3~17 °C/min 수준으로 외부 가열(통상 0.5~2 °C/min) 대비 수 배 빠르다.
- **추가 발열 부품 불필요** — 기존 인버터·모터 권선 또는 소형 DC/DC를 재활용하는 토폴로지가 가능해 부품비·중량 증가가 작다.
- **양방향(bidirectional) 펄스 사용 시 순 SOC 소모가 작음** — 충·방전이 교번하므로 순 전하 이동이 상쇄되고, 손실분만 열로 남는다.

반면 **핵심 리스크는 리튬 석출과 열화**다. 펄스 진폭·주파수·듀티비를 잘못 선정하면 충전 반주기 중 음극 전위가 Li/Li⁺ 기준 0 V 이하로 내려가 금속 리튬이 석출된다. 따라서 본 기술의 설계 핵심은 "**승온율 최대화**"가 아니라 "**리튬 석출 임계선 아래에서의 승온율 최대화**"라는 제약 최적화 문제로 정의되어야 한다.

산업 적용은 이미 양산 단계에 진입했다. CATL은 3세대 선싱(Shenxing) LFP에 펄스 자가발열을 적용해 −30 °C에서 9분 내 98 % 충전을 발표했고(2026년 4월), BYD는 전동화 구동계(모터·인버터)를 이용한 고주파 펄스 승온을 채택하고 있다. 현대차그룹은 별도 배터리 히터로 냉각수를 가열하는 방식을 유지하고 있어, 펄스 자가발열은 국내 완성차 관점에서 **차별화 가능한 미확보 기술 영역**에 해당한다.

**결론 및 권고** — 펄스 히팅은 저온 급속충전 대응의 가장 유효한 수단이나, 도입 시 (1) 셀 단위 EIS 기반 발열 모델 확보, (2) 음극 전위 관측기 또는 등가 제약 조건 수립, (3) 팩 스케일 온도·SOC 불균일 대책, (4) 300~1,000 사이클급 가속 열화 검증이 선행되어야 한다. 본문 9장에 단계별 개발 로드맵과 검증 시험계획을 제시한다.

---

## 1. 서론

### 1.1 배경

전기차 보급 확대와 함께 겨울철 성능 저하가 주요 품질 이슈로 부각되고 있다. 저온에서의 문제는 두 층위로 나뉜다.

1. **주행(방전) 측면** — 출력 제한, 주행거리 감소
2. **충전 측면** — 급속충전 전류 제한(derating), 충전시간 2~3배 증가, 리튬 석출로 인한 수명 손실

이 중 충전 측면이 더 심각하다. BMS는 저온에서 리튬 석출을 피하기 위해 충전 전류를 강하게 제한하며, 통상 0~5 °C 구간에서 0.1C 수준, 0 °C 이하에서는 충전 금지에 가깝게 운용된다. 따라서 "충전 전에 전지를 빠르게 데우는 것"이 저온 급속충전의 선결 조건이다.

### 1.2 목적 및 범위

본 보고서는 펄스 히팅(펄스 전류 및 AC 자가발열)의 원리, 회로 구현 방식, 설계 파라미터, 성능·열화 특성, 산업 동향을 조사·분석하고, 실무 도입을 위한 설계 지침과 검증 계획을 제시한다.

**범위에 포함** — 셀·모듈·팩 레벨 전기적 자가발열(펄스/AC), 관련 전력변환 토폴로지, 제어 전략, 열화 평가
**범위에서 제외** — 외부 열원 기반 가열(PTC, 히트펌프, 액랭 회로)의 상세 설계, 전해액 첨가제 등 소재적 저온 개선책 (비교 목적으로만 언급)

### 1.3 용어 정의

| 용어 | 정의 |
|---|---|
| 펄스 히팅 (Pulse Heating) | 구형파 형태의 큰 전류를 주기적으로 인가해 내부 저항 발열로 셀을 가열하는 방식 |
| 단방향 펄스 (Unidirectional Pulse) | 방전 펄스만 사용. 구현이 단순하나 SOC 소모가 큼 |
| 양방향 펄스 (Bidirectional Pulse Current, BPC) | 충전·방전 펄스를 교번. 순 전하 이동이 작아 SOC 소모가 적음 |
| AC 자가발열 (AC Self-Heating) | 정현파 교류를 인가하는 방식. BPC의 연속파 극한으로 볼 수 있음 |
| 자가발열 (Self-Heating) | 외부 전원 없이 전지 자신의 에너지로 발열하는 구성 |
| 리튬 석출 (Li Plating) | 음극 전위가 Li/Li⁺ 대비 0 V 이하로 내려가 금속 리튬이 표면에 석출되는 현상 |
| 승온 효율 (Thermal Efficiency) | η_th = (유효 열용량 × 승온폭) / (전지에서 인출된 총 에너지) |

---

## 2. 저온에서의 리튬이온전지 거동

### 2.1 임피던스 증가 메커니즘

저온에서 셀 임피던스가 증가하는 원인은 주파수 대역별로 구분된다.

| 주파수 대역 | 지배 현상 | 온도 민감도 |
|---|---|---|
| > 10 kHz | 인덕턴스, 집전체·탭 저항 | 낮음 |
| 1 kHz ~ 10 kHz | 전해질 옴 저항 (R_ohm) | 중간 (이온전도도 ∝ exp(−E_a/RT)) |
| 10 Hz ~ 1 kHz | SEI 피막 저항 | 중간~높음 |
| 0.1 Hz ~ 10 Hz | 전하이동 저항 (R_ct) | **매우 높음** |
| < 0.1 Hz | 고상 확산 (Warburg) | 매우 높음 |

핵심은 **R_ct의 온도 의존성이 압도적**이라는 점이다. R_ct는 Arrhenius 거동(활성화 에너지 약 50~70 kJ/mol)을 따라 −20 °C에서 상온 대비 한 자릿수 이상 증가한다. 반면 1 kHz 옴 저항의 증가는 2~3배 수준에 그친다.

이 비대칭성이 펄스 히팅 설계의 출발점이다.

- **저주파 인가** → Re(Z)가 크므로 같은 전류에서 발열량이 큼. 그러나 전하이동 반응이 실제로 진행되어 분극이 크게 발생 → 리튬 석출 위험 증가
- **고주파 인가** → 전기이중층 커패시턴스(C_dl)가 전류를 분류(shunt)하여 패러데이 반응이 거의 일어나지 않음 → 석출 위험 낮음. 그러나 Re(Z)가 R_ohm 근처로 수렴해 발열량이 감소

즉 **발열량과 안전 마진은 주파수에 대해 상충(trade-off)** 관계에 있다.

### 2.2 전하이동 특성 주파수

전기이중층과 전하이동 저항의 병렬 조합에서 특성 주파수는

```
f_ct = 1 / (2π · R_ct · C_dl)
```

로 주어진다. 상온에서는 R_ct가 작아 f_ct가 수십~수백 Hz에 위치하나, −20 °C에서는 R_ct 증가로 f_ct가 0.1~10 Hz 대역으로 내려온다. 따라서 **f ≫ f_ct 조건에서 동작하면 전류의 대부분이 이중층을 통해 흐르고 패러데이 반응 비중이 줄어든다.** 이것이 고주파 AC 가열이 "리튬 석출을 유발하지 않는다"고 보고되는 물리적 근거다.

### 2.3 저온 충전의 근본 제약

음극 표면 과전위는 다음과 같이 정의된다.

```
η_a = φ_s − φ_e − U_a(c_s,surf)
```

여기서 φ_s는 고상 전위, φ_e는 액상 전위, U_a는 음극 개방회로 전위다. 충전 시 η_a < 0이며, **η_a ≤ 0 V(vs. Li/Li⁺)에 도달하면 리튬 석출이 열역학적으로 가능**해진다. 저온·고SOC·고전류는 모두 η_a를 0에 가깝게 만드는 방향으로 작용한다.

실무적으로는 안전 마진을 두어 다음 제약을 사용한다.

```
min over pulse period [ η_a(t) ] ≥ η_margin   (통상 10 ~ 20 mV)
```

이 제약이 펄스 히팅 최적화의 부등식 제약조건이 된다.

---

## 3. 가열 기술의 분류와 펄스 히팅의 위치

### 3.1 분류 체계

```
저온 가열 기술
├── 외부 가열 (External)
│   ├── 공랭 (가열 공기 순환)
│   ├── 액랭 회로 + 고전압 히터 / 히트펌프
│   ├── PTC 히터 (모듈 접촉식)
│   ├── 필름 히터 / 히트파이프
│   └── 구동계 폐열 활용 (모터·인버터 손실열 → 냉각수)
└── 내부 가열 (Internal)
    ├── 셀 구조 내장형 (니켈 포일 삽입 = All-Climate Battery)
    ├── 단방향 DC 방전 자가발열
    ├── 펄스 자가발열 (단방향 / 양방향)   ← 본 보고서 대상
    └── AC 자가발열 (저주파 / 고주파)     ← 본 보고서 대상
```

### 3.2 방식별 비교

| 방식 | 대표 승온율 | 열전달 경로 | 온도 균일도 | 추가 H/W | 에너지 효율 | 열화 리스크 |
|---|---|---|---|---|---|---|
| 공랭 | < 0.5 °C/min | 길다 (공기→케이스→젤리롤) | 나쁨 | 송풍·히터 | 낮음 | 낮음 |
| 액랭 + HV 히터 | 1 ~ 6.7 °C/min | 중간 | 양호 | 히터·펌프·배관 | 중간 | 낮음 |
| PTC 접촉 히터 | 0.5 ~ 2 °C/min | 짧다 | 중간 (면 접촉 편차) | PTC 모듈 | 중간 | 낮음 |
| 셀 내장 Ni 포일 | 매우 빠름 (−20 °C → 0 °C, 20 s) | 없음 (내부) | 우수 | **셀 구조 변경** | 높음 | 낮음 |
| 단방향 DC 자가발열 | 빠름 | 없음 | 우수 | 거의 없음 | 높음 | 중간 (SOC 소모·전압하한) |
| **펄스 / AC 자가발열** | **3 ~ 17 °C/min** | **없음** | **우수** | 전력변환 회로 | **높음** | **중간~높음 (석출 관리 필요)** |

> 주: 승온율은 셀 화학·용량·단열 조건·인가 파라미터에 강하게 의존하는 값으로, 표의 값은 참고문헌에 보고된 범위이며 직접 비교 시에는 시험 조건 정합이 필요하다.

### 3.3 펄스 히팅의 차별점

외부 가열은 셀 케이스에서 젤리롤 중심부로 열이 전도되어야 하므로, 표면 온도가 목표에 도달해도 **내부는 여전히 차갑다**. 젤리롤의 적층 방향 열전도도는 통상 0.9 W/(m·K) 수준으로 면내 방향(2.7 W/(m·K))보다 크게 낮아, 두꺼운 각형 셀일수록 이 지연이 커진다. 반면 펄스 히팅은 전극 계면 전체에서 동시에 발열하므로 **내부가 먼저 뜨거워지고**, 충전 가능 여부를 좌우하는 음극 계면 온도를 직접 올린다. 이것이 "같은 표면 온도에서도 펄스 가열 쪽이 충전 성능이 좋은" 이유다.

---

## 4. 펄스 히팅의 물리적 원리 및 모델링

### 4.1 발열량 모델

#### 4.1.1 일반형 (Bernardi 식)

```
Q_gen = I · (V − U_ocv)  −  I · T · (dU_ocv/dT)
        ‾‾‾‾‾‾‾‾‾‾‾‾‾‾     ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
        비가역열 (분극)      가역열 (엔트로피)
```

**양방향 펄스의 중요한 성질** — 가역열 항은 전류 부호에 따라 부호가 바뀌므로, 충·방전 대칭 펄스에서는 한 주기 평균이 거의 상쇄된다. 반면 비가역열 항은 I²에 비례하므로 부호와 무관하게 항상 양(+)이다. 따라서 양방향 펄스는 **가역열의 냉각 효과 없이 비가역열만 누적**시키는 효율적인 발열 방식이다.

#### 4.1.2 임피던스 기반 실용형

주기 정상상태에서 전류를 푸리에 급수로 분해하면 발열량은 다음과 같이 정리된다.

```
Q_gen(T) = Σ_n  I_n,rms² · Re{ Z(n·f₀, T, SOC) }
```

단일 주파수 정현파(AC) 인가 시에는 간단히

```
Q_gen = I_rms² · Re{ Z(f, T) }
```

**설계상 함의** — 구형파 펄스는 기본파 외에 홀수 고조파(3f₀, 5f₀ …)를 포함하는데, 고조파 대역에서는 Re(Z)가 작아지므로 **동일 실효값에서 구형파의 발열량은 정현파보다 낮을 수 있다.** 다만 구형파는 동일 피크 전류 대비 실효값이 크고 스위칭 구현이 단순해, 실제 시스템에서는 구형파(또는 사다리꼴파)가 널리 쓰인다.

#### 4.1.3 열 모델 (Lumped)

```
m · c_p · dT/dt = Q_gen(T) − h · A · (T − T_amb)
```

초기 단계(T ≈ T_amb)에서는 방열항이 0에 가까우므로 단열 근사가 성립한다.

```
dT/dt |_adiabatic = I_rms² · Re{Z(f,T)} / (m · c_p)
```

여기서 Re(Z)가 온도 상승에 따라 감소하므로 **승온율은 시간에 따라 체감**한다. 즉 저온일수록 발열이 강하고 목표 온도에 가까워질수록 자연히 약해지는 **자기 안정화(self-limiting) 특성**을 가진다 — 안전 관점에서 유리한 성질이다.

### 4.2 설계 예제 (수치 감각 확보)

50 Ah 각형 LFP 셀 기준 (185 × 135 × 26 mm)

| 항목 | 값 | 근거 |
|---|---|---|
| 셀 질량 m | 1.4 kg | 체적 0.65 L × 평균밀도 ≈ 2,200 kg/m³ |
| 비열 c_p | 1,100 J/(kg·K) | 리튬이온 셀 일반값 |
| 열용량 C_th = m·c_p | 1,540 J/K | — |
| −20 °C에서 Re(Z) @ 1 Hz | 5 mΩ (가정) | R_ohm 대비 수 배 증가 반영 |
| 인가 전류 | 4C = 200 A_rms | — |

```
Q_gen = (200 A)² × 0.005 Ω = 200 W
dT/dt = 200 W / 1,540 J/K = 0.130 K/s = 7.8 °C/min
```

−20 °C → 0 °C(ΔT = 20 K) 승온에 필요한 시간과 에너지는

```
t   = 1,540 J/K × 20 K / 200 W ≈ 154 s
E_th = 30.8 kJ = 8.6 Wh
```

셀 공칭 에너지 3.2 V × 50 Ah = 160 Wh 대비 순수 열에너지 기준 **5.4 %**. 전력변환 손실과 방열을 감안해 승온 효율 30~50 %를 적용하면 **실제 SOC 소모는 약 11~18 %** 수준으로 추정된다. 문헌에서 보고되는 "−20 °C에서 3.8 %, −30 °C에서 5.5 % 용량 소모"(셀 내장 니켈 포일 방식) 대비 크게 나쁘지 않은 값이나, 시스템 효율이 최종 SOC 비용을 좌우함을 보여준다.

### 4.3 주파수 선정 논리

```
        발열량 Re(Z)                리튬 석출 마진
              ↑                          ↑
    크다 ─────┤                          ├───── 크다
              │╲                        ╱│
              │ ╲                      ╱ │
              │  ╲__                __╱  │
    작다 ─────┤     ‾‾‾──────────‾‾‾     ├───── 작다
              └──────────┬───────────────→ 주파수
                      f_ct 근방        수백 Hz ~ kHz
                     (0.1~10 Hz @ −20 °C)
```

- **f < f_ct (저주파, 0.01~1 Hz)** — 패러데이 반응 활발, 발열 큼, **석출 위험 최대**. 이 대역에서는 반드시 양방향 펄스 + 듀티 제어로 분극을 상쇄해야 한다.
- **f ≈ f_ct (1~100 Hz)** — 절충 대역. 대부분의 BPC 연구가 여기에 위치한다.
- **f ≫ f_ct (100 Hz ~ kHz)** — 이중층 분류 효과로 석출 위험 낮음. Re(Z)가 작아 큰 진폭(3~5C)이 필요하며, 전력변환 단의 전류 정격과 EMI가 제약이 된다.
- **f > 10 kHz** — Re(Z)가 R_ohm으로 수렴, 발열 효율 한계. 스위칭 손실 증가로 실익 없음.

**가변 주파수 전략** — 온도가 오르면 f_ct가 상승하고 Re(Z) 형상이 변하므로, 고정 주파수는 준최적이다. 온도·SOC에 따라 주파수·진폭을 실시간 조정하는 가변 주파수(또는 온도 적응형) 전략이 최근 연구의 주류이며, "−20 °C → 11.1 °C를 5분 내, 90 사이클 후 용량 손실 없음" 수준의 결과가 보고되고 있다.

### 4.4 펄스 파형 파라미터

| 파라미터 | 기호 | 전형 범위 | 영향 |
|---|---|---|---|
| 진폭 | I_amp | 1C ~ 5C | 발열량 ∝ I². 가장 강한 레버. 동시에 석출·전압리미트 제약의 주 원인 |
| 주파수 | f | 0.1 Hz ~ 1 kHz | 4.3절 참조 |
| 듀티비 | D | 0.3 ~ 0.7 | 충·방전 시간비. D 조정으로 순 SOC 변화와 분극 균형을 제어 |
| 충/방전 진폭비 | I_c/I_d | 0.6 ~ 1.0 | 방전 진폭을 충전보다 크게 두면 석출 마진 확보에 유리 |
| 초기 SOC | SOC₀ | 20 ~ 80 % | 높을수록 승온 빠르나 **석출 위험 급증** (음극이 이미 리튬으로 포화) |

**중요** — 문헌은 일관되게 **고SOC에서의 펄스 히팅이 가장 위험**하다고 보고한다. 고SOC에서는 음극 U_a가 이미 낮아 충전 펄스 시 η_a가 쉽게 0 이하로 내려간다. 따라서 SOC 의존적 진폭 제한 테이블이 BMS에 반드시 포함되어야 한다.

---

## 5. 회로 토폴로지 (구현 방식)

### 5.1 유형별 정리

#### (A) 외부 전원 기반 (충전기 활용)
충전기 또는 급속충전기가 펄스 전류를 공급. 차량 측 부품 추가가 없고 SOC 소모가 없다는 장점이 있으나, **충전 커넥터 연결 상태에서만 사용 가능**하여 주행 전 예열이나 주행 중 가열에는 쓸 수 없다. 또한 충전 인프라 측 프로토콜 지원이 필요하다.

#### (B) 팩 분할 + DC/DC (상호 펄스 가열, Mutual Pulse Heating)
팩을 두 개 그룹(A, B)으로 분할하고 양방향 DC/DC로 연결, 그룹 간 에너지를 왕복시킨다. A가 방전하는 동안 B가 충전되고 반주기 후 반전되므로, 팩 전체의 순 에너지 소모는 변환 손실과 셀 내부 발열분뿐이다.

- 장점: 외부 전원 불필요, 파라미터 제어 자유도 높음, 승온율 우수
- 단점: 고전류 정격 DC/DC와 인덕터 필요(비용·중량), 그룹 간 SOC 편차 누적 관리 필요
- 변형: 다중화 컨버터(multiplexing converter)를 이용해 여러 모듈을 순차 페어링하는 방식이 제안되어 있으며, "−20 °C → 0 °C를 178.3 s, 온도 구배 2 °C 미만" 수준이 보고된다.

#### (C) 모터·인버터 재구성 (Drive Circuit Reconfiguration) — **양산 주류**
기존 구동 인버터의 3상 브리지와 모터 권선의 인덕턴스를 그대로 펄스 발생기로 활용한다. 모터 중성점을 스위치로 팩 중점에 연결하면, 모터 권선이 에너지 저장 인덕터, 인버터 레그가 양방향 초퍼로 동작하여 팩 상·하단 간 에너지를 고주파로 왕복시킨다.

- 장점: **추가 전력부품이 사실상 없음**(중성점 스위치 정도), 대전류 정격 확보 용이, 비용 최소
- 단점: 모터 권선의 철손·동손, 회전자 토크 리플 억제 제어 필요, **NVH(전자기 소음)** 이슈, 주차 상태에서만 사용하거나 주행 중 병행 제어 로직이 복잡
- 적용: BYD가 이 계열의 고주파 펄스 승온을 채택. 예열과 주행 중 가열을 모두 지원하는 재구성 방식이 최근 제안되고 있다.

#### (D) 스위치드 커패시터 / LC 공진 히터
소형 커패시터·인덕터와 반도체 스위치로 공진 경로를 구성해 고주파 대전류를 순환시킨다. 공진 동작으로 스위칭 손실을 줄이고 부품을 소형화할 수 있다. 커패시터 방전에 따른 부가 손실은 총 에너지의 5~10 % 수준으로 보고된다.

- 장점: 컴팩트, 고주파(수백 Hz~kHz) 구현에 유리 → 석출 위험 낮음
- 단점: 대용량 팩 스케일업 시 커패시터 정격·수명(저온 ESR 증가)이 제약

#### (E) 셀 구조 내장형 (All-Climate Battery, 참고)
셀 내부에 50 µm 니켈 포일을 삽입하고 제3 단자를 외부로 인출, 스위치로 포일에 전류를 흘려 저항 발열시킨다. 펄스 히팅은 아니지만 "내부 가열"의 성능 상한을 보여주는 기준점이다.

- 성능: −20 °C에서 20초 내, −30 °C에서 30초 내 0 °C 도달, 용량 소모 각각 3.8 %, 5.5 %
- 제약: **셀 구조·공정 변경 필요**, 제3 단자로 인한 밀봉·안전 설계 부담. 기존 셀 공급망에 적용 불가

### 5.2 토폴로지 비교표

| 항목 | (A) 외부전원 | (B) 팩분할 DC/DC | (C) 모터·인버터 | (D) SC/LC 공진 | (E) 셀 내장 |
|---|---|---|---|---|---|
| 추가 부품비 | 없음 | **높음** | **매우 낮음** | 낮음~중간 | 셀 원가 반영 |
| 추가 중량 | 없음 | 중간 | 거의 없음 | 낮음 | 낮음 |
| 주차 중 예열 | ✕ (커넥터 필요) | ○ | ○ | ○ | ○ |
| 주행 중 가열 | ✕ | ○ | △ (제어 복잡) | ○ | ○ |
| 달성 주파수 | 낮음 (충전기 대역폭) | 중간 | 중간~높음 | **높음** | N/A |
| NVH | 없음 | 낮음 | **이슈 있음** | 낮음 | 없음 |
| 셀 변경 필요 | ✕ | ✕ | ✕ | ✕ | **○** |
| 양산 성숙도 | 중간 | 낮음 | **높음** | 낮음 | 낮음 |

### 5.3 토폴로지 선정 권고

- **기존 플랫폼 개조 / 원가 민감** → (C) 모터·인버터 재구성. 부품 추가 없이 구현 가능하며 양산 레퍼런스가 존재한다.
- **고성능·고제어자유도 요구, 상용차·특수차** → (B) 팩 분할 DC/DC. 파라미터 최적화 여지가 가장 크다.
- **소형 팩(이륜·소형 상용·ESS 모듈)** → (D) 공진형. 고주파 동작으로 열화 리스크를 낮출 수 있다.
- **(E)는 차세대 셀 개발 항목으로 분리 검토** — 기존 셀 라인에 적용할 수 없으므로 단기 로드맵에서는 제외한다.

---

## 6. 성능 벤치마크

문헌에 보고된 대표 결과를 정리한다. **시험 조건(셀 화학·용량·단열 상태·초기 SOC)이 서로 다르므로 절대 비교는 불가**하며, 달성 가능한 범위를 가늠하는 용도로 사용해야 한다.

| # | 방식 | 셀 / 조건 | 파라미터 | 결과 | 열화 평가 |
|---|---|---|---|---|---|
| 1 | 단방향 펄스 자가발열 | — | — | −10 °C → 10 °C, **175 s** (DC 연속 방전은 280 s) | 내부저항·휴지기 전압이 승온시간 지배인자 |
| 2 | 양방향 펄스 (BPC) | −15 °C 환경 | 진폭·주파수·듀티 최적화 | **6.38 °C/min**, 승온효율 **31.9 %** | 30 사이클 후 유의한 열화 없음 (용량·ICA·EIS 검증) |
| 3 | 고주파 AC | 3.2 V / 50 Ah LFP 각형 | 833 Hz, 3.1C | −20 °C → 5 °C, **365 s** | 전해액 농도·전압 리미트 이내, 수명 영향 없음으로 보고 |
| 4 | 고주파 AC (비교군) | 동일 셀 | 500 Hz, 4.2C | −20 °C → 5 °C, 480 s | — |
| 5 | 저주파 AC (비교군) | 동일 셀 | 0.1 Hz, 1C | 600 s에 ΔT = +16.1 K | 저주파·소진폭은 승온 열위 |
| 6 | 온도 적응형 자가발열 | — | 온도별 최대 허용 진폭 산출 | −20 °C → 11.1 °C, **5분 이내** | **90 사이클 후 용량 손실 없음** |
| 7 | 고속 자가예열 시스템 | — | — | **17.14 °C/min**, 온도편차 3.58 °C | — |
| 8 | 다중화 컨버터 상호 펄스 | 팩 레벨 | — | −20 °C → 0 °C, 178.3 s, 온도구배 < 2 °C | 미시상태 안전 임계 이내 유지 |
| 9 | 셀 내장 Ni 포일 (참고) | ACB 셀 | 저항 발열 | −20 °C → 0 °C **20 s** / −30 °C → 0 °C **30 s** | 용량 소모 3.8 % / 5.5 % |

### 6.1 벤치마크 해석

1. **승온율 3~7 °C/min이 현실적 설계 목표**다. 17 °C/min급 보고값은 소형 셀·고단열·극한 파라미터 조건에서의 값으로, 팩 레벨에서 그대로 재현되기 어렵다.
2. **승온 효율은 30 % 내외**가 보고된다. 즉 인출 에너지의 2/3 이상이 셀 유효 열용량 상승 외의 경로(전력변환 손실, 팩 구조물 가열, 방열)로 소모된다. **팩 단열 설계가 효율에 직접 기여**한다.
3. **열화 데이터의 신뢰 구간이 아직 좁다.** 대부분의 연구가 30~90 사이클 수준에서 "유의한 열화 없음"을 보고하는데, 이는 차량 수명(겨울 5~10년 × 연 수십~수백 회 예열)을 커버하지 못한다. 양산 적용 전 **최소 500~1,000 예열 사이클 등가 검증**이 필요하다 (9.3절).

---

## 7. 열화 및 안전성 분석

### 7.1 주요 열화 경로

| 열화 경로 | 발생 조건 | 영향 | 대응 |
|---|---|---|---|
| **리튬 석출** | 저온 + 고SOC + 대진폭 + 저주파 충전 펄스 | 비가역 용량 손실, 덴드라이트 → 내부단락 | η_a ≥ η_margin 제약, SOC별 진폭 제한, 고주파화 |
| SEI 성장 가속 | 반복 대전류 + 온도 사이클 | 저항 증가, 용량 감소 | 승온 횟수·강도 제한, 목표온도 최소화 |
| 활물질 입자 균열 | 급격한 리튬 농도 구배 | 용량 감소 | 진폭 램프업(soft start), 급격한 파형 전이 회피 |
| 집전체·탭 피로 | 대전류 반복 통전에 의한 국부 발열 | 접촉저항 증가 | 탭 온도 모니터링, 전류 상한 설정 |
| 온도 불균일 열화 | 팩 내 셀별 임피던스 편차 | 셀 간 SOH 분산 확대 | 모듈별 파라미터 보정, 균일도 요구사항 설정 |

### 7.2 안전 관점

**유리한 점**

- **자기 안정화 특성** — 온도 상승 → Re(Z) 감소 → 발열 감소. 폭주적 가열이 구조적으로 어렵다.
- 외부 히터와 달리 국부 고온점(hot spot)이 발생하지 않는다. 발열이 전극 면 전체에 분포한다.
- 양방향 펄스는 순 SOC 변화가 작아 전압 리미트 여유 확보가 상대적으로 쉽다.

**불리한 점 / 관리 필요 항목**

- **전압 순간 초과** — 대진폭 펄스의 충전 반주기에 단자전압이 상한(예: LFP 3.65 V)을 순간 초과할 수 있다. BMS 전압 보호는 샘플링 주기(통상 10~100 ms)가 펄스 주기보다 길 수 있어 **놓칠 수 있다.** 고속 하드웨어 보호 회로 또는 예측 기반 진폭 제한이 필요하다.
- **전류 센싱 대역폭** — 수백 Hz~kHz 펄스에서 기존 홀 센서·션트의 대역폭과 필터 지연이 제어 정확도를 제한한다.
- **EMI** — 대전류 고주파 스위칭은 차량 EMC 요건(CISPR 25 등)에 직접 영향을 준다. 조기 EMC 검토가 필수다.
- **커넥터·버스바 발열** — 셀뿐 아니라 접속부에서도 I²R 발열이 발생한다. 대진폭·장시간 운전 시 접속부 온도 상한 관리가 필요하다.

### 7.3 관련 규격

현재 **펄스 자가발열을 직접 규정하는 표준은 없다.** 다만 다음 규격의 요건을 충족해야 한다.

| 규격 | 관련 내용 |
|---|---|
| UN GTR No. 20 / UN ECE R100 | 전기차 안전 일반, 열폭주 전파 요건 |
| ISO 6469-1/-4 | 전기차 축전지 시스템 안전 |
| IEC 62660-1 | 리튬이온 셀 성능·수명 시험 (저온 시험 조건 포함) |
| IEC 62660-2/-3 | 신뢰성·오사용 시험 / 안전 요구사항 |
| CISPR 25 / ISO 11452 | EMC (고주파 스위칭 관련) |

**시사점** — 규격 공백은 기회이자 리스크다. 자체적으로 "펄스 히팅 운전 한계 사양서"(진폭·주파수·SOC·온도·누적 횟수 상한)를 정의하고, 이를 셀 공급사와의 보증(warranty) 협의 문서에 반영해야 한다. 셀 공급사 데이터시트의 최대 충전 전류 규정을 펄스 운전이 위반하는지 여부가 **품질 책임 소재의 핵심 쟁점**이 된다.

---

## 8. 산업 적용 동향

### 8.1 CATL

2026년 4월 Tech Day에서 3세대 선싱(Shenxing) LFP 배터리를 공개하며 **펄스 자가발열(self-heating pulse) 기술 적용**을 발표했다.

- 상온: 10 % → 80 % 3분 44초, 10 % → 98 % 6분 27초
- **−30 °C: 9분 내 98 % 충전 (별도 충전 하드웨어 불필요)**
- 초저저항 설계: 셀 내부저항 0.25 mΩ (업계 평균 대비 약 50 % 낮음)
- 1,000 급속충전 사이클 후 SOH 90 % 이상 유지

**분석** — 주목할 점은 저저항 셀 설계와 펄스 히팅의 조합이다. 내부저항이 낮으면 같은 전류에서 발열량이 줄어 가열에는 불리하지만, 저온 충전 시 분극이 작아 **애초에 필요한 승온폭 자체가 줄어든다**. 즉 CATL은 "셀 저항을 낮춰 저온 충전 가능 온도를 낮추고, 남은 격차를 펄스 히팅으로 메우는" 통합 접근을 취한 것으로 해석된다. 가열 성능만 별도 최적화하는 접근보다 시스템 관점에서 유리하다.

### 8.2 BYD

전동화 구동계(모터·인버터)를 이용한 **고주파 펄스 승온**을 채택. 5.1절 (C) 유형에 해당하며, 별도 히터 없이 구동 부품을 재활용하는 저원가 구현이다. 특허군에서도 모터 중성점 연결 스위치와 3상 브리지를 이용한 양방향 DC/DC 동작 방식이 다수 확인된다.

### 8.3 현대차그룹

배터리 컨디셔닝 모드를 통해 내비게이션 목적지/경유지로 급속충전소를 설정하면 주행 중 미리 배터리 온도를 제어하는 기능을 제공한다. 다만 승온 수단은 **모터·인버터 폐열로 냉각수를 데우는 경쟁사 방식과 달리 별도 배터리 히터로 냉각수를 가열**하는 방식이다. 즉 액랭 회로 기반 외부 가열에 해당하며, 전기적 자가발열은 적용되어 있지 않다.

**시사점** — 예측 제어(경로 기반 사전 예열) 측면의 소프트웨어 역량은 확보되어 있으나, 가열 하드웨어 측면에서는 외부 가열 방식에 머물러 있다. 펄스 자가발열은 **기존 컨디셔닝 로직 위에 얹을 수 있는 증분 기술**로, 승온율 향상과 히터 부품 삭제(원가·중량)를 동시에 노릴 수 있는 영역이다.

### 8.4 학계 동향 요약

| 시기 | 흐름 |
|---|---|
| ~2016 | 셀 구조 내장형(니켈 포일 ACB) — 내부 가열의 개념 실증 (Nature, 2016) |
| 2018~2021 | 단방향 펄스 / 저주파 AC의 실험적 특성 규명, 승온율 중심 연구 |
| 2021~2023 | 회로 토폴로지 다양화 (스위치드 커패시터, 다중화 컨버터, 구동계 재구성) |
| 2023~2026 | **제약 최적화로 전환** — 전기화학-열 연성 모델 + 리튬 석출 기준을 결합한 비파괴(non-destructive) 가열 전략, 가변 주파수·온도 적응형 제어, in-situ 석출 관측 |

**핵심 전환점** — 최근 3년의 연구는 "얼마나 빨리 데우는가"에서 "**열화 없이** 얼마나 빨리 데우는가"로 문제 정의가 이동했다. 이는 양산 적용을 전제로 한 성숙의 신호이며, 개발 조직도 동일한 기준(열화 제약 하 승온율)을 KPI로 설정해야 한다.

---

## 9. 실무 도입 지침

### 9.1 설계 절차

```
1단계  셀 특성화
       └─ 온도별(−30/−20/−10/0/25 °C) × SOC별(20/50/80 %) EIS 측정
       └─ Re(Z(f,T,SOC)) 맵 구축, R_ohm / R_ct / C_dl 분리
       └─ 3전극 셀로 음극 전위 U_a, η_a 직접 계측 (필수)

2단계  모델 구축
       └─ 임피던스 기반 전기-열 연성 모델 (ECM + lumped thermal)
       └─ 리튬 석출 판정: η_a(t) 최소값 관측기
       └─ 검증: 계측 승온 곡선 대비 오차 ±5 % 이내 목표

3단계  파라미터 최적화 (제약 최적화)
       목적함수  max  dT/dt
       제약      η_a(t) ≥ η_margin        (리튬 석출)
                 V_cell(t) ≤ V_max        (전압 상한)
                 V_cell(t) ≥ V_min        (전압 하한)
                 |I| ≤ I_max_HW           (전력변환 정격)
                 ΔT_pack ≤ ΔT_limit       (온도 균일도)
       결과      온도·SOC 격자별 (I_amp, f, D) 룩업 테이블

4단계  토폴로지 구현 및 팩 스케일업
       └─ 5.3절 선정 기준 적용
       └─ 셀 간 임피던스 편차에 의한 온도·SOC 불균일 해석
       └─ 최약셀(worst cell) 기준 제약 적용

5단계  검증 (9.3절)
```

### 9.2 BMS 제어 요구사항 체크리스트

- [ ] 온도·SOC별 펄스 파라미터 룩업 테이블 및 보간 로직
- [ ] 진폭 소프트스타트 / 소프트스톱 (급격한 전류 계단 회피)
- [ ] **펄스 주기보다 빠른 전압 보호** — 하드웨어 비교기 또는 예측 기반 진폭 제한
- [ ] 최약셀 기준 제어 (팩 내 최저 전압/최고 임피던스 셀)
- [ ] 누적 펄스 히팅 이력 카운터 (횟수·적산 Ah·적산 열량) → SOH 모델 입력
- [ ] 비정상 종료 조건 정의: 셀 전압 편차 확대, 온도 편차 초과, 탭·버스바 과온, 절연저항 저하
- [ ] 목표 온도 설정 로직 — 충전 가능 최소 온도까지만 가열(과승온은 에너지·열화 낭비)
- [ ] 사용자 경험: NVH 발생 시 안내, 주차 중/충전 중/주행 중 모드 구분

### 9.3 검증 시험 계획 (권고)

| 시험 | 목적 | 조건 | 판정 기준 |
|---|---|---|---|
| 승온 성능 시험 | 기본 성능 확인 | −30/−20/−10 °C × SOC 20/50/80 % | 목표 승온율, 승온 효율 |
| 온도 균일도 시험 | 팩 설계 검증 | 팩 레벨, 다점 열전대 | ΔT_max ≤ 5 °C (권고) |
| **가속 열화 시험** | **수명 영향 정량화** | **예열 사이클 500회 이상 (차량 5~10년 등가)** | **용량 유지율 ≥ 기준, 저항 증가율 ≤ 기준** |
| 비파괴 석출 진단 | 리튬 석출 유무 | 사이클 중간중간 EIS + ICA(dQ/dV) + 휴지 전압 완화 거동 | 석출 지시자 유의 변화 없음 |
| 파괴 분석 | 최종 확인 | 시험 종료 셀 해체 (dry room) | 음극 표면 금속 리튬 미검출 |
| 오사용 시험 | 안전 한계 확인 | 제약 위반 조건 의도적 인가 | 열폭주 미발생, 보호 정상 동작 |
| EMC 시험 | 법규 대응 | CISPR 25 | 규격 등급 만족 |

**가속 열화 시험이 본 기술 도입의 최대 게이트다.** 문헌의 30~90 사이클 데이터로는 양산 판단을 내릴 수 없으며, 이 시험에만 통상 6~12개월이 소요되므로 개발 일정의 임계 경로로 관리해야 한다.

---

## 10. 한계 및 향후 과제

### 10.1 기술적 미해결 과제

1. **팩 스케일 불균일** — 셀 레벨 결과가 팩에서 그대로 재현되지 않는다. 셀 간 임피던스 편차가 발열량 편차로 직결되고, 이는 다시 온도 편차 → 임피던스 편차 확대의 양의 피드백을 만든다. 모듈별 개별 제어 또는 보수적 최약셀 기준 운용이 현재의 현실적 대안이며, 근본 해법은 미확립 상태다.
2. **리튬 석출의 실시간 관측** — η_a는 3전극 셀에서만 직접 측정 가능하며 양산 셀에서는 추정해야 한다. 동적 EIS 기반 석출 검출은 신뢰성 확보에 어려움이 보고되고 있어, 현재는 **모델 기반 보수적 마진**에 의존한다.
3. **장기 열화 데이터 부재** — 6.1절, 9.3절 참조.
4. **NVH 및 EMI** — 모터·인버터 재구성 방식의 실용상 최대 장벽. 고주파화가 해법이나 스위칭 손실·정격과 상충한다.

### 10.2 조사 범위의 한계

- 본 보고서의 정량 수치는 공개 문헌 및 제조사 발표 자료에 근거하며, **동일 조건에서 재현 검증된 값이 아니다.** 특히 표 6-1의 승온율·효율은 셀 화학·형상·단열 조건에 강하게 의존하므로 상호 비교에 사용해서는 안 된다.
- 제조사 발표 수치(CATL, BYD)는 마케팅 조건에서의 값일 가능성이 있어, 시험 조건(초기 SOC, 단열, 충전기 사양)이 공개되지 않는 한 보수적으로 해석해야 한다.
- 특허 상세 분석(침해 회피 설계, 회피 설계 가능성)은 본 조사 범위에 포함되지 않았다. 실제 개발 착수 전 별도 특허 조사(FTO)가 필요하다 — 특히 모터·인버터 재구성 방식은 BYD·CATL 특허가 밀집한 영역이다.

### 10.3 향후 연구 방향

- 소재 관점과의 결합 — 저온 전해액, 저저항 셀 설계로 **필요 승온폭 자체를 축소** (CATL 접근)
- 예측 제어와의 통합 — 경로·기상 정보 기반 예열 시점·목표온도 최적화 (열화·에너지 비용 최소화)
- 외부 가열과의 하이브리드 — 문헌상 PTC + 펄스 병용이 온도 균일도와 SOC 소모의 절충점에서 우수한 결과를 보인다
- 전고체전지 적용 — 초고주파 자가발열 연구가 초기 단계로 보고되고 있으며, 리튬 석출 제약이 다른 전고체계에서 본 기술의 제약 조건이 완화될 가능성이 있다

---

## 11. 결론 및 권고

### 11.1 결론

1. 펄스 히팅은 저온 리튬이온전지 가열 기술 중 **승온율과 부품 추가 최소화를 동시에 만족하는 유일한 계열**이며, 외부 가열 대비 3~5배 빠른 승온이 가능하다.
2. 기술적 성숙도는 **양산 진입 단계**다. CATL·BYD가 이미 적용 중이며, 학계 연구도 성능 탐색에서 열화 제약 최적화로 이동했다.
3. 최대 리스크는 **리튬 석출과 장기 열화**이며, 이는 파라미터 설계(진폭·주파수·듀티·SOC 제한)로 관리 가능한 것으로 보고되나 **장기 검증 데이터가 아직 부족**하다.
4. 토폴로지는 **모터·인버터 재구성 방식(5.1 C)**이 원가·중량 측면에서 가장 유력하나, NVH·EMI·특허가 실무 장벽이다.
5. 국내 완성차 관점에서 현재 외부 가열(별도 히터 + 액랭) 방식에 머물러 있어, 본 기술은 **경쟁사 대비 명확한 격차 영역**이자 **차별화 기회 영역**이다.

### 11.2 권고사항

| 우선순위 | 권고 | 기간 |
|---|---|---|
| **1** | 셀 특성화 착수 — 3전극 셀 기반 온도·SOC별 EIS 및 음극 전위 맵 구축. 모든 후속 작업의 전제 조건 | 3개월 |
| **2** | 임피던스 기반 전기-열 연성 모델 + 석출 제약 최적화 프레임워크 구축 | 6개월 |
| **3** | 특허 조사(FTO) 병행 — 모터·인버터 재구성 계열 집중 | 3개월 (2와 병행) |
| **4** | 단일 모듈 벤치 실증 — 토폴로지 (B) 또는 (C)로 승온율·효율 실측 | 9개월 |
| **5** | **가속 열화 시험 조기 착수** — 임계 경로. 4단계 완료를 기다리지 말고 보수적 파라미터로 선행 개시 | 즉시 ~ 12개월 |
| 6 | 셀 공급사와 펄스 운전 한계 사양 및 보증 범위 사전 협의 | 6개월 내 |

---

## 부록 A. 주요 수식 정리

| 항목 | 수식 |
|---|---|
| 발열량 (Bernardi) | `Q = I(V − U_ocv) − I·T·(dU_ocv/dT)` |
| 발열량 (임피던스 기반) | `Q = Σ_n I_n,rms² · Re{Z(n f₀, T, SOC)}` |
| 집중 열모델 | `m c_p dT/dt = Q_gen − h A (T − T_amb)` |
| 단열 승온율 | `dT/dt = I_rms² Re{Z} / (m c_p)` |
| 전하이동 특성 주파수 | `f_ct = 1 / (2π R_ct C_dl)` |
| 음극 과전위 | `η_a = φ_s − φ_e − U_a(c_s,surf)` |
| 석출 방지 제약 | `min_t η_a(t) ≥ η_margin  (10~20 mV)` |
| 승온 효율 | `η_th = m c_p ΔT / E_drawn` |
| R_ct 온도 의존성 | `R_ct ∝ exp(E_a / RT),  E_a ≈ 50~70 kJ/mol` |

## 부록 B. 파라미터 설계 초기값 (출발점 권고)

셀 특성화 결과로 반드시 갱신해야 하는 **초기 탐색 범위**다.

| 파라미터 | −30 °C | −20 °C | −10 °C |
|---|---|---|---|
| 진폭 (C-rate) | 2 ~ 3C | 2.5 ~ 4C | 3 ~ 5C |
| 주파수 | 100 ~ 500 Hz | 50 ~ 300 Hz | 20 ~ 200 Hz |
| 듀티비 (충전측) | 0.40 ~ 0.50 | 0.45 ~ 0.50 | 0.45 ~ 0.55 |
| SOC 상한 | 60 % | 70 % | 80 % |
| 목표 온도 | 0 ~ 5 °C | 0 ~ 10 °C | 10 ~ 15 °C |

> 진폭은 SOC가 높을수록, 온도가 낮을수록 축소해야 한다. 듀티비는 순 SOC 변화가 0에 가깝도록 조정하되, 방전 반주기를 약간 길게 두어 석출 마진을 확보하는 방향이 안전하다.

---

## 참고문헌

### 셀 내장형 내부 가열
1. Wang, C.-Y. et al., "Lithium-ion battery structure that self-heats at low temperatures," *Nature*, 2016. https://pubmed.ncbi.nlm.nih.gov/26789253/
2. Penn State Engineering, "Self-heating, fast-charging battery makes electric vehicles climate-immune," 2018. https://www.engr.psu.edu/news-archive/2018/wang-chao-yang-self-heating-batteries.aspx
3. "Rapid self-heating and internal temperature sensing of lithium-ion batteries at low temperatures," *Electrochimica Acta*. https://www.sciencedirect.com/science/article/abs/pii/S0013468616320357

### 펄스 / AC 자가발열 — 성능 및 전략
4. "Experimental study on pulse self-heating of lithium-ion battery at low temperature," *Int. J. Heat and Mass Transfer*, 135, 696, 2019. https://www.sciencedirect.com/science/article/abs/pii/S0017931018352803
5. "Experimental study on self-heating strategy of lithium-ion battery at low temperatures based on bidirectional pulse current," *Applied Energy*, 2024. https://www.sciencedirect.com/science/article/abs/pii/S0306261923015969
6. "A rapid self-heating strategy of lithium-ion battery at low temperatures based on bidirectional pulse current without external power," *J. Power Sources*, 2022. https://www.sciencedirect.com/science/article/abs/pii/S0378775322011156
7. "High-Frequency AC Heating Strategy of Electric Vehicle Power Battery Pack in Low-Temperature Environment," *ACS Omega*, 2024. https://pmc.ncbi.nlm.nih.gov/articles/PMC10956119/
8. "Battery heating for lithium-ion batteries based on multi-stage alternative currents," *J. Energy Storage*, 2021. https://www.sciencedirect.com/science/article/abs/pii/S2352152X20317229
9. "A variable-frequency self-heating strategy for lithium-ion batteries based on an electrochemical impedance-thermal coupling model applicable to a wide frequency range," *J. Energy Storage*, 2022. https://www.sciencedirect.com/science/article/abs/pii/S2352152X22022824
10. "Frequency varying heating strategy for lithium-ion battery rapid preheating under subzero temperature considering the limitation of on-board current," *Applied Energy*, 2024. https://www.sciencedirect.com/science/article/abs/pii/S030626192400566X
11. "Fast self-preheating system and energy conversion model for lithium-ion batteries under low-temperature conditions," *J. Power Sources*, 2023. https://www.sciencedirect.com/science/article/abs/pii/S0378775323002720

### 리튬 석출 제약 및 비파괴 가열
12. "A Health-Aware AC Heating Strategy With Lithium Plating Criterion for Batteries at Low Temperatures," *IEEE*, 2023. https://ieeexplore.ieee.org/document/10167813/
13. "Targeting the low-temperature performance degradation of lithium-ion batteries: A non-destructive bidirectional pulse current heating framework," 2024. https://www.sciencedirect.com/science/article/abs/pii/S2405829724000011
14. "An impedance-based electro-thermal model integrated with in-situ lithium-plating criterion for AC heating at low temperatures," *Applied Energy*, 2025. https://www.sciencedirect.com/science/article/abs/pii/S0306261925006609
15. "A record fast ACP self-heating for lithium-ion batteries without capacity loss based on electrochemical-thermal coupling model," *Applied Energy*, 2025. https://www.sciencedirect.com/science/article/abs/pii/S0306261925008839
16. "Scenario-adaptive preheating path optimization for bidirectional pulses and lithium deposition prevention in high-SOC lithium-ion batteries," 2025. https://www.sciencedirect.com/science/article/abs/pii/S0735193325011819
17. "Challenges in the reliable detection of lithium plating using dynamic electrochemical impedance spectroscopy," *J. Power Sources*. https://www.sciencedirect.com/science/article/pii/S0378775326012188
18. "Investigating the Effect of Different Bidirectional Pulsed Current Parameters on the Heat Generation of Lithium-Ion Battery at Low Temperatures," *Batteries*, 9(9), 457, 2023. https://doi.org/10.3390/batteries9090457

### 회로 토폴로지
19. "A rapid self-heating battery pack achieved by novel driving circuits of electric vehicle," *Energy Reports*, 2020. https://www.sciencedirect.com/science/article/pii/S2352484720315079
20. "A Novel Battery Self-Heating Method Based on Drive Circuit Reconfiguration Compatible with Both Preheating and On-Route Heating," *Sustainability*, 2026. https://www.mdpi.com/2071-1050/18/6/2998
21. "A high frequency AC heater based on switched capacitors for lithium-ion batteries at low temperature," *J. Energy Storage*, 2021. https://www.sciencedirect.com/science/article/abs/pii/S2352152X21006915
22. "An adaptive low-temperature mutual pulse heating method based on multiplexing converters for power-redistributable lithium-ion battery pack," *J. Energy Storage*, 2023. https://www.sciencedirect.com/science/article/abs/pii/S2352152X23008381
23. "Pulse self-heating strategy for low-temperature batteries based on bidirectional charging systems," *J. Power Electronics*, 2024. https://link.springer.com/article/10.1007/s43236-024-00947-6

### 외부 가열 비교 및 하이브리드
24. "Advanced low-temperature preheating strategies for power lithium-ion batteries applied in electric vehicles: A review," 2024. https://www.sciencedirect.com/science/article/pii/S1452398124003596
25. "Combined film and pulse heating of lithium ion batteries to improve performance in low ambient temperature," arXiv:2405.11388. https://arxiv.org/html/2405.11388
26. "Numerical study of positive temperature coefficient heating on the lithium-ion battery at low temperature," *AIP Advances*, 14(3), 2024. https://pubs.aip.org/aip/adv/article/14/3/035303/3267996/
27. "Temperature distribution of lithium ion battery module with inconsistent cells under pulsed heating method," *Applied Thermal Engineering*, 2022. https://www.sciencedirect.com/science/article/abs/pii/S1359431122004823

### 산업 동향
28. CarNewsChina, "CATL unveils 3rd-gen Shenxing LFP battery," 2026-04-21. https://carnewschina.com/2026/04/21/catl-unveils-3rd-gen-shenxing-lfp-battery-charging-10-80-in-3-min-44-seconds-10-98-in-6-min-27-seconds/
29. Electrek, "CATL one-ups BYD with its new LFP EV battery," 2026-04-21. https://electrek.co/2026/04/21/catl-one-ups-byd-new-lfp-ev-battery-charges-in-6-mins/
30. vehiclethermal.com, "Battery temperature too low solution — BYD self-heating technology." https://vehiclethermal.com/byd-ev/battery-temperature-too-low-solution-byd-self-heating-technology/
31. 현대자동차그룹, "혹한 속에서 빛난 현대차그룹의 배터리 승온 기술." https://www.hyundaimotorgroup.com/ko/story/CONT0000000000135654
32. HMG Developers, 배터리 승온 기술 해설. https://developers.hyundaimotorgroup.com/journal/90

### 규격
33. "Standards and Regulations for Battery Management Systems: Review and Improvement Potentials," 2025. https://pmc.ncbi.nlm.nih.gov/articles/PMC12418343/
34. IEC 62660-1, Battery Design 해설. https://www.batterydesign.net/legislation-rules-and-regulations/iec-62660-1/

---

**작성 상 유의사항**

본 보고서의 정량 데이터는 2026년 9월 기준 공개 문헌 및 제조사 발표자료에 근거한다. 문헌별 시험 조건(셀 화학·용량·형상, 단열 상태, 초기 SOC, 측정 위치)이 상이하므로 수치 간 직접 비교는 유효하지 않으며, 달성 가능 범위의 참고치로만 사용해야 한다. 4.2절의 설계 예제는 가정된 임피던스 값에 기반한 차수 추정(order-of-magnitude estimate)이며, 실제 설계는 반드시 대상 셀의 실측 EIS 데이터로 재수행해야 한다.
