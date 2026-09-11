const { QUESTIONS } = require('./data/aiti/questions');
const e = require('./utils/aiti-engine');

function build(pick, ext) {
  const ans = {};
  for (const q of QUESTIONS) {
    if (q.type === 'likert') {
      if (q.optionA.route === pick) ans[q.id] = { level: 'va' };
      else if (q.optionB.route === pick) ans[q.id] = { level: 'vb' };
      else ans[q.id] = { level: 'eq' };
    } else {
      const s1 = q.scenes[0].optionA.route === pick ? 'A' : (q.scenes[0].optionB.route === pick ? 'B' : 'A');
      const s2 = q.scenes[1].optionA.route === pick ? 'A' : (q.scenes[1].optionB.route === pick ? 'B' : 'A');
      const f = ext ? (q.factors.find(x => x.ext === ext) || q.factors[0]) : q.factors[0];
      ans[q.id] = { scene1: s1, scene2: s2, factor: f.key };
    }
  }
  return ans;
}

for (const r of ['H', 'C', 'R']) {
  const res = e.calculateResult(build(r));
  console.log('pure', r, '->', res.identity.name, '| routes', JSON.stringify(res.routes), '| ext', res.externals.map(x => x.name));
}

function buildHC() {
  const ans = {};
  for (const q of QUESTIONS) {
    if (q.type === 'likert') {
      if (q.optionA.route === 'H') ans[q.id] = { level: 'va' };
      else if (q.optionB.route === 'C') ans[q.id] = { level: 'vb' };
      else if (q.optionA.route === 'C') ans[q.id] = { level: 'va' };
      else ans[q.id] = { level: 'eq' };
    } else {
      const s1 = q.scenes[0].optionA.route !== 'R' ? 'A' : (q.scenes[0].optionB.route !== 'R' ? 'B' : 'A');
      const s2 = q.scenes[1].optionA.route !== 'R' ? 'A' : (q.scenes[1].optionB.route !== 'R' ? 'B' : 'A');
      const f = q.factors.find(x => x.ext === '放着我来') || q.factors[0];
      ans[q.id] = { scene1: s1, scene2: s2, factor: f.key };
    }
  }
  return ans;
}
console.log('HC ->', e.calculateResult(buildHC()).identity.name);

function buildHR() {
  const ans = {};
  for (const q of QUESTIONS) {
    if (q.type === 'likert') {
      if (q.optionA.route === 'H') ans[q.id] = { level: 'va' };
      else if (q.optionB.route === 'R') ans[q.id] = { level: 'vb' };
      else if (q.optionA.route === 'R') ans[q.id] = { level: 'va' };
      else ans[q.id] = { level: 'eq' };
    } else {
      const s1 = q.scenes[0].optionA.route !== 'C' ? 'A' : (q.scenes[0].optionB.route !== 'C' ? 'B' : 'A');
      const s2 = q.scenes[1].optionA.route !== 'C' ? 'A' : (q.scenes[1].optionB.route !== 'C' ? 'B' : 'A');
      const f = q.factors.find(x => x.ext === '让我调停') || q.factors[0];
      ans[q.id] = { scene1: s1, scene2: s2, factor: f.key };
    }
  }
  return ans;
}
console.log('HR ->', e.calculateResult(buildHR()).identity.name);

function buildAll() {
  const ans = {};
  for (const q of QUESTIONS) {
    if (q.type === 'likert') {
      if (q.optionA.route === 'H') ans[q.id] = { level: 'va' };
      else if (q.optionB.route === 'C') ans[q.id] = { level: 'vb' };
      else if (q.optionA.route === 'R') ans[q.id] = { level: 'va' };
      else ans[q.id] = { level: 'eq' };
    } else {
      ans[q.id] = { scene1: 'A', scene2: 'B', factor: q.factors[0].key };
    }
  }
  return ans;
}
const all = e.calculateResult(buildAll());
console.log('all ->', all.identity.name, '| routes', JSON.stringify(all.routes), '| perc', JSON.stringify(all.routePercents));

function buildExt() {
  const ans = {};
  for (const q of QUESTIONS) {
    if (q.type === 'likert') ans[q.id] = { level: 'eq' };
    else {
      const idx = (parseInt(q.id.replace('q', ''), 10) - 19) % 3;
      const f = q.factors[idx];
      ans[q.id] = { scene1: 'A', scene2: 'B', factor: f.key };
    }
  }
  return ans;
}
const ex = e.calculateResult(buildExt());
console.log('ext ->', ex.externals.map(x => x.name), '| count', ex.externals.length);
