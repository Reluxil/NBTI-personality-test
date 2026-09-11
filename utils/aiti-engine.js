// AITI 赛博版 计分引擎
// 逆向自线上 aiti-v3 / v5.2.0 真实评分（对照参考会话 wMYmpWkXgJMT 校准）。
//
// 三路线 K04 核验(H) / K05 校准(C) / K06 再造(R)
//   - q01~q06 交易题：每题给一条路线 ±4，按 max(1, nTrade/3) 归一化（线性，v 偏离 3 即贡献）
//   - q07~q18 技能题：每题给两个技能 ±2，不归一化（±8 量程），仅内部计算，结果页不展示
//   - q19~q22 情境题：不影响路线/技能，只驱动情境外挂
//
// 主身份 = 归一化路线占优组合（占优容差 GAP=2）：
//   {H}杠精本精 / {C}数字包工头 / {R}赛博元谋人
//   {H,C}教父 / {H,R}嘴强王者 / {C,R}人机 / 三路线均衡→薛定谔的猫

const { QUESTIONS, LIKERT } = require('../data/aiti/questions');
const { EXTERNALS, getIdentity } = require('../data/aiti/characters');

// 单题作答值 v：非常符合A=1 … 非常符合B=5，没有经验/未答=0（弃权）。
function levelToV(level) {
  switch (level) {
    case 'va': return 1;
    case 'a': return 2;
    case 'eq': return 3;
    case 'b': return 4;
    case 'vb': return 5;
    default: return 0; // na / 未答
  }
}

// 交易题：答 v=1（A 极）时的原始路线向量。来源：线上 API 逐题反推。
const TRADE_R = {
  q01: { K04: 4, K05: -4, K06: 0 },
  q02: { K04: 0, K05: 4, K06: -4 },
  q03: { K04: -4, K05: 0, K06: 4 },
  q04: { K04: 4, K05: 0, K06: -4 },
  q05: { K04: -4, K05: 4, K06: 0 },
  q06: { K04: 0, K05: -4, K06: 4 }
};

// 技能题：答 v=1（A 极）时的原始技能向量（每题两个技能 ±2，不归一化）。
const SKILL_S = {
  q07: { F4: 2, F5: -2 },
  q08: { F2: 2, F3: -2 },
  q09: { F3: 2, F4: -2 },
  q10: { F1: 2, F2: -2 },
  q11: { F5: 2, F6: -2 },
  q12: { F1: -2, F6: 2 },
  q13: { F1: 2, F3: -2 },
  q14: { F3: 2, F5: -2 },
  q15: { F2: -2, F5: 2 },
  q16: { F2: 2, F6: -2 },
  q17: { F4: -2, F6: 2 },
  q18: { F1: -2, F4: 2 }
};

const SKILL_NAMES = {
  F1: '事实核查', F2: '任务拆解', F3: '边界裁断', F4: '调度执行',
  F5: '去 AI 味', F6: '人味返厂'
};

// 情境外挂命中近似（线上为跨界 hit 逻辑；此处以「决定因素」为主导，已对照参考会话 wMYmpWkXgJMT 校准：
// 该会话 q20/q21/q22 决定因素均为 1，仅点亮「再来一瓶」）。
function litExternals(answers) {
  const lit = new Set();
  const a20 = answers.q20 || {};
  const a21 = answers.q21 || {};
  const a22 = answers.q22 || {};
  // 放着我来：q20 决定因素=2（AI 近期表现不稳定）
  if (a20.factor === '2') lit.add('放着我来');
  // 让我调停：q21 决定因素=3（多份材料说法是否一致）
  if (a21.factor === '3') lit.add('让我调停');
  // 再来一瓶：q22 决定因素=1（成品发给谁看、可能影响谁）
  if (a22.factor === '1') lit.add('再来一瓶');
  return [...lit];
}

function computeRouteRaw(answers) {
  const raw = { K04: 0, K05: 0, K06: 0 };
  let nTrade = 0;
  for (const q of QUESTIONS) {
    const R = TRADE_R[q.id];
    if (!R) continue;
    const ans = answers[q.id];
    if (!ans || !ans.level) continue;
    const v = levelToV(ans.level);
    if (v === 0) continue;
    const f = (3 - v) / 2; // v=1→1, v=2→0.5, v=3→0, v=4→-0.5, v=5→-1
    raw.K04 += R.K04 * f;
    raw.K05 += R.K05 * f;
    raw.K06 += R.K06 * f;
    nTrade++;
  }
  const div = Math.max(1, nTrade / 3);
  return {
    K04: Math.round(raw.K04 / div),
    K05: Math.round(raw.K05 / div),
    K06: Math.round(raw.K06 / div)
  };
}

function computeSkillRaw(answers) {
  const raw = { F1: 0, F2: 0, F3: 0, F4: 0, F5: 0, F6: 0 };
  for (const q of QUESTIONS) {
    const S = SKILL_S[q.id];
    if (!S) continue;
    const ans = answers[q.id];
    if (!ans || !ans.level) continue;
    const v = levelToV(ans.level);
    if (v === 0) continue;
    const f = (3 - v) / 2;
    for (const k of Object.keys(raw)) if (S[k]) raw[k] += S[k] * f;
  }
  return raw;
}

// 主身份判定：归一化路线为单位，占优容差 GAP=2。
function determineIdentity(routeR) {
  const routes = [
    { k: 'K04', v: routeR.K04, id: 'gangjing' },
    { k: 'K05', v: routeR.K05, id: 'baogongtou' },
    { k: 'K06', v: routeR.K06, id: 'yuanmouren' }
  ];
  const GAP = 2;
  const sorted = [...routes].sort((a, b) => b.v - a.v);
  const top = sorted[0].v;
  const second = sorted[1].v;
  if (top - second > GAP) return sorted[0].id; // 单一占优
  const active = routes.filter(r => top - r.v <= GAP).map(r => r.id).sort();
  if (active.length === 2) {
    const pairMap = {
      'baogongtou,gangjing': 'jiaofu',    // C + H
      'gangjing,yuanmouren': 'zuoqiang',  // H + R
      'baogongtou,yuanmouren': 'renji'    // C + R
    };
    return pairMap[active.join(',')] || 'schrodinger';
  }
  return 'schrodinger'; // 三路线均衡
}

function grantedSkills(skillRaw) {
  const entries = Object.entries(skillRaw);
  const max = Math.max(...entries.map(([, val]) => val));
  if (max <= 0) return [];
  return entries.filter(([, val]) => val === max).map(([k]) => k);
}

function computeRoutePercents(routeR) {
  if (routeR.K04 <= 0 && routeR.K05 <= 0 && routeR.K06 <= 0) {
    return { H: 33, C: 33, R: 33 }; // 均衡态展示为三等分
  }
  const m = Math.max(routeR.K04, routeR.K05, routeR.K06, 1);
  return {
    H: Math.max(0, Math.round((routeR.K04 / m) * 100)),
    C: Math.max(0, Math.round((routeR.K05 / m) * 100)),
    R: Math.max(0, Math.round((routeR.K06 / m) * 100))
  };
}

function getQuestions() {
  return QUESTIONS;
}

function getLikert() {
  return LIKERT;
}

function calculateResult(answers) {
  const routeR = computeRouteRaw(answers);
  const skillRaw = computeSkillRaw(answers);
  const identityId = determineIdentity(routeR);
  const identity = getIdentity(identityId);
  const granted = grantedSkills(skillRaw);
  const externalsNames = litExternals(answers);
  const externals = EXTERNALS.filter(e => externalsNames.includes(e.name));

  return {
    testType: 'aiti',
    skin: 'cyber',
    identity,
    character: identity,
    routes: { H: routeR.K04, C: routeR.K05, R: routeR.K06 },
    routePercents: computeRoutePercents(routeR),
    skills: {
      raw: skillRaw,
      granted: granted.map(k => ({ id: k, name: SKILL_NAMES[k] }))
    },
    externals,
    answeredCount: Object.keys(answers).filter(k => ['q01', 'q02', 'q03', 'q04', 'q05', 'q06', 'q07', 'q08', 'q09', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20', 'q21', 'q22'].includes(k)).length,
    totalQuestions: QUESTIONS.length,
    completedAt: new Date().toISOString()
  };
}

module.exports = {
  getQuestions,
  getLikert,
  calculateResult,
  determineIdentity,
  computeRouteRaw,
  computeSkillRaw
};
