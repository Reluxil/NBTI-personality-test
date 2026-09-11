const { calculateResult } = require('./aiti-engine');

const ALL = ['q01','q02','q03','q04','q05','q06','q07','q08','q09','q10','q11','q12','q13','q14','q15','q16','q17','q18','q19','q20','q21','q22'];

function mk(trade, scn) {
  const answers = {};
  for (const q of ALL) {
    if (trade[q]) answers[q] = { level: trade[q] };
    else answers[q] = { level: 'eq' };
  }
  for (const q of ['q19','q20','q21','q22']) {
    answers[q] = Object.assign(answers[q], { scene1: 'A', scene2: 'A', factor: (scn && scn[q]) || '1' });
  }
  return answers;
}

const CASES = {
  '杠精本精(H)': mk({ q01:'va', q03:'vb', q04:'va', q05:'vb' }),
  '数字包工头(C)': mk({ q02:'va', q05:'va' }),
  '赛博元谋人(R)': mk({ q03:'va', q06:'va' }),
  '教父(HC)': mk({ q01:'va', q02:'va', q04:'va', q05:'va' }),
  '嘴强王者(HR)': mk({ q01:'va', q03:'va', q04:'va', q06:'va' }),
  '人机(CR)': mk({ q02:'va', q03:'va', q05:'va', q06:'va' }),
  '薛定谔的猫(HCR)': mk({})
};

let pass = 0, fail = 0;
for (const [expect, ans] of Object.entries(CASES)) {
  const r = calculateResult(ans);
  const got = r.identity.name;
  const expectName = expect.replace(/\s*\([HCR]+\)$/, '');
  const ok = got === expectName;
  console.log(`${ok ? 'PASS' : 'FAIL'}  expect=${expect}  got=${got}  routes=H${r.routes.H}/C${r.routes.C}/R${r.routes.R}  perc=H${r.routePercents.H}/C${r.routePercents.C}/R${r.routePercents.R}`);
  ok ? pass++ : fail++;
}

// 参考会话 wMYmpWkXgJMT：全 eq + q19~q22 决定因素均=1 → 薛定谔 + 仅「再来一瓶」
const ref = mk({}, { q19:'1', q20:'1', q21:'1', q22:'1' });
const rr = calculateResult(ref);
const extOk = rr.externals.length === 1 && rr.externals[0].name === '再来一瓶' && rr.identity.name.startsWith('薛定谔');
console.log(`${extOk ? 'PASS' : 'FAIL'}  refSession  got=${rr.identity.name}  externals=[${rr.externals.map(e=>e.name).join(',')}]`);
extOk ? pass++ : fail++;

// 技能授权平局
const sk = mk({ q01:'va', q03:'vb', q04:'va', q05:'vb' });
sk.q07 = { level:'va' }; sk.q09 = { level:'va' }; // F4+
sk.q10 = { level:'va' }; sk.q13 = { level:'va' }; sk.q18 = { level:'va' }; // F1+
const sr = calculateResult(sk);
const skOk = sr.skills.granted.some(g=>g.id==='F1') && sr.skills.granted.some(g=>g.id==='F4');
console.log(`${skOk ? 'PASS' : 'FAIL'}  skillTie  granted=[${sr.skills.granted.map(g=>g.id).join(',')}]`);
skOk ? pass++ : fail++;

console.log(`\nTOTAL  pass=${pass}  fail=${fail}`);
process.exit(fail ? 1 : 0);
