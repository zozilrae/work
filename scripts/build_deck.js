const pptxgen = require("pptxgenjs");

const C = {
  ink:   "16202E",  ink2: "223349",  paper: "FFFFFF",
  soft:  "F2F5F8",  line: "DCE3EB",
  text:  "1A2332",  mute: "6B7A8D",  faint: "9AA7B5",
  lib:   "1F6FB2",  libL: "DCEAF6",  libD: "134A79",
  ssb:   "BF5F17",  ssbL: "FAE8D6",  ssbD: "8C4410",
  gold:  "E3A81F",  ok: "2E7D5B",    warn: "B3402F",
};
const F = "Malgun Gothic";
const sh = (o) => Object.assign({ type: "outer", color: "0B1220", blur: 10, offset: 2, angle: 90, opacity: 0.10 }, o || {});

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";           // 13.333 x 7.5
pres.author = "Technical Research";
pres.title = "펄스 히팅 기술 비교: 리튬이온 vs 전고체";
const W = 13.333, H = 7.5;

// ---------- helpers ----------
function darkBase(s) { s.background = { color: C.ink }; }
function lightBase(s) { s.background = { color: C.paper }; }

function slideTitle(s, kicker, title, accent) {
  if (kicker) s.addText(kicker, {
    x: 0.62, y: 0.38, w: 8.5, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 12, bold: true, color: accent || C.mute, charSpacing: 1.5,
  });
  s.addText(title, {
    x: 0.6, y: 0.68, w: 11.6, h: 0.78, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 30, bold: true, color: C.text,
  });
}

function foot(s, n, note) {
  if (note) s.addText(note, {
    x: 0.62, y: 6.92, w: 10.4, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 9, color: C.faint, italic: true,
  });
  s.addText(String(n), {
    x: 12.35, y: 6.92, w: 0.5, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 10, color: C.faint, align: "right",
  });
}

function card(s, o) {
  s.addShape(pres.ShapeType.roundRect, {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.06,
    fill: { color: o.fill || C.soft }, line: { color: o.line || C.line, width: 0.75 },
    shadow: o.shadow === false ? undefined : sh(),
  });
}

function circleNum(s, x, y, d, label, fill, fg) {
  s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
  s.addText(label, {
    x, y: y + 0.02, w: d, h: d, isTextBox: true, margin: 0,
    fontFace: F, fontSize: d > 0.5 ? 15 : 11, bold: true, color: fg || "FFFFFF", align: "center", valign: "middle",
  });
}

function trlGauge(s, x, y, level, color, w) {
  const cw = (w || 5.4) / 9, gap = 0.06;
  for (let i = 1; i <= 9; i++) {
    const on = i <= level;
    s.addShape(pres.ShapeType.roundRect, {
      x: x + (i - 1) * cw, y, w: cw - gap, h: 0.34, rectRadius: 0.2,
      fill: { color: on ? color : "E4E9EF" }, line: { color: on ? color : "E4E9EF" },
    });
    s.addText(String(i), {
      x: x + (i - 1) * cw, y: y + 0.36, w: cw - gap, h: 0.24, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 9, color: on ? color : C.faint, align: "center", bold: on,
    });
  }
}

// ============================================================ S1 표지
{
  const s = pres.addSlide(); darkBase(s);
  s.addShape(pres.ShapeType.ellipse, { x: 9.4, y: -1.7, w: 6.2, h: 6.2, fill: { color: C.libD, transparency: 62 }, line: { color: C.libD, transparency: 100 } });
  s.addShape(pres.ShapeType.ellipse, { x: 11.5, y: 3.6, w: 4.6, h: 4.6, fill: { color: C.ssbD, transparency: 58 }, line: { color: C.ssbD, transparency: 100 } });

  s.addText("TECHNICAL BRIEFING  ·  TR-2026-002", {
    x: 0.9, y: 1.62, w: 9, h: 0.32, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 12, bold: true, color: C.gold, charSpacing: 2,
  });
  s.addText("펄스 히팅 기술 비교 분석", {
    x: 0.86, y: 2.05, w: 10.2, h: 0.95, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 44, bold: true, color: "FFFFFF",
  });
  s.addText([
    { text: "리튬이온전지", options: { color: "8FC4EC", bold: true } },
    { text: "  vs  ", options: { color: C.faint } },
    { text: "전고체전지", options: { color: "F0B274", bold: true } },
  ], {
    x: 0.86, y: 3.02, w: 10.2, h: 0.62, isTextBox: true, margin: 0, fontFace: F, fontSize: 28,
  });
  s.addText("기술적 개념 · 성숙도 · 공통점과 차이점", {
    x: 0.9, y: 3.78, w: 9, h: 0.34, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 15, color: "B9C6D4",
  });
  s.addText("논문 · 특허 · 업체 발표 기반 조사분석   |   2026. 09. 18.", {
    x: 0.9, y: 5.95, w: 9, h: 0.32, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 11, color: C.faint,
  });
  s.addNotes("리튬이온전지와 전고체전지의 펄스 히팅은 이름은 같지만 목적·구동방식·주파수 대역·제약조건이 모두 다른 기술이다. 이 발표는 두 기술을 분리해 설명하고 성숙도 격차를 정량적으로 제시한다.");
}

// ============================================================ S2 핵심 요약
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "EXECUTIVE SUMMARY", "한 장 요약 — 같은 이름, 다른 기술", C.gold);

  const stats = [
    { v: "0.1 Hz ~ 1 kHz", l: "리튬이온 펄스 주파수 대역", c: C.lib },
    { v: "0.1 ~ 7 MHz", l: "전고체 UHFSH 주파수 대역", c: C.ssb },
    { v: "TRL 9  vs  TRL 3", l: "기술 성숙도 격차", c: C.gold },
  ];
  stats.forEach((t, i) => {
    const x = 0.6 + i * 4.09;
    card(s, { x, y: 1.72, w: 3.85, h: 1.28 });
    s.addText(t.v, { x: x + 0.25, y: 1.88, w: 3.4, h: 0.5, isTextBox: true, margin: 0, fontFace: F, fontSize: 22, bold: true, color: t.c });
    s.addText(t.l, { x: x + 0.25, y: 2.42, w: 3.4, h: 0.34, isTextBox: true, margin: 0, fontFace: F, fontSize: 11, color: C.mute });
  });

  const rows = [
    ["가열의 목적이 다르다", "리튬이온은 " + "영하에서 충전을 가능하게" + " 하려고 데운다. 전고체는 " + "상온에서도 쓸 수 없어서" + " 작동온도(60~80 °C)까지 데운다."],
    ["구동 방식이 다르다", "리튬이온은 전류 구동(P = I²·ReZ), 전고체는 전압 구동(P = V²·ReZ/|Z|²). 이 차이가 최적 주파수를 5~6 자릿수 갈라놓는다."],
    ["제약 조건이 다르다", "리튬이온의 벽은 리튬 석출(음극 전위). 전고체의 벽은 전해질 전압 안정 윈도우와 셀 인덕턴스다."],
    ["성숙도 격차가 크다", "리튬이온은 이미 양산(CATL 3세대 선싱, BYD). 전고체는 대칭셀 개념실증 단계이며 팩 성능은 전부 시뮬레이션 값이다."],
  ];
  rows.forEach((r, i) => {
    const y = 3.28 + i * 0.85;
    circleNum(s, 0.62, y + 0.06, 0.4, String(i + 1), i === 3 ? C.warn : C.ink);
    s.addText(r[0], { x: 1.18, y: y, w: 2.9, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 14, bold: true, color: C.text });
    s.addText(r[1], { x: 4.12, y: y - 0.02, w: 8.6, h: 0.66, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, color: C.mute });
  });
  foot(s, 2);
  s.addNotes("핵심은 '같은 펄스 히팅이라는 이름 아래 사실상 다른 기술'이라는 점. 목적·구동방식·제약·성숙도 네 축에서 모두 다르다.");
}

// ============================================================ S3 목차
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "CONTENTS", "목차", C.mute);
  const parts = [
    { n: "PART 1", t: "리튬이온전지 펄스 히팅", c: C.lib, cl: C.libL, items: ["저온 문제 정의와 발열 원리", "주파수 상충과 리튬 석출 제약", "회로 토폴로지 5종 · 성능 벤치마크", "특허 동향 · 업계 적용 · 성숙도"], p: "5 – 13" },
    { n: "PART 2", t: "전고체전지 펄스 히팅", c: C.ssb, cl: C.ssbL, items: ["상온에서도 가열이 필요한 이유", "UHFSH 개념 (Joule 2025, LBNL)", "주파수 비단조성과 최적점", "실측과 시뮬레이션의 구분 · 성숙도"], p: "15 – 20" },
    { n: "PART 3", t: "비교 분석 및 시사점", c: C.ink, cl: "E7EBF0", items: ["공통점 5가지", "차이점 종합 비교표", "차이의 물리적 근원", "성숙도 로드맵 · 제언"], p: "21 – 26" },
  ];
  parts.forEach((p, i) => {
    const x = 0.6 + i * 4.09;
    card(s, { x, y: 1.75, w: 3.85, h: 4.55, fill: C.paper });
    s.addShape(pres.ShapeType.roundRect, { x: x + 0.28, y: 2.02, w: 1.15, h: 0.34, rectRadius: 0.17, fill: { color: p.cl }, line: { color: p.cl } });
    s.addText(p.n, { x: x + 0.28, y: 2.03, w: 1.15, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 10, bold: true, color: p.c, align: "center" });
    s.addText(p.t, { x: x + 0.28, y: 2.55, w: 3.3, h: 0.78, isTextBox: true, margin: 0, fontFace: F, fontSize: 19, bold: true, color: C.text });
    s.addText(p.items.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k !== p.items.length - 1 } })), {
      x: x + 0.3, y: 3.45, w: 3.25, h: 2.0, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 11.5, color: C.mute, paraSpaceAfter: 9,
    });
    s.addText("p. " + p.p, { x: x + 0.28, y: 5.82, w: 3.3, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 10, bold: true, color: p.c });
  });
  foot(s, 3);
}

// ============================================================ S4 Part 1 divider
{
  const s = pres.addSlide(); darkBase(s);
  s.addShape(pres.ShapeType.ellipse, { x: 9.8, y: 0.9, w: 5.6, h: 5.6, fill: { color: C.libD, transparency: 60 }, line: { color: C.libD, transparency: 100 } });
  s.addText("PART 1", { x: 1.0, y: 2.55, w: 6, h: 0.36, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: "8FC4EC", charSpacing: 3 });
  s.addText("리튬이온전지 펄스 히팅", { x: 0.96, y: 2.98, w: 9.5, h: 0.9, isTextBox: true, margin: 0, fontFace: F, fontSize: 38, bold: true, color: "FFFFFF" });
  s.addText("영하 환경에서 충전을 가능하게 만드는 기술 — 이미 양산 단계", {
    x: 1.0, y: 4.0, w: 9, h: 0.36, isTextBox: true, margin: 0, fontFace: F, fontSize: 15, color: "B9C6D4",
  });
}

// ============================================================ S5 LIB 문제 정의
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 1 · 문제 정의", "저온에서 무엇이 막히는가", C.lib);

  card(s, { x: 0.6, y: 1.72, w: 6.35, h: 2.35, fill: C.libL, line: C.libL });
  s.addText("근본 원인 — 전하이동 저항의 비대칭적 증가", { x: 0.9, y: 1.95, w: 5.8, h: 0.34, isTextBox: true, margin: 0, fontFace: F, fontSize: 14, bold: true, color: C.libD });
  s.addText([
    { text: "R_ct ∝ exp(E_a / RT),   E_a ≈ 50 ~ 70 kJ/mol", options: { breakLine: true, bold: true, color: C.text } },
    { text: "−20 °C에서 전하이동 저항은 상온 대비 한 자릿수 이상 증가하는 반면, 1 kHz 옴 저항 증가는 2~3배에 그친다. 이 비대칭이 펄스 히팅 설계의 출발점이다.", options: { color: C.mute } },
  ], { x: 0.9, y: 2.38, w: 5.75, h: 1.5, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, lineSpacingMultiple: 1.25 });

  const items = [
    ["가용 용량 저하", "−20 °C에서 상온 대비 20~40 % 손실"],
    ["출력 제한", "내부저항 5~10배 증가 → 주행 성능 저하"],
    ["충전 금지 구간", "0~5 °C에서 0.1C 수준으로 제한, 0 °C 이하 사실상 충전 불가"],
    ["리튬 석출 위험", "저온 충전 시 음극 전위가 0 V(vs Li/Li⁺) 이하로 하강"],
  ];
  items.forEach((it, i) => {
    const x = 7.2 + (i % 2) * 2.85, y = 1.72 + Math.floor(i / 2) * 1.2;
    card(s, { x, y, w: 2.6, h: 1.05, fill: C.paper });
    s.addText(it[0], { x: x + 0.2, y: y + 0.14, w: 2.2, h: 0.28, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, bold: true, color: C.lib });
    s.addText(it[1], { x: x + 0.2, y: y + 0.44, w: 2.25, h: 0.55, isTextBox: true, margin: 0, fontFace: F, fontSize: 9.5, color: C.mute });
  });

  card(s, { x: 0.6, y: 4.32, w: 12.13, h: 2.0, fill: C.soft });
  s.addText("문제의 본질 — “충전 전에 얼마나 빨리 데울 수 있는가”", { x: 0.9, y: 4.52, w: 11.4, h: 0.34, isTextBox: true, margin: 0, fontFace: F, fontSize: 15, bold: true, color: C.text });
  s.addText("외부 가열(PTC·액랭·공랭)은 케이스 → 젤리롤로 열이 전도되어야 한다. 젤리롤 적층 방향 열전도도는 약 0.9 W/(m·K)로, 표면 온도가 목표에 도달해도 충전 가능 여부를 좌우하는 음극 계면은 여전히 차갑다. 펄스 히팅은 전극 계면 전체에서 동시에 발열하므로 이 지연을 우회한다.",
    { x: 0.9, y: 4.92, w: 11.4, h: 1.2, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, color: C.mute, lineSpacingMultiple: 1.3 });
  foot(s, 5, "출처: Int. J. Heat and Mass Transfer 135 (2019); BMS 저온 충전 제한 관행");
}

// ============================================================ S6 LIB 원리
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 1 · 원리", "전류 구동 줄열 — 리튬이온 펄스 히팅", C.lib);

  card(s, { x: 0.6, y: 1.72, w: 5.9, h: 2.5, fill: C.ink, line: C.ink });
  s.addText("발열량 지배식", { x: 0.9, y: 1.94, w: 5.3, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, bold: true, color: C.gold });
  s.addText("Q = Σ  I ²n,rms · Re{ Z ( n f₀ , T, SOC ) }", { x: 0.9, y: 2.34, w: 5.3, h: 0.48, isTextBox: true, margin: 0, fontFace: F, fontSize: 19, bold: true, color: "FFFFFF" });
  s.addText("전류 진폭이 지배 변수 — 발열은 I 의 제곱에 비례한다. 셀에 흘릴 수 있는 전류(C-rate)가 곧 승온율을 결정한다.",
    { x: 0.9, y: 2.96, w: 5.3, h: 0.75, isTextBox: true, margin: 0, fontFace: F, fontSize: 11.5, color: "B9C6D4", lineSpacingMultiple: 1.25 });

  card(s, { x: 6.83, y: 1.72, w: 5.9, h: 2.5, fill: C.soft });
  s.addText("단열 승온율", { x: 7.13, y: 1.94, w: 5.3, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, bold: true, color: C.lib });
  s.addText("dT/dt  =  I ²rms · Re{Z} / ( m · c_p )", { x: 7.13, y: 2.34, w: 5.3, h: 0.48, isTextBox: true, margin: 0, fontFace: F, fontSize: 19, bold: true, color: C.text });
  s.addText("Re{Z}는 온도가 오르면 감소 → 승온율이 스스로 체감한다. 폭주적 가열이 구조적으로 어려운 자기 안정화(self-limiting) 특성.",
    { x: 7.13, y: 2.96, w: 5.3, h: 0.75, isTextBox: true, margin: 0, fontFace: F, fontSize: 11.5, color: C.mute, lineSpacingMultiple: 1.25 });

  s.addText("수치 예제 — 50 Ah 각형 LFP 셀 (m = 1.4 kg, c_p = 1,100 J/kg·K)", {
    x: 0.62, y: 4.46, w: 8, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.text });
  const calc = [
    ["4C = 200 A", "인가 전류"],
    ["5 mΩ", "−20 °C Re{Z} @1 Hz (가정)"],
    ["200 W", "셀 발열량"],
    ["7.8 °C/min", "단열 승온율"],
    ["154 s", "−20 → 0 °C 소요"],
  ];
  calc.forEach((c, i) => {
    const x = 0.6 + i * 2.44;
    card(s, { x, y: 4.88, w: 2.24, h: 1.32, fill: i === 3 ? C.libL : C.paper, line: i === 3 ? C.lib : C.line });
    s.addText(c[0], { x: x + 0.14, y: 5.12, w: 1.96, h: 0.42, isTextBox: true, margin: 0, fontFace: F, fontSize: 17, bold: true, color: i === 3 ? C.libD : C.text, align: "center" });
    s.addText(c[1], { x: x + 0.12, y: 5.58, w: 2.0, h: 0.5, isTextBox: true, margin: 0, fontFace: F, fontSize: 9.5, color: C.mute, align: "center" });
  });
  foot(s, 6, "차수 추정(order-of-magnitude). 실제 설계는 대상 셀의 실측 EIS 데이터로 재수행 필요");
  s.addNotes("핵심 포인트: 리튬이온은 '전류원' 구동이다. 전류를 정해놓고 임피던스의 실수부에서 발열을 얻는다. 뒤에 나올 전고체의 전압 구동과 대비된다.");
}

// ============================================================ S7 LIB 주파수 상충 (chart)
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 1 · 설계 제약", "주파수 상충 — 발열량과 안전 마진은 반대로 움직인다", C.lib);

  s.addChart(pres.ChartType.line, [
    { name: "발열량 (Re Z, 상대값)", labels: ["0.01 Hz", "0.1 Hz", "1 Hz", "10 Hz", "100 Hz", "1 kHz", "10 kHz"], values: [100, 85, 60, 35, 20, 12, 10] },
    { name: "리튬 석출 위험도 (상대값)", labels: ["0.01 Hz", "0.1 Hz", "1 Hz", "10 Hz", "100 Hz", "1 kHz", "10 kHz"], values: [100, 92, 66, 34, 14, 5, 2] },
  ], {
    x: 0.6, y: 1.78, w: 7.0, h: 4.35,
    showTitle: true, title: "주파수에 따른 발열량과 석출 위험 (개념도)", titleFontSize: 12, titleColor: C.text, titleFontFace: F,
    chartColors: [C.lib, C.warn], lineSize: 3, lineSmooth: true,
    showLegend: true, legendPos: "b", legendFontSize: 10, legendFontFace: F, legendColor: C.mute,
    catAxisLabelColor: C.mute, catAxisLabelFontSize: 10, catAxisLabelFontFace: F,
    valAxisLabelColor: C.mute, valAxisLabelFontSize: 10, valAxisLabelFontFace: F,
    valGridLine: { color: "E8ECF1", size: 1 }, catGridLine: { style: "none" },
    valAxisMaxVal: 110, valAxisMinVal: 0,
  });

  const zones = [
    { t: "저주파  f < f_ct  (0.01 ~ 1 Hz)", d: "패러데이 반응이 실제로 진행 → 발열 크지만 석출 위험 최대. 반드시 양방향 펄스로 분극을 상쇄해야 한다.", c: C.warn },
    { t: "절충 대역  f ≈ f_ct  (1 ~ 100 Hz)", d: "대부분의 양방향 펄스(BPC) 연구가 위치하는 구간. 듀티비·진폭비로 마진을 확보한다.", c: C.gold },
    { t: "고주파  f ≫ f_ct  (100 Hz ~ kHz)", d: "전기이중층이 전류를 분류 → 석출 위험 낮음. 대신 Re{Z}가 작아 3~5C 대진폭이 필요하다.", c: C.lib },
  ];
  zones.forEach((z, i) => {
    const y = 1.86 + i * 1.5;
    card(s, { x: 7.85, y, w: 4.88, h: 1.3, fill: C.paper });
    s.addShape(pres.ShapeType.ellipse, { x: 8.08, y: y + 0.22, w: 0.16, h: 0.16, fill: { color: z.c }, line: { color: z.c } });
    s.addText(z.t, { x: 8.34, y: y + 0.14, w: 4.3, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 11.5, bold: true, color: C.text });
    s.addText(z.d, { x: 8.08, y: y + 0.5, w: 4.55, h: 0.72, isTextBox: true, margin: 0, fontFace: F, fontSize: 10, color: C.mute, lineSpacingMultiple: 1.2 });
  });
  s.addText("f_ct = 1 / (2π·R_ct·C_dl)  →  −20 °C에서 0.1 ~ 10 Hz 대역으로 하강", {
    x: 7.85, y: 6.26, w: 4.9, h: 0.5, isTextBox: true, margin: 0, fontFace: F, fontSize: 9.5, bold: true, color: C.libD });
  foot(s, 7, "개념도 — 실측 데이터가 아니며 셀 화학·온도·SOC에 따라 형상이 달라짐");
}

// ============================================================ S8 LIB 파형
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 1 · 파형", "파형 3종 — 단방향 · 양방향 · 교류", C.lib);
  const waves = [
    { n: "단방향 펄스", e: "Unidirectional", pro: ["구현이 가장 단순", "방전 펄스만 사용"], con: ["SOC 소모가 큼", "전압 하한 도달 빠름", "분극 누적 → 열화"], use: "보조적 용도" },
    { n: "양방향 펄스", e: "Bidirectional (BPC)", pro: ["순 전하이동 상쇄 → SOC 소모 최소", "가역열이 한 주기에 상쇄", "듀티비로 분극 균형 제어"], con: ["양방향 전력변환 필요"], use: "연구·양산 주류" },
    { n: "교류 (AC)", e: "Sinusoidal", pro: ["고조파 없음 → 발열 예측 정확", "고주파화 용이 → 석출 위험 ↓"], con: ["정현파 생성 부담", "대진폭 필요"], use: "고주파 전략" },
  ];
  waves.forEach((w, i) => {
    const x = 0.6 + i * 4.09;
    const on = i === 1;
    card(s, { x, y: 1.75, w: 3.85, h: 4.6, fill: on ? C.libL : C.paper, line: on ? C.lib : C.line });
    s.addText(w.n, { x: x + 0.28, y: 2.0, w: 3.3, h: 0.36, isTextBox: true, margin: 0, fontFace: F, fontSize: 18, bold: true, color: on ? C.libD : C.text });
    s.addText(w.e, { x: x + 0.28, y: 2.38, w: 3.3, h: 0.26, isTextBox: true, margin: 0, fontFace: F, fontSize: 10, color: C.faint, italic: true });
    s.addText("장점", { x: x + 0.28, y: 2.78, w: 3.3, h: 0.26, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, bold: true, color: C.ok });
    s.addText(w.pro.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k !== w.pro.length - 1 } })), {
      x: x + 0.3, y: 3.06, w: 3.26, h: 1.15, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, color: C.mute, paraSpaceAfter: 6 });
    s.addText("한계", { x: x + 0.28, y: 4.3, w: 3.3, h: 0.26, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, bold: true, color: C.warn });
    s.addText(w.con.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k !== w.con.length - 1 } })), {
      x: x + 0.3, y: 4.58, w: 3.26, h: 1.0, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, color: C.mute, paraSpaceAfter: 6 });
    s.addShape(pres.ShapeType.roundRect, { x: x + 0.28, y: 5.78, w: 3.3, h: 0.36, rectRadius: 0.18, fill: { color: on ? C.lib : "E7EBF0" }, line: { color: on ? C.lib : "E7EBF0" } });
    s.addText(w.use, { x: x + 0.28, y: 5.79, w: 3.3, h: 0.34, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, bold: true, color: on ? "FFFFFF" : C.mute, align: "center" });
  });
  foot(s, 8, "양방향 펄스는 가역열(엔트로피 항)이 한 주기 평균에서 상쇄되어, 비가역열만 누적시키는 효율적 발열 방식");
}

// ============================================================ S9 LIB 토폴로지
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 1 · 구현", "회로 토폴로지 5종", C.lib);
  const tp = [
    { k: "A", n: "외부 전원 기반", d: "충전기가 펄스 공급. 부품 추가·SOC 소모 없음. 단 커넥터 연결 시에만 사용 가능.", m: "성숙도 중" },
    { k: "B", n: "팩 분할 + DC/DC", d: "팩을 두 그룹으로 나눠 양방향 DC/DC로 에너지 왕복. 제어 자유도 최대, 고전류 DC/DC 비용 부담.", m: "성숙도 하" },
    { k: "C", n: "모터·인버터 재구성", d: "모터 중성점을 팩 중점에 연결, 권선을 인덕터로 활용. 추가 부품 사실상 없음. BYD 채택.", m: "양산 주류" },
    { k: "D", n: "스위치드 커패시터 / LC 공진", d: "공진 경로로 고주파 대전류 순환. 컴팩트하고 kHz 구현에 유리. 커패시터 정격이 제약.", m: "성숙도 하" },
    { k: "E", n: "셀 내장형 (참고)", d: "셀 내부 50 µm 니켈 포일 + 제3 단자. −20 °C → 0 °C 20초. 단 셀 구조 변경 필요.", m: "펄스 아님" },
  ];
  tp.forEach((t, i) => {
    const x = 0.6 + (i % 3) * 4.09, y = 1.78 + Math.floor(i / 3) * 2.28;
    const hi = t.k === "C";
    card(s, { x, y, w: 3.85, h: 2.06, fill: hi ? C.libL : C.paper, line: hi ? C.lib : C.line });
    circleNum(s, x + 0.26, y + 0.24, 0.44, t.k, hi ? C.lib : C.ink);
    s.addText(t.n, { x: x + 0.82, y: y + 0.28, w: 2.85, h: 0.34, isTextBox: true, margin: 0, fontFace: F, fontSize: 13.5, bold: true, color: hi ? C.libD : C.text });
    s.addText(t.d, { x: x + 0.28, y: y + 0.84, w: 3.3, h: 0.86, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, color: C.mute, lineSpacingMultiple: 1.2 });
    s.addText(t.m, { x: x + 0.28, y: y + 1.68, w: 3.3, h: 0.28, isTextBox: true, margin: 0, fontFace: F, fontSize: 10, bold: true, color: hi ? C.lib : C.faint });
  });
  card(s, { x: 8.78, y: 4.06, w: 3.85, h: 2.06, fill: C.ink, line: C.ink });
  s.addText("선정 권고", { x: 9.04, y: 4.3, w: 3.4, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.gold });
  s.addText([
    { text: "원가 민감 / 기존 플랫폼 → (C)", options: { breakLine: true, bullet: true } },
    { text: "고제어자유도 요구 → (B)", options: { breakLine: true, bullet: true } },
    { text: "소형 팩·ESS 모듈 → (D)", options: { bullet: true } },
  ], { x: 9.06, y: 4.7, w: 3.4, h: 1.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 11, color: "C6D2DE", paraSpaceAfter: 8 });
  foot(s, 9, "출처: Energy Reports (2020); J. Energy Storage (2021, 2023); CN116454472A; Sustainability (2026)");
}

// ============================================================ S10 LIB 벤치마크 (chart)
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 1 · 성능", "문헌 벤치마크 — 승온율 비교", C.lib);
  s.addChart(pres.ChartType.bar, [{
    name: "승온율 (°C/min)",
    labels: ["공랭 (외부)", "PTC 접촉 (외부)", "액랭+HV히터 (외부)", "양방향 펄스 −15 °C", "고주파 AC 833 Hz", "온도 적응형 자가발열", "고속 자가예열 시스템"],
    values: [0.4, 1.5, 4.5, 6.38, 4.1, 6.2, 17.14],
  }], {
    x: 0.6, y: 1.8, w: 7.5, h: 4.3, barDir: "bar",
    showTitle: false, chartColors: [C.lib],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 10, dataLabelFontFace: F, dataLabelColor: C.text,
    showLegend: false, barGapWidthPct: 45,
    catAxisLabelColor: C.text, catAxisLabelFontSize: 10.5, catAxisLabelFontFace: F,
    valAxisLabelColor: C.mute, valAxisLabelFontSize: 10, valAxisLabelFontFace: F,
    valGridLine: { color: "EAEEF3", size: 1 }, catGridLine: { style: "none" }, valAxisMaxVal: 20,
  });
  const notes = [
    { t: "3 ~ 7 °C/min", d: "팩 레벨에서 현실적인 설계 목표. 17 °C/min급은 소형 셀·고단열 조건의 값이다." },
    { t: "승온 효율 ≈ 30 %", d: "인출 에너지의 2/3 이상이 전력변환 손실·구조물 가열·방열로 소모된다. 팩 단열이 효율에 직결." },
    { t: "열화 데이터 부족", d: "대부분 30~90 사이클에서 “유의한 열화 없음”. 차량 수명(수백~수천 회 예열)을 커버하지 못한다." },
  ];
  notes.forEach((n, i) => {
    const y = 1.86 + i * 1.5;
    card(s, { x: 8.35, y, w: 4.38, h: 1.3, fill: i === 2 ? "FCEDEA" : C.soft, line: i === 2 ? "E7C3BC" : C.line });
    s.addText(n.t, { x: 8.6, y: y + 0.16, w: 3.9, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 14, bold: true, color: i === 2 ? C.warn : C.lib });
    s.addText(n.d, { x: 8.6, y: y + 0.52, w: 3.95, h: 0.7, isTextBox: true, margin: 0, fontFace: F, fontSize: 10, color: C.mute, lineSpacingMultiple: 1.2 });
  });
  foot(s, 10, "시험 조건(셀 화학·용량·단열·초기 SOC)이 문헌마다 달라 직접 비교는 불가 — 달성 범위의 참고치");
}

// ============================================================ S11 LIB 특허
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 1 · 지식재산", "특허 동향 — BYD가 15년 앞서 자리를 잡았다", C.lib);
  const tl = [
    { y: "2010", t: "BYD, 배터리 가열 회로 특허 출원", d: "US9065293B2 (우선일 2010-12-23) — 변압기를 에너지 저장체로 쓰는 충·방전 교번 가열 회로. 관련 패밀리 다수(US20130134146A1, EP2469683A1)." },
    { y: "2016", t: "셀 내장형 자가발열 상용 연구", d: "Penn State ACB — 니켈 포일 구조 (Nature, 2016). 펄스가 아닌 저항 발열이나 “내부 가열” 개념의 기준점." },
    { y: "2020~22", t: "구동계 재활용 토폴로지 확산", d: "US11290045 — 모터에 토크 ≈ 0을 유지하며 펄스 전류를 인가해 자가발열. 인버터·권선 재구성 계열이 급증." },
    { y: "2023~26", t: "제어·안전 로직으로 경쟁 이동", d: "CN116454472A — 전기구동 인버터 재구성 + LC 공진, 2단 열폭주 보호 로직 포함. CATL 계열 가열 회로·BMS 특허 다수 등재." },
  ];
  tl.forEach((e, i) => {
    const x = 0.6 + i * 3.11;
    s.addShape(pres.ShapeType.roundRect, { x, y: 1.85, w: 2.86, h: 0.42, rectRadius: 0.2, fill: { color: i === 3 ? C.lib : C.ink }, line: { color: i === 3 ? C.lib : C.ink } });
    s.addText(e.y, { x, y: 1.87, w: 2.86, h: 0.38, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: "FFFFFF", align: "center" });
    card(s, { x, y: 2.46, w: 2.86, h: 2.5, fill: C.paper });
    s.addText(e.t, { x: x + 0.22, y: 2.68, w: 2.42, h: 0.62, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, bold: true, color: C.text });
    s.addText(e.d, { x: x + 0.22, y: 3.36, w: 2.45, h: 1.5, isTextBox: true, margin: 0, fontFace: F, fontSize: 9.5, color: C.mute, lineSpacingMultiple: 1.2 });
  });
  card(s, { x: 0.6, y: 5.2, w: 12.13, h: 1.15, fill: C.libL, line: C.lib });
  s.addText("실무 시사점", { x: 0.9, y: 5.38, w: 2.2, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 12.5, bold: true, color: C.libD });
  s.addText("모터·인버터 재구성 계열은 BYD·CATL 특허가 밀집한 영역이다. 개발 착수 전 FTO(Freedom-to-Operate) 조사가 선행되어야 하며, 회피 설계 여지는 회로 구성보다 제어·보호 로직 쪽에 남아 있을 가능성이 높다.",
    { x: 3.0, y: 5.36, w: 9.5, h: 0.78, isTextBox: true, margin: 0, fontFace: F, fontSize: 11, color: C.text, lineSpacingMultiple: 1.25 });
  foot(s, 11, "출처: Google Patents / USPTO 공개공보 — 본 조사는 개괄이며 정식 FTO 조사를 대체하지 않음");
}

// ============================================================ S12 LIB 업계
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 1 · 업계 적용", "양산 적용 현황", C.lib);
  const co = [
    { n: "CATL", s: "3세대 선싱 LFP (2026.04 Tech Day)", b: ["−30 °C에서 9분 내 98 % 충전", "펄스 자가발열 + 셀 내부저항 0.25 mΩ", "1,000 급속충전 사이클 후 SOH 90 %+"], i: "셀 저항을 낮춰 필요 승온폭 자체를 줄이고, 남은 격차만 펄스로 메우는 통합 설계", c: C.lib },
    { n: "BYD", s: "구동계 기반 고주파 펄스 승온", b: ["모터·인버터를 펄스 발생기로 재활용", "별도 히터 없이 저원가 구현", "2010년부터 축적된 가열 회로 특허군"], i: "부품 추가 최소화 전략. NVH·EMI를 제어로 해결한 것이 진입장벽", c: C.lib },
    { n: "현대차그룹", s: "배터리 컨디셔닝 모드", b: ["내비 목적지 연동 사전 예열", "별도 배터리 히터로 냉각수 가열", "전기적 자가발열 미적용"], i: "예측 제어 소프트웨어 역량은 확보. 가열 하드웨어는 외부 가열 방식에 머물러 있음", c: C.warn },
  ];
  co.forEach((x0, i) => {
    const x = 0.6 + i * 4.09;
    card(s, { x, y: 1.75, w: 3.85, h: 4.6, fill: C.paper });
    s.addText(x0.n, { x: x + 0.28, y: 2.0, w: 3.3, h: 0.42, isTextBox: true, margin: 0, fontFace: F, fontSize: 21, bold: true, color: x0.c });
    s.addText(x0.s, { x: x + 0.28, y: 2.46, w: 3.3, h: 0.5, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, color: C.mute });
    s.addText(x0.b.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k !== x0.b.length - 1 } })), {
      x: x + 0.3, y: 3.1, w: 3.26, h: 1.55, isTextBox: true, margin: 0, fontFace: F, fontSize: 11, color: C.text, paraSpaceAfter: 8 });
    s.addShape(pres.ShapeType.roundRect, { x: x + 0.28, y: 4.78, w: 3.3, h: 1.34, rectRadius: 0.06, fill: { color: C.soft }, line: { color: C.line, width: 0.75 } });
    s.addText("해석", { x: x + 0.46, y: 4.9, w: 2.9, h: 0.26, isTextBox: true, margin: 0, fontFace: F, fontSize: 9.5, bold: true, color: C.faint });
    s.addText(x0.i, { x: x + 0.46, y: 5.16, w: 2.95, h: 0.9, isTextBox: true, margin: 0, fontFace: F, fontSize: 10, color: C.mute, lineSpacingMultiple: 1.2 });
  });
  foot(s, 12, "출처: CarNewsChina·Electrek (2026.04); BYD 특허군 및 기술 해설; 현대자동차그룹 공식 기술 자료");
}

// ============================================================ S13 LIB 성숙도
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 1 · 성숙도", "리튬이온 펄스 히팅 — TRL 9", C.lib);
  card(s, { x: 0.6, y: 1.8, w: 7.3, h: 2.5, fill: C.libL, line: C.lib });
  s.addText("TRL 9", { x: 0.95, y: 2.02, w: 2.4, h: 0.6, isTextBox: true, margin: 0, fontFace: F, fontSize: 34, bold: true, color: C.libD });
  s.addText("실제 운용 환경에서 검증된 시스템 — 양산 적용", { x: 3.2, y: 2.22, w: 4.5, h: 0.4, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.libD });
  trlGauge(s, 0.95, 2.86, 9, C.lib, 6.6);
  s.addText("2010년 특허 출원 → 2026년 −30 °C 9분 충전 양산 제품까지 15년이 소요되었다.", {
    x: 0.95, y: 3.6, w: 6.6, h: 0.5, isTextBox: true, margin: 0, fontFace: F, fontSize: 11, color: C.mute });

  const ev = [
    ["양산 제품", "CATL 3세대 선싱, BYD 구동계 승온"],
    ["특허 성숙", "BYD 2010년 우선일, 패밀리 다수 등록"],
    ["문헌 축적", "2019년 이후 실험·모델링 논문 다수, 재현성 확보"],
    ["표준 공백", "펄스 자가발열을 직접 규정하는 표준은 아직 없음"],
  ];
  ev.forEach((e, i) => {
    const y = 1.8 + i * 1.17;
    card(s, { x: 8.15, y, w: 4.58, h: 1.0, fill: i === 3 ? "FCEDEA" : C.paper, line: i === 3 ? "E7C3BC" : C.line });
    s.addText(e[0], { x: 8.42, y: y + 0.14, w: 4.1, h: 0.28, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, bold: true, color: i === 3 ? C.warn : C.text });
    s.addText(e[1], { x: 8.42, y: y + 0.44, w: 4.1, h: 0.46, isTextBox: true, margin: 0, fontFace: F, fontSize: 10, color: C.mute });
  });

  card(s, { x: 0.6, y: 4.52, w: 7.3, h: 1.82, fill: C.paper });
  s.addText("남은 과제 — 양산 기술이지만 완결되지 않았다", { x: 0.9, y: 4.72, w: 6.7, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.text });
  s.addText([
    { text: "장기 열화 검증 — 문헌은 30~90 사이클, 차량 수명 등가 데이터 부재", options: { bullet: true, breakLine: true } },
    { text: "팩 스케일 불균일 — 셀 간 임피던스 편차가 온도 편차로 증폭", options: { bullet: true, breakLine: true } },
    { text: "NVH·EMI — 모터·인버터 재구성 방식의 실용상 최대 장벽", options: { bullet: true } },
  ], { x: 0.92, y: 5.1, w: 6.7, h: 1.1, isTextBox: true, margin: 0, fontFace: F, fontSize: 11, color: C.mute, paraSpaceAfter: 7 });
  foot(s, 13);
}

// ============================================================ S14 Part 2 divider
{
  const s = pres.addSlide(); darkBase(s);
  s.addShape(pres.ShapeType.ellipse, { x: 9.8, y: 0.9, w: 5.6, h: 5.6, fill: { color: C.ssbD, transparency: 58 }, line: { color: C.ssbD, transparency: 100 } });
  s.addText("PART 2", { x: 1.0, y: 2.55, w: 6, h: 0.36, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: "F0B274", charSpacing: 3 });
  s.addText("전고체전지 펄스 히팅", { x: 0.96, y: 2.98, w: 9.5, h: 0.9, isTextBox: true, margin: 0, fontFace: F, fontSize: 38, bold: true, color: "FFFFFF" });
  s.addText("상온에서도 쓸 수 없는 전지를 작동온도까지 끌어올리는 기술 — 개념 실증 단계", {
    x: 1.0, y: 4.0, w: 10, h: 0.36, isTextBox: true, margin: 0, fontFace: F, fontSize: 15, color: "B9C6D4" });
}

// ============================================================ S15 SSB 문제 정의
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 2 · 문제 정의", "전고체는 왜 상온에서도 가열이 필요한가", C.ssb);

  card(s, { x: 0.6, y: 1.72, w: 6.0, h: 1.6, fill: C.ssbL, line: C.ssbL });
  s.addText("문제의 층위가 다르다", { x: 0.88, y: 1.92, w: 5.5, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.ssbD });
  s.addText("리튬이온은 영하에서만 문제가 된다. 전고체는 상온(25 °C)에서 이미 이온 수송이 느려 방전 에너지밀도가 크게 떨어지고, 차량 시동조차 어려울 수 있다.",
    { x: 0.88, y: 2.3, w: 5.5, h: 0.9, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, color: C.text, lineSpacingMultiple: 1.3 });

  const rows = [
    ["황화물계 (Li₆PS₅Cl 등)", "~10⁻² S/cm", "상온 구동 가능 — 가열 의존도 낮음", C.ok],
    ["산화물계 (LLZO, LATP)", "10⁻⁴ ~ 10⁻³ S/cm", "황화물 대비 1~2 자릿수 낮음", C.gold],
    ["산화물계 (LAGP)", "~10⁻⁴ S/cm", "UHFSH 실증에 사용된 전해질", C.ssb],
    ["고분자계 (PEO 등)", "상온에서 매우 낮음", "50~80 °C 유지가 사실상 전제", C.warn],
  ];
  s.addText("상온 이온전도도 — 전해질 계열별", { x: 6.85, y: 1.76, w: 5.9, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.text });
  rows.forEach((r, i) => {
    const y = 2.14 + i * 0.85;
    card(s, { x: 6.85, y, w: 5.88, h: 0.74, fill: C.paper });
    s.addShape(pres.ShapeType.ellipse, { x: 7.06, y: y + 0.3, w: 0.15, h: 0.15, fill: { color: r[3] }, line: { color: r[3] } });
    s.addText(r[0], { x: 7.3, y: y + 0.09, w: 2.6, h: 0.28, isTextBox: true, margin: 0, fontFace: F, fontSize: 11.5, bold: true, color: C.text });
    s.addText(r[1], { x: 7.3, y: y + 0.38, w: 2.6, h: 0.26, isTextBox: true, margin: 0, fontFace: F, fontSize: 10, color: r[3], bold: true });
    s.addText(r[2], { x: 10.0, y: y + 0.22, w: 2.6, h: 0.4, isTextBox: true, margin: 0, fontFace: F, fontSize: 10, color: C.mute });
  });

  card(s, { x: 0.6, y: 3.52, w: 6.0, h: 2.8, fill: C.soft });
  s.addText("온도를 50 °C 올렸을 때의 효과", { x: 0.88, y: 3.72, w: 5.5, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.text });
  const gains = [
    ["고분자 전해질 이온전도도", "1 ~ 2 자릿수 상승"],
    ["LLZO · LAGP 이온전도도", "약 5배 상승 → 액체 전해질 상온 수준"],
    ["전극/전해질 계면 저항", "약 1 자릿수 감소"],
    ["방전 에너지밀도 (25 °C 기준)", "2배 이상 확보"],
  ];
  gains.forEach((g, i) => {
    const y = 4.14 + i * 0.52;
    s.addText(g[0], { x: 0.9, y, w: 3.2, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 11, color: C.mute });
    s.addText(g[1], { x: 4.05, y, w: 2.45, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 11, bold: true, color: i === 3 ? C.ssb : C.text, align: "right" });
  });
  foot(s, 15, "출처: Zhang et al., Joule 9(7), 2025; PatSnap 전해질 비교 (2026); ACS Nano (2023)");
}

// ============================================================ S16 SSB 상용 사례
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 2 · 현실 확인", "이미 상용 전고체는 “가열을 전제”로 운용된다", C.ssb);
  card(s, { x: 0.6, y: 1.78, w: 6.5, h: 4.5, fill: C.ink, line: C.ink });
  s.addText("Blue Solutions (Bolloré) LMP®", { x: 0.95, y: 2.05, w: 5.8, h: 0.42, isTextBox: true, margin: 0, fontFace: F, fontSize: 21, bold: true, color: "FFFFFF" });
  s.addText("리튬 메탈 폴리머 전고체 — Bluebus, Mercedes eCitaro 등 상용 버스에 실제 운용 중", {
    x: 0.95, y: 2.52, w: 5.8, h: 0.5, isTextBox: true, margin: 0, fontFace: F, fontSize: 11.5, color: "B9C6D4" });
  s.addText("50 ~ 80 °C", { x: 0.95, y: 3.16, w: 5.8, h: 0.75, isTextBox: true, margin: 0, fontFace: F, fontSize: 40, bold: true, color: C.gold });
  s.addText("내부 작동 온도 — 외부 기온과 무관하게 유지", { x: 0.95, y: 3.92, w: 5.8, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, color: "C6D2DE" });
  s.addText([
    { text: "저온에서 미충전 방치 시, 사용 전 내부 작동온도 도달까지 대기 필요", options: { bullet: true, breakLine: true } },
    { text: "외부에 부착된 가열 소자로 승온 — 즉 “외부 가열” 방식", options: { bullet: true, breakLine: true } },
    { text: "−20 ~ +60 °C 외기에서 별도 공조 없이 운용 가능", options: { bullet: true } },
  ], { x: 0.97, y: 4.42, w: 5.75, h: 1.6, isTextBox: true, margin: 0, fontFace: F, fontSize: 11, color: "C6D2DE", paraSpaceAfter: 9 });

  card(s, { x: 7.35, y: 1.78, w: 5.38, h: 2.1, fill: C.ssbL, line: C.ssb });
  s.addText("이것이 의미하는 것", { x: 7.62, y: 1.98, w: 4.85, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.ssbD });
  s.addText("전고체에서 “가열”은 저온 대응 옵션이 아니라 상시 운용 조건이다. 따라서 가열 수단의 효율·속도·에너지 소모가 리튬이온보다 훨씬 직접적으로 시스템 성능을 좌우한다.",
    { x: 7.62, y: 2.38, w: 4.85, h: 1.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 11.5, color: C.text, lineSpacingMultiple: 1.3 });

  card(s, { x: 7.35, y: 4.1, w: 5.38, h: 2.18, fill: C.paper });
  s.addText("그런데 외부 가열은 전고체에 부적합하다", { x: 7.62, y: 4.3, w: 4.85, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 12.5, bold: true, color: C.text });
  s.addText([
    { text: "팩 열질량이 커서 승온 램프율이 매우 느림", options: { bullet: true, breakLine: true } },
    { text: "대류 가열 시스템 자체의 부피·중량 부담", options: { bullet: true, breakLine: true } },
    { text: "셀 내장 히터(니켈 포일)는 침습적 — 제조 공정 변경과 안전성 부담", options: { bullet: true } },
  ], { x: 7.64, y: 4.7, w: 4.82, h: 1.45, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, color: C.mute, paraSpaceAfter: 8 });
  foot(s, 16, "출처: BlueSolutions / BlueBus 공식 사양; electrive (2021); Joule 9(7), 2025 서론");
}

// ============================================================ S17 SSB UHFSH 개념
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 2 · 핵심 개념", "UHFSH — 초고주파 자가발열 (Joule 2025, LBNL)", C.ssb);

  card(s, { x: 0.6, y: 1.72, w: 5.9, h: 2.5, fill: C.ink, line: C.ink });
  s.addText("발열량 지배식 — 전압 구동", { x: 0.9, y: 1.94, w: 5.3, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, bold: true, color: C.gold });
  s.addText("P = V ²  ·  Z_Re / | Z | ²", { x: 0.9, y: 2.34, w: 5.3, h: 0.48, isTextBox: true, margin: 0, fontFace: F, fontSize: 21, bold: true, color: "FFFFFF" });
  s.addText("정전압 여기이므로 발열은 어드미턴스 실수부에 비례한다. |Z|가 작아지면 오히려 발열이 커진다 — 리튬이온과 정반대의 주파수 선호가 생기는 이유.",
    { x: 0.9, y: 2.96, w: 5.3, h: 0.9, isTextBox: true, margin: 0, fontFace: F, fontSize: 11.5, color: "B9C6D4", lineSpacingMultiple: 1.25 });

  card(s, { x: 6.83, y: 1.72, w: 5.9, h: 2.5, fill: C.ssbL, line: C.ssbL });
  s.addText("메커니즘 — 반응 전류의 우회", { x: 7.13, y: 1.94, w: 5.3, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, bold: true, color: C.ssbD });
  s.addText("i  =  i_rxn  +  i_inf", { x: 7.13, y: 2.34, w: 5.3, h: 0.48, isTextBox: true, margin: 0, fontFace: F, fontSize: 21, bold: true, color: C.text });
  s.addText("주파수가 올라가면 계면 전기이중층(커패시터)으로 흐르는 전류 i_inf 가 커지고 반응 전류 i_rxn 는 줄어든다. 즉 전지에 화학적 변화를 거의 주지 않으면서 발열만 얻는다.",
    { x: 7.13, y: 2.96, w: 5.3, h: 0.9, isTextBox: true, margin: 0, fontFace: F, fontSize: 11.5, color: C.mute, lineSpacingMultiple: 1.25 });

  s.addText("전고체가 가열에 유리한 구조적 이유", { x: 0.62, y: 4.44, w: 8, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.text });
  const adv = [
    { v: "15 ~ 20 %", l: "Wh당 열질량이 리튬이온보다 작다" },
    { v: "1.4 / 2.2", l: "LLZTO / LAGP 열전도도 (W/m·K)" },
    { v: "0.2", l: "액체 전해질 열전도도 (W/m·K)" },
    { v: "~100 °C", l: "전고체의 안정 사이클 상한 (LIB는 ~60 °C)" },
  ];
  adv.forEach((a, i) => {
    const x = 0.6 + i * 3.06;
    card(s, { x, y: 4.86, w: 2.86, h: 1.35, fill: i === 2 ? C.soft : C.paper });
    s.addText(a.v, { x: x + 0.16, y: 5.08, w: 2.54, h: 0.44, isTextBox: true, margin: 0, fontFace: F, fontSize: 19, bold: true, color: i === 2 ? C.mute : C.ssb, align: "center" });
    s.addText(a.l, { x: x + 0.14, y: 5.56, w: 2.6, h: 0.56, isTextBox: true, margin: 0, fontFace: F, fontSize: 9.5, color: C.mute, align: "center" });
  });
  foot(s, 17, "출처: B. Zhang, D. Chalise, Y. Zeng, S. Kaur, C. Dames, R. S. Prasher, “Solid-state batteries enabled by ultra-high-frequency self-heating,” Joule 9(7), 2025");
  s.addNotes("이 슬라이드가 발표의 기술적 핵심. 리튬이온은 전류를 정하고 Re(Z)에서 발열을 얻는다. 전고체 UHFSH는 전압을 정하고 어드미턴스 실수부에서 발열을 얻는다. 수식의 형태가 다르기 때문에 최적 주파수가 반대 방향으로 간다.");
}

// ============================================================ S18 SSB 주파수 (chart)
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 2 · 설계 제약", "왜 MHz인가 — 발열량이 비단조 곡선을 그린다", C.ssb);
  s.addChart(pres.ChartType.line, [{
    name: "단위 전극 면적당 발열량 (상대값)",
    labels: ["10 Hz", "1 kHz", "10 kHz", "0.1 MHz", "0.2 MHz", "1 MHz", "7 MHz"],
    values: [3, 10, 45, 92, 100, 70, 30],
  }], {
    x: 0.6, y: 1.8, w: 7.0, h: 4.3,
    showTitle: true, title: "주파수에 따른 발열 파워 (개념도)", titleFontSize: 12, titleColor: C.text, titleFontFace: F,
    chartColors: [C.ssb], lineSize: 3.5, lineSmooth: true,
    showLegend: false,
    catAxisLabelColor: C.mute, catAxisLabelFontSize: 10, catAxisLabelFontFace: F,
    valAxisLabelColor: C.mute, valAxisLabelFontSize: 10, valAxisLabelFontFace: F,
    valGridLine: { color: "EAEEF3", size: 1 }, catGridLine: { style: "none" },
    valAxisMaxVal: 110, valAxisMinVal: 0,
  });
  const z = [
    { n: "1", t: "저주파 구간 — 발열 부족", d: "계면·전하수송 임피던스가 지배해 |Z|가 크다. 전압 구동에서는 전류 자체가 흐르지 못해 발열이 작다.", c: C.faint },
    { n: "2", t: "최적 구간 — 이중층이 저항을 단락", d: "전기이중층이 전하이동 저항을 우회시켜 |Z|의 실수·허수부가 모두 감소 → 발열 급증. 팩 조건 최적점 약 0.2 MHz.", c: C.ssb },
    { n: "3", t: "초고주파 구간 — 인덕턴스 지배", d: "다층 구조의 인덕턴스가 커지며 |Z|가 다시 상승 → 발열 감소. 대용량 셀일수록 이 한계가 빨리 온다.", c: C.warn },
  ];
  z.forEach((e, i) => {
    const y = 1.86 + i * 1.5;
    card(s, { x: 7.85, y, w: 4.88, h: 1.3, fill: i === 1 ? C.ssbL : C.paper, line: i === 1 ? C.ssb : C.line });
    circleNum(s, 8.08, y + 0.16, 0.34, e.n, e.c);
    s.addText(e.t, { x: 8.52, y: y + 0.18, w: 4.05, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 11.5, bold: true, color: C.text });
    s.addText(e.d, { x: 8.08, y: y + 0.54, w: 4.55, h: 0.7, isTextBox: true, margin: 0, fontFace: F, fontSize: 10, color: C.mute, lineSpacingMultiple: 1.18 });
  });
  s.addText("추가 제약: 전해질 전압 안정 윈도우 (LCO|Li 기준 4.35 ~ 2.35 V) → 여기 진폭 ±1 V로 제한", {
    x: 7.85, y: 6.42, w: 4.9, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 10, bold: true, color: C.ssbD });
  foot(s, 18, "개념도 — Joule 9(7), 2025 Fig. 4b의 정성적 거동을 재현한 것이며 실측 수치 곡선이 아님");
}

// ============================================================ S19 SSB 실측 vs 시뮬
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 2 · 근거의 층위", "실측과 시뮬레이션을 반드시 구분해야 한다", C.ssb);

  card(s, { x: 0.6, y: 1.75, w: 5.95, h: 4.55, fill: C.paper, line: C.ok });
  s.addShape(pres.ShapeType.roundRect, { x: 0.88, y: 1.98, w: 1.5, h: 0.34, rectRadius: 0.17, fill: { color: "E3F1EA" }, line: { color: "E3F1EA" } });
  s.addText("실측 (측정)", { x: 0.88, y: 1.99, w: 1.5, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, bold: true, color: C.ok, align: "center" });
  s.addText("대칭 LAGP 셀 수준에서만 확인됨", { x: 0.88, y: 2.48, w: 5.4, h: 0.36, isTextBox: true, margin: 0, fontFace: F, fontSize: 15, bold: true, color: C.text });
  const meas = [
    ["셀 구성", "LAGP 350 µm + Li 100 µm 양측, 12 mm 직경, 23.3 mAh"],
    ["여기 조건", "±2 V 정현파, 0.5 ~ 7 MHz 스윕, 에어로젤 단열, 350 kPa 가압"],
    ["단층 셀 결과", "2분간 ΔT = 0.45 → 0.8 °C (주파수 상승에 따라)"],
    ["2층 적층 셀", "2분간 최대 ΔT ≈ 1 °C"],
    ["검증", "COMSOL 전기-열 연성 모델과 잘 일치 (h만 피팅)"],
  ];
  meas.forEach((m, i) => {
    const y = 2.98 + i * 0.66;
    s.addText(m[0], { x: 0.9, y, w: 1.5, h: 0.5, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, bold: true, color: C.ok });
    s.addText(m[1], { x: 2.48, y, w: 3.85, h: 0.6, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, color: C.mute, lineSpacingMultiple: 1.15 });
  });

  card(s, { x: 6.78, y: 1.75, w: 5.95, h: 4.55, fill: C.paper, line: C.gold });
  s.addShape(pres.ShapeType.roundRect, { x: 7.06, y: 1.98, w: 1.8, h: 0.34, rectRadius: 0.17, fill: { color: "FBF0D8" }, line: { color: "FBF0D8" } });
  s.addText("시뮬레이션 (예측)", { x: 7.06, y: 1.99, w: 1.8, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, bold: true, color: "9A7113", align: "center" });
  s.addText("발표에 인용되는 수치는 대부분 여기에 속한다", { x: 7.06, y: 2.48, w: 5.4, h: 0.36, isTextBox: true, margin: 0, fontFace: F, fontSize: 15, bold: true, color: C.text });
  const sim = [
    ["승온율", "50 K/min (약 1 °C/s) — 리튬이온 AC 가열의 약 10배"],
    ["팩 승온", "62 kWh 팩, 25 µm 전해질 기준 1분 내 70 °C 이상"],
    ["에너지 소모", "104 kWh 팩 ΔT 40 °C 기준 전체 에너지의 3.4 %"],
    ["최적 주파수", "±1 V 구형파, 0.2 MHz (400 µm 전해질 모델)"],
    ["성능 이득", "25 °C 외기에서 방전 에너지 2배 이상"],
  ];
  sim.forEach((m, i) => {
    const y = 2.98 + i * 0.66;
    s.addText(m[0], { x: 7.08, y, w: 1.5, h: 0.5, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, bold: true, color: "9A7113" });
    s.addText(m[1], { x: 8.66, y, w: 3.85, h: 0.6, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, color: C.mute, lineSpacingMultiple: 1.15 });
  });
  foot(s, 19, "출처: Joule 9(7), 2025 — 실험은 대칭셀(전극 반응 없음) 기준이며, 실제 full-cell·팩 검증은 아직 보고되지 않음");
  s.addNotes("발표에서 가장 조심해야 할 슬라이드. '50 K/min, 1분 내 70도'는 모두 시뮬레이션 값이다. 실제 측정된 온도 상승은 2분에 약 1도 수준이다. 이 구분을 흐리면 기술 성숙도를 크게 과대평가하게 된다.");
}

// ============================================================ S20 SSB 성숙도
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 2 · 성숙도", "전고체 펄스 히팅 — TRL 3", C.ssb);
  card(s, { x: 0.6, y: 1.8, w: 7.3, h: 2.5, fill: C.ssbL, line: C.ssb });
  s.addText("TRL 3", { x: 0.95, y: 2.02, w: 2.4, h: 0.6, isTextBox: true, margin: 0, fontFace: F, fontSize: 34, bold: true, color: C.ssbD });
  s.addText("개념 실증 — 핵심 기능이 실험실에서 확인된 단계", { x: 3.2, y: 2.22, w: 4.5, h: 0.4, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.ssbD });
  trlGauge(s, 0.95, 2.86, 3, C.ssb, 6.6);
  s.addText("2024년 프리프린트 → 2025년 Joule 게재. 단일 연구그룹(UC Berkeley·LBNL)의 성과가 사실상 전부다.", {
    x: 0.95, y: 3.6, w: 6.6, h: 0.5, isTextBox: true, margin: 0, fontFace: F, fontSize: 11, color: C.mute });

  const gaps = [
    ["Full-cell 미검증", "실험은 대칭 Li|LAGP|Li 셀 — 실제 양극이 있는 전지에서는 미확인"],
    ["팩 성능 = 시뮬레이션", "50 K/min, 3.4 % 에너지 소모는 모두 모델 예측값"],
    ["MHz급 전력 H/W 부재", "수백 V·수백 A를 0.2 MHz로 구동하는 차량용 전력변환 장치가 존재하지 않음"],
    ["열화·수명 데이터 없음", "반복 UHF 여기가 계면·입계에 미치는 영향 미평가"],
  ];
  gaps.forEach((g, i) => {
    const y = 1.8 + i * 1.17;
    card(s, { x: 8.15, y, w: 4.58, h: 1.0, fill: i === 2 ? "FCEDEA" : C.paper, line: i === 2 ? "E7C3BC" : C.line });
    s.addText(g[0], { x: 8.42, y: y + 0.12, w: 4.1, h: 0.28, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, bold: true, color: i === 2 ? C.warn : C.text });
    s.addText(g[1], { x: 8.42, y: y + 0.42, w: 4.12, h: 0.5, isTextBox: true, margin: 0, fontFace: F, fontSize: 9.5, color: C.mute, lineSpacingMultiple: 1.15 });
  });

  card(s, { x: 0.6, y: 4.52, w: 7.3, h: 1.82, fill: C.paper });
  s.addText("그럼에도 주목해야 하는 이유", { x: 0.9, y: 4.72, w: 6.7, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.text });
  s.addText([
    { text: "비침습 — 셀 재료·구조 변경 없이 적용 가능 (기존 제조 공정 유지)", options: { bullet: true, breakLine: true } },
    { text: "전고체 상용화의 필수 조건인 “상온 시동” 문제를 직접 겨냥", options: { bullet: true, breakLine: true } },
    { text: "전고체 양산 시점(2027~2030)과 개발 리드타임이 맞물린다", options: { bullet: true } },
  ], { x: 0.92, y: 5.1, w: 6.7, h: 1.1, isTextBox: true, margin: 0, fontFace: F, fontSize: 11, color: C.mute, paraSpaceAfter: 7 });
  foot(s, 20, "TRL 판정은 공개 문헌 근거에 기반한 본 조사의 평가임");
}

// ============================================================ S21 공통점
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 3 · 비교 분석", "공통점 — 같은 물리, 같은 설계 철학", C.ink);
  const com = [
    { n: "01", t: "내부 임피던스 줄열이라는 동일 원리", d: "전지 자체를 저항체로 삼아 내부에서 발열시킨다. 외부 열원에서 케이스를 거쳐 전달하는 경로가 없다." },
    { n: "02", t: "비침습(non-intrusive) 전략", d: "셀의 재료·구조를 바꾸지 않는다. 니켈 포일 내장형과 달리 기존 제조 공정과 공급망을 그대로 쓴다." },
    { n: "03", t: "교번 여기로 순 전하이동 억제", d: "충·방전을 교번시켜 순 SOC 변화를 최소화한다. 손실분만 열로 남기는 것이 두 기술의 공통 설계 의도다." },
    { n: "04", t: "EIS가 설계의 출발점", d: "온도·SOC별 임피던스 스펙트럼에서 발열량을 계산하고 최적 주파수를 도출한다. 전기-열 연성 모델로 검증한다." },
    { n: "05", t: "전압 한계가 최종 제약", d: "형태는 다르지만 둘 다 “셀에 걸리는 전압을 넘기지 않는 범위”가 진폭의 상한을 결정한다." },
    { n: "06", t: "에너지 소모는 수 % 수준", d: "리튬이온 3~10 %, 전고체 3.4 % (예측). 외부 가열 대비 시스템 효율에서 유리하다." },
  ];
  com.forEach((c, i) => {
    const x = 0.6 + (i % 3) * 4.09, y = 1.8 + Math.floor(i / 3) * 2.3;
    card(s, { x, y, w: 3.85, h: 2.08, fill: C.paper });
    s.addText(c.n, { x: x + 0.28, y: y + 0.2, w: 1.0, h: 0.34, isTextBox: true, margin: 0, fontFace: F, fontSize: 15, bold: true, color: C.gold });
    s.addText(c.t, { x: x + 0.28, y: y + 0.58, w: 3.3, h: 0.62, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.text });
    s.addText(c.d, { x: x + 0.28, y: y + 1.24, w: 3.32, h: 0.74, isTextBox: true, margin: 0, fontFace: F, fontSize: 10, color: C.mute, lineSpacingMultiple: 1.2 });
  });
  foot(s, 21);
}

// ============================================================ S22 차이점 표
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 3 · 비교 분석", "차이점 종합 비교표", C.ink);
  const hdr = ["비교 항목", "리튬이온전지 (LIB)", "전고체전지 (SSB)"];
  const rows = [
    ["가열의 목적", "영하에서 충전을 가능하게", "상온에서 사용 가능한 성능 확보"],
    ["출발 온도 / 목표", "−30 ~ 0 °C  →  0 ~ 15 °C", "25 °C (상온)  →  60 ~ 80 °C"],
    ["구동 방식", "전류 구동 (C-rate 지정)", "전압 구동 (±1 ~ 2 V 지정)"],
    ["발열 지배식", "P = I ²·Re{Z}", "P = V ²·Z_Re / |Z|²"],
    ["주파수 대역", "0.1 Hz ~ 1 kHz", "10⁵ ~ 10⁶ Hz (0.2 MHz 최적)"],
    ["주파수 특성", "발열 ↔ 석출 상충 (단조 감소)", "비단조 — 최적점 존재"],
    ["1차 제약 조건", "리튬 석출 (음극 전위 ≥ 0 V)", "전해질 전압 윈도우 + 셀 인덕턴스"],
    ["승온율", "3 ~ 7 °C/min (실측, 팩)", "50 K/min (시뮬) / 실측 ≈ 1 °C·2min⁻¹"],
    ["에너지 소모", "3 ~ 10 %", "3.4 % (예측)"],
    ["구현 하드웨어", "인버터·모터 재구성, DC/DC (기존 부품)", "MHz급 전력변환 — 차량용 미확립"],
    ["기술 성숙도", "TRL 9 — 양산 적용", "TRL 3 — 대칭셀 개념 실증"],
  ];
  const colX = [0.6, 4.05, 8.6], colW = [3.4, 4.5, 4.13];
  hdr.forEach((h, i) => {
    s.addShape(pres.ShapeType.rect, { x: colX[i], y: 1.68, w: colW[i], h: 0.44, fill: { color: i === 1 ? C.lib : i === 2 ? C.ssb : C.ink }, line: { color: i === 1 ? C.lib : i === 2 ? C.ssb : C.ink } });
    s.addText(h, { x: colX[i] + 0.16, y: 1.7, w: colW[i] - 0.3, h: 0.4, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, bold: true, color: "FFFFFF", valign: "middle" });
  });
  rows.forEach((r, i) => {
    const y = 2.16 + i * 0.40;
    if (i % 2 === 0) s.addShape(pres.ShapeType.rect, { x: 0.6, y, w: 12.13, h: 0.40, fill: { color: "F7F9FB" }, line: { color: "F7F9FB" } });
    const last = i === rows.length - 1;
    r.forEach((c, k) => {
      s.addText(c, {
        x: colX[k] + 0.16, y: y + 0.02, w: colW[k] - 0.3, h: 0.36, isTextBox: true, margin: 0,
        fontFace: F, fontSize: 10.5, valign: "middle",
        bold: k === 0 || last, color: last ? (k === 1 ? C.lib : k === 2 ? C.ssb : C.text) : (k === 0 ? C.text : C.mute),
      });
    });
  });
  foot(s, 22, "리튬이온 수치는 다수 문헌의 실측 범위, 전고체 수치는 Joule 9(7), 2025 단일 연구의 실측 및 모델 예측값");
}

// ============================================================ S23 차이의 근원
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 3 · 해석", "차이의 근원 — 전류를 정하는가, 전압을 정하는가", C.ink);

  card(s, { x: 0.6, y: 1.72, w: 5.95, h: 3.1, fill: C.libL, line: C.lib });
  s.addText("리튬이온 — 전류 구동", { x: 0.9, y: 1.94, w: 5.4, h: 0.36, isTextBox: true, margin: 0, fontFace: F, fontSize: 17, bold: true, color: C.libD });
  s.addText("P = I ² · Re{Z}", { x: 0.9, y: 2.4, w: 5.4, h: 0.44, isTextBox: true, margin: 0, fontFace: F, fontSize: 20, bold: true, color: C.text });
  s.addText([
    { text: "Re{Z}는 주파수가 오르면 단조 감소 → 저주파일수록 발열이 크다", options: { bullet: true, breakLine: true } },
    { text: "그런데 저주파는 패러데이 반응을 실제로 일으켜 리튬 석출을 부른다", options: { bullet: true, breakLine: true } },
    { text: "결과: 발열과 안전이 정면으로 상충 → 제약 최적화 문제가 된다", options: { bullet: true } },
  ], { x: 0.92, y: 2.98, w: 5.4, h: 1.65, isTextBox: true, margin: 0, fontFace: F, fontSize: 11.5, color: C.text, paraSpaceAfter: 9 });

  card(s, { x: 6.78, y: 1.72, w: 5.95, h: 3.1, fill: C.ssbL, line: C.ssb });
  s.addText("전고체 — 전압 구동", { x: 7.08, y: 1.94, w: 5.4, h: 0.36, isTextBox: true, margin: 0, fontFace: F, fontSize: 17, bold: true, color: C.ssbD });
  s.addText("P = V ² · Z_Re / |Z| ²", { x: 7.08, y: 2.4, w: 5.4, h: 0.44, isTextBox: true, margin: 0, fontFace: F, fontSize: 20, bold: true, color: C.text });
  s.addText([
    { text: "주파수가 오르면 |Z|가 더 빠르게 감소 → 발열이 오히려 커진다", options: { bullet: true, breakLine: true } },
    { text: "동시에 고주파는 반응 전류를 억제 → 화학적 손상이 줄어든다", options: { bullet: true, breakLine: true } },
    { text: "결과: 발열과 안전이 같은 방향 → 상충이 없다. 한계는 인덕턴스뿐", options: { bullet: true } },
  ], { x: 7.1, y: 2.98, w: 5.4, h: 1.65, isTextBox: true, margin: 0, fontFace: F, fontSize: 11.5, color: C.text, paraSpaceAfter: 9 });

  card(s, { x: 0.6, y: 5.05, w: 12.13, h: 1.3, fill: C.ink, line: C.ink });
  s.addText("한 줄 결론", { x: 0.9, y: 5.24, w: 1.9, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 12.5, bold: true, color: C.gold });
  s.addText("두 기술은 “펄스로 전지를 데운다”는 표현만 같을 뿐, 구동 방식이 달라 최적 주파수가 5~6 자릿수 떨어져 있다. 리튬이온의 설계는 석출을 피하는 타협이고, 전고체의 설계는 인덕턴스 한계 직전까지 주파수를 올리는 최적화다. 두 기술의 제어기·전력변환 장치는 서로 호환되지 않는다.",
    { x: 2.9, y: 5.2, w: 9.6, h: 0.95, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, color: "D4DDE6", lineSpacingMultiple: 1.28 });
  foot(s, 23);
  s.addNotes("질문이 나올 만한 지점: '그럼 리튬이온도 MHz로 올리면 되지 않나?' → 리튬이온은 전류 구동이고 Re(Z)가 옴 저항으로 수렴해 발열이 사라진다. 전고체는 전압 구동이라 |Z| 감소가 발열 증가로 이어진다. 구동 방식이 다르기 때문에 같은 처방이 통하지 않는다.");
}

// ============================================================ S24 성숙도 종합
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "PART 3 · 성숙도", "성숙도 격차와 개발 리드타임", C.ink);

  card(s, { x: 0.6, y: 1.75, w: 12.13, h: 1.55, fill: C.paper });
  s.addText("리튬이온 펄스 히팅", { x: 0.9, y: 1.95, w: 2.7, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.lib });
  trlGauge(s, 3.75, 1.95, 9, C.lib, 6.2);
  s.addText("TRL 9", { x: 10.4, y: 1.98, w: 2.1, h: 0.34, isTextBox: true, margin: 0, fontFace: F, fontSize: 16, bold: true, color: C.lib, align: "right" });
  s.addText("2010 특허 → 2016 개념 실증 → 2020 토폴로지 확산 → 2026 양산 (−30 °C 9분 충전)", {
    x: 0.9, y: 2.72, w: 11.5, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, color: C.mute });

  card(s, { x: 0.6, y: 3.45, w: 12.13, h: 1.55, fill: C.paper });
  s.addText("전고체 펄스 히팅", { x: 0.9, y: 3.65, w: 2.7, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.ssb });
  trlGauge(s, 3.75, 3.65, 3, C.ssb, 6.2);
  s.addText("TRL 3", { x: 10.4, y: 3.68, w: 2.1, h: 0.34, isTextBox: true, margin: 0, fontFace: F, fontSize: 16, bold: true, color: C.ssb, align: "right" });
  s.addText("2024 프리프린트 → 2025 Joule 게재 (대칭셀 실증) → full-cell·팩 검증 미착수", {
    x: 0.9, y: 4.42, w: 11.5, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 10.5, color: C.mute });

  const t = [
    { y: "2027", t: "전고체 양산 개시 목표", d: "삼성SDI 2027년 하반기 양산 목표, 토요타 2027~2028년 투입 예정" },
    { y: "2027~28", t: "가열 요구사항이 표면화", d: "실차 저온·상온 성능 검증 과정에서 열관리가 병목으로 부상할 가능성" },
    { y: "2029~30", t: "UHFSH 적용 판단 시점", d: "MHz 전력변환 하드웨어 확보 여부가 채택을 좌우" },
  ];
  t.forEach((e, i) => {
    const x = 0.6 + i * 4.09;
    card(s, { x, y: 5.15, w: 3.85, h: 1.2, fill: C.soft });
    s.addText(e.y, { x: x + 0.24, y: 5.28, w: 1.5, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 13, bold: true, color: C.gold });
    s.addText(e.t, { x: x + 0.24, y: 5.58, w: 3.35, h: 0.28, isTextBox: true, margin: 0, fontFace: F, fontSize: 11.5, bold: true, color: C.text });
    s.addText(e.d, { x: x + 0.24, y: 5.87, w: 3.38, h: 0.42, isTextBox: true, margin: 0, fontFace: F, fontSize: 9.5, color: C.mute, lineSpacingMultiple: 1.15 });
  });
  foot(s, 24, "양산 시점은 각 사 공개 발표 기준이며 변동 가능. UHFSH 적용 시점은 본 조사의 추정");
}

// ============================================================ S25 시사점
{
  const s = pres.addSlide(); darkBase(s);
  s.addShape(pres.ShapeType.ellipse, { x: 10.5, y: -2.9, w: 4.6, h: 4.6, fill: { color: C.ink2, transparency: 45 }, line: { color: C.ink2, transparency: 100 } });
  s.addText("CONCLUSION", { x: 0.62, y: 0.52, w: 8.5, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 12, bold: true, color: C.gold, charSpacing: 2 });
  s.addText("시사점 및 제언", { x: 0.6, y: 0.85, w: 10, h: 0.7, isTextBox: true, margin: 0, fontFace: F, fontSize: 30, bold: true, color: "FFFFFF" });

  const rec = [
    { n: "단기", t: "리튬이온 펄스 히팅은 지금 착수할 기술이다", d: "TRL 9. 경쟁사는 이미 양산 중이고 우리는 외부 가열에 머물러 있다. 셀 특성화(3전극 EIS) → 제약 최적화 모델 → 가속 열화 시험 순으로 즉시 시작한다. FTO 조사 병행 필수.", c: C.lib },
    { n: "중기", t: "전고체 열관리는 “설계 요구사항”으로 미리 정의한다", d: "전고체는 가열이 상시 운용 조건이다. 셀 개발과 열관리 설계를 분리하지 말고, 양산 목표(2027~)에 맞춰 가열 방식 선택지를 지금 열어둔다.", c: C.gold },
    { n: "장기", t: "UHFSH는 “주시”하되 투자 판단은 유보한다", d: "단일 연구그룹의 대칭셀 결과이며 팩 수치는 전부 시뮬레이션이다. 결정적 병목은 전지가 아니라 MHz급 차량용 전력변환 하드웨어다. 이 분야의 진전을 트리거로 삼는다.", c: C.ssb },
  ];
  rec.forEach((r, i) => {
    const y = 1.78 + i * 1.55;
    s.addShape(pres.ShapeType.roundRect, { x: 0.6, y, w: 12.13, h: 1.38, rectRadius: 0.06, fill: { color: C.ink2 }, line: { color: C.ink2 } });
    s.addShape(pres.ShapeType.roundRect, { x: 0.88, y: y + 0.24, w: 0.86, h: 0.34, rectRadius: 0.17, fill: { color: r.c }, line: { color: r.c } });
    s.addText(r.n, { x: 0.88, y: y + 0.25, w: 0.86, h: 0.32, isTextBox: true, margin: 0, fontFace: F, fontSize: 11, bold: true, color: "FFFFFF", align: "center" });
    s.addText(r.t, { x: 1.95, y: y + 0.22, w: 10.5, h: 0.34, isTextBox: true, margin: 0, fontFace: F, fontSize: 15, bold: true, color: "FFFFFF" });
    s.addText(r.d, { x: 1.95, y: y + 0.6, w: 10.5, h: 0.68, isTextBox: true, margin: 0, fontFace: F, fontSize: 11, color: "B9C6D4", lineSpacingMultiple: 1.25 });
  });

  s.addText("가장 큰 오독 위험: 전고체 UHFSH의 “50 K/min, 에너지 3.4 %”를 검증된 성능으로 인용하는 것. 실측된 온도 상승은 2분에 약 1 °C 수준이다.", {
    x: 0.62, y: 6.5, w: 12.1, h: 0.42, isTextBox: true, margin: 0, fontFace: F, fontSize: 11, bold: true, color: C.gold, lineSpacingMultiple: 1.2 });
}

// ============================================================ S26 참고문헌
{
  const s = pres.addSlide(); lightBase(s);
  slideTitle(s, "REFERENCES", "참고문헌", C.mute);

  function refBlock(x, y, w, h, title, color, items, fs) {
    card(s, { x, y, w, h, fill: C.paper });
    s.addText(title, { x: x + 0.28, y: y + 0.18, w: w - 0.56, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 12.5, bold: true, color });
    s.addText(items.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k !== items.length - 1 } })), {
      x: x + 0.3, y: y + 0.56, w: w - 0.6, h: h - 0.74, isTextBox: true, margin: 0,
      fontFace: F, fontSize: fs || 9.5, color: C.mute, paraSpaceAfter: 7, lineSpacingMultiple: 1.15, valign: "top",
    });
  }

  refBlock(0.6, 1.72, 6.1, 4.58, "핵심 논문", C.ink, [
    "B. Zhang, D. Chalise, Y. Zeng, S. Kaur, C. Dames, R. S. Prasher, “Solid-state batteries enabled by ultra-high-frequency self-heating,” Joule 9(7), 2025. doi:10.1016/j.joule.2025.101973",
    "“Experimental study on pulse self-heating of lithium-ion battery at low temperature,” Int. J. Heat and Mass Transfer 135, 696 (2019)",
    "“Experimental study on self-heating strategy of lithium-ion battery at low temperatures based on bidirectional pulse current,” Applied Energy (2024)",
    "“High-Frequency AC Heating Strategy of EV Power Battery Pack in Low-Temperature Environment,” ACS Omega (2024)",
    "“A Health-Aware AC Heating Strategy With Lithium Plating Criterion for Batteries at Low Temperatures,” IEEE (2023)",
    "C.-Y. Wang et al., “Lithium-ion battery structure that self-heats at low temperatures,” Nature (2016)",
  ]);

  refBlock(6.93, 1.72, 5.8, 2.12, "특허", C.lib, [
    "US9065293B2 — Battery heating circuits and methods using transformers (BYD, 우선일 2010-12-23)",
    "US11290045 — Devices, systems, and methods for self-heating batteries (모터 무토크 펄스)",
    "CN116454472A — 전기구동 인버터 재구성 기반 배터리 자가발열 시스템",
    "US20130134146A1 / EP2469683A1 — BYD 가열 회로 패밀리",
  ]);

  refBlock(6.93, 4.18, 5.8, 2.12, "업체 발표 · 산업 자료", C.ssb, [
    "CATL 3세대 선싱 LFP 발표 (2026.04 Tech Day) — CarNewsChina, Electrek",
    "BlueSolutions / BlueBus LMP® 공식 사양 (작동온도 50~80 °C)",
    "현대자동차그룹 배터리 승온·컨디셔닝 기술 공식 자료",
    "삼성SDI 전고체 2027년 양산 목표 (Korea JoongAng Daily, 2026)",
    "PatSnap, “Solid-state electrolytes 2026: oxide vs sulfide vs polymer”",
  ], 9);

  foot(s, 26, "본 자료의 정량 수치는 2026년 9월 기준 공개 문헌·특허·업체 발표에 근거하며, 시험 조건이 상이해 직접 비교는 유효하지 않음");
}

pres.writeFile({ fileName: "/home/user/work/docs/pulse-heating-LIB-vs-SSB.pptx" })
  .then(f => console.log("WROTE", f));
