#!/usr/bin/env node
// Turm für call/ und projects/: sieben Platten (Call 2024) und darüber zwei Platten (Consolidation Call 2026).
// Geometrie aus ~/.claude/skills/wmew-subpage/scripts/projects.js (tower), hier um die zwei Konsortien erweitert.
// Ersetzt nur die beiden <svg class="tw …"> in call/index.html und projects/index.html. Aufruf: node scripts/tower.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

const P = [ // Call 2024, von unten nach oben
  {nr:'001', ac:'SevereME/CFS', eur:99752}, {nr:'002', ac:'CSF genetics', eur:99797}, {nr:'003', ac:'ME/CFSabs', eur:99426},
  {nr:'004', ac:'degranulateME', eur:99992}, {nr:'007', ac:'Acronym tbc', eur:99982}, {nr:'016', ac:'GlycoExplore', eur:99946},
  {nr:'018', ac:'OxMRI', eur:96550}
];
const C = [ // Consolidation Call 2026, von unten nach oben; from = Projekt aus dem Call 2024, auf dem es aufbaut
  {nr:'003', ac:'Wielscher', t:'Rare variants and epigenome', eur:999169, from:'002'},
  {nr:'004', ac:'Haider', t:'Treatment response', eur:999930, from:'018'}
];
const eur = n => '€' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const TOT = P.reduce((a, p) => a + p.eur, 0), CTOT = C.reduce((a, p) => a + p.eur, 0);
const f1 = v => +v.toFixed(1);
const TXT = [
  {t:'7 exploratory projects', l:['Call 2024 · since 01/2025 · €695,445.','Each slab is one project, up to','€100,000 for 12 to 15 months.']},
  {t:'2 projects to consolidate what worked', l:[`${eur(CTOT)} · two consortia.`,'Awarded 10/2026, start 2027.','Each builds on a project below.']}
];

// mode 'call': Konsortien voll, Projekte schraffiert. mode 'proj': Projekte voll, Konsortien nur schraffiert,
// ohne Link, Beschriftung und Linien (ihr Auftritt ist auf call/, Carolina 23.10.)
function tower(desk, mode, hP, hC, pid) {
  const call = mode === 'call';
  const W = desk ? 1088 : 331, U = desk ? 15 : 12, w = desk ? 160 : 90, d = desk ? 110 : 44, G = desk ? 12 : 8;
  const x = desk ? (W - w - d) / 2 + 40 : 72, top = desk ? 60 : 40;
  const poly = (c, pts) => `<polygon class="${c}" points="${pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ')}"/>`;
  function box(bx, by, bw, bh, open) {
    const s = d * .12, f = [[bx,by],[bx+bw,by],[bx+bw,by+bh],[bx,by+bh]], r = [[bx+bw,by],[bx+bw+d,by-s],[bx+bw+d,by+bh-s],[bx+bw,by+bh]], t = [[bx,by],[bx+d,by-s],[bx+bw+d,by-s],[bx+bw,by]];
    return open
      ? poly('oo top', t) + poly('oo fh', f).replace('/>', ` fill="url(#${pid})"/>`) + poly('oo side', r)
      : poly('ft', t) + poly('fl', f) + poly('fr', r);
  }
  // Konsortien oben (004 zuoberst), dann die sieben Projekte (018 zuoberst)
  const yc = [], ys = [];
  let yy = top;
  for (let i = C.length - 1; i >= 0; i--) { const hh = C[i].eur / 100000 * U; yc[i] = [yy, hh]; yy += hh + G; }
  const conBottom = yy - G;
  yy = conBottom + (desk ? 40 : 24);
  for (let i = P.length - 1; i >= 0; i--) { const hh = P[i].eur / 100000 * U; ys[i] = [yy, hh]; yy += hh + G; }
  const bottom = yy - G, sv = d * .12, rEdge = x + w + d + 6, px = desk ? 790 : x + w + d + 20;
  const fs = desk ? 13 : 9.5, cw = fs * .42; // geschätzte Zeichenbreite für das Ende der Beschriftung
  const mid = ([y, h]) => y + h / 2 - sv / 2;
  const ends = {}; // rechtes Ende der Beschriftung je Platte, für die Verbindungslinien
  let h = '', lab = '', ld = '';
  function slab(href, aria, title, yh, open, name, amount, key) {
    const my = mid(yh), txt = name;
    ends[key] = [px + txt.length * cw + (desk ? 8 + amount.length * 11 * .48 : 0), my];
    return `<a class="slab" href="${href}" aria-label="${aria}"><title>${title}</title>`
      + box(x, yh[0], w, yh[1], open)
      + `<path class="ld" d="M ${f1(desk ? rEdge : x + w + d + 4)} ${f1(my)} H ${f1(px - 8)}"/>`
      + `<text class="pl" x="${f1(px)}" y="${f1(my + fs * .36)}" font-size="${fs}">${txt}${desk ? `<tspan class="am" dx="8" font-size="11">${amount}</tspan>` : ''}</text></a>`;
  }
  P.forEach((p, i) => { h += slab(`${hP}${p.nr}/`, `Project ME-CFS24-${p.nr}, ${p.ac}, ${eur(p.eur)}`, `ME-CFS24-${p.nr} ${p.ac} · ${eur(p.eur)}`, ys[i], call, `${p.nr}  ${p.ac}`, eur(p.eur), 'p' + p.nr); });
  if (!call) C.forEach((c, i) => { h += `<g class="blk">${box(x, yc[i][0], w, yc[i][1], true)}</g>`; });
  else C.forEach((c, i) => { h += slab(`${hC}${c.nr}/`, `Consortium ME-CFS-CC26-${c.nr}, ${c.ac}, ${c.t}, ${eur(c.eur)}`, `ME-CFS-CC26-${c.nr} ${c.ac} · ${eur(c.eur)}`, yc[i], false, `CC26-${c.nr}  ${c.ac}`, eur(c.eur), 'c' + c.nr); });
  // Feine Linien rechts außen: jedes Konsortium zu dem Projekt, auf dem es aufbaut
  const cols = desk ? [W - 34, W - 18] : [W - 9, W - 3];
  if (call) C.forEach((c, i) => {
    const a = ends['c' + c.nr], b = ends['p' + c.from], cx = cols[i], g = desk ? 8 : 4;
    ld += `<path class="ld cx" d="M ${f1(a[0] + g)} ${f1(a[1] - (desk ? 4 : 3))} H ${f1(cx)} V ${f1(b[1] - (desk ? 4 : 3))} H ${f1(b[0] + g)}"/>`;
  });
  const gapY = conBottom + 20, lx = 110, ex = x - 16 - 120;
  if (desk) {
    [[TXT[1], lx, top + 20, top + (conBottom - top) * .62], [TXT[0], lx, gapY + 40, (ys[6][0] + bottom) / 2 + 34]].forEach(([o, tx, ty, ey]) => {
      lab += `<text class="ti" x="${f1(tx)}" y="${f1(ty - 2)}" font-size="15">${o.t}</text>`;
      o.l.forEach((z, i) => { lab += `<text class="tx" x="${f1(tx)}" y="${f1(ty + 18 + i * 15)}" font-size="11.5">${z}</text>`; });
      ld += `<path class="ld" d="M ${f1(tx - 14)} ${f1(ty - 18)} V ${f1(ey)} H ${f1(ex)}"/>`;
    });
  }
  const bx = x - (desk ? 16 : 10), tk = desk ? 6 : 4;
  function brk(y1, y2, big, small) {
    const m = (y1 + y2) / 2, s = desk ? 16 : 10.5;
    ld += `<path class="ld" d="M ${f1(bx + tk)} ${f1(y1)} H ${f1(bx)} V ${f1(y2)} H ${f1(bx + tk)} M ${f1(bx)} ${f1(m)} H ${f1(bx - tk)}"/>`;
    lab += `<text class="tot" x="${f1(bx - tk - 6)}" y="${f1(m - (desk ? 5 : 3))}" text-anchor="end" font-size="${s}">${big}</text>`
      + `<text class="tx" x="${f1(bx - tk - 6)}" y="${f1(m + (desk ? 13 : 9))}" text-anchor="end" font-size="${desk ? 11 : 8}">${small}</text>`;
  }
  brk(top - sv, conBottom, '€2 million', '2 projects');
  brk(ys[6][0] - sv, bottom, eur(TOT), '7 projects');
  const H = bottom + (desk ? 30 : 20);
  return `<svg class="tw ${desk ? 'dk' : 'ph'}${call ? ' call' : ''}" viewBox="0 0 ${W} ${f1(H)}" aria-hidden="true">`
    + `<defs><pattern id="${pid}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" class="ht"/></pattern></defs>`
    + ld + h + lab + '</svg>';
}

const list = (hP, hC, call) => [...(call ? C : []).map(c => `          <li><a class="bk" href="${hC}${c.nr}/"><span class="n">CC26-${c.nr}</span><span class="t">${c.ac}</span><span class="a">${eur(c.eur)}</span></a></li>`),
  ...P.map(p => `          <li><a class="bk" href="${hP}${p.nr}/"><span class="n">${p.nr}</span><span class="t">${p.ac}</span><span class="a">${eur(p.eur)}</span></a></li>`)].join('\n');
const AL = {
  call: 'A tower: on top, two large slabs for the Consolidation Call, €1,999,099 for two consortia awarded in October 2026: CC26-004 Haider, building on project 018, and CC26-003 Wielscher, building on project 002. Below, seven thin hatched slabs, the exploratory projects they build on. Each slab links to its page.',
  proj: 'A tower: seven thin slabs, one per exploratory project, about €100,000 each, €695,445 in total. On top, two large hatched slabs for the two consortia of the Consolidation Call, €1,999,099. Each project slab links to its page.'
};
for (const [file, mode, hP, hC, pid] of [['call/index.html', 'call', '../projects/', '', 'hc'], ['projects/index.html', 'proj', '', '../call/', 'hp']]) {
  const f = path.join(ROOT, file);
  let s = fs.readFileSync(f, 'utf8');
  s = s.replace(/<svg class="tw ph[\s\S]*?<\/svg>(?=\s*<svg class="tw dk)/, () => tower(false, mode, hP, hC, pid));
  s = s.replace(/<svg class="tw dk[\s\S]*?<\/svg>(?=\s*<figcaption)/, () => tower(true, mode, hP, hC, pid + 'd'));
  s = s.replace(/(<figure class="tower" aria-label=")[^"]*/, (m, a) => a + AL[mode]);
  s = s.replace(/(<figcaption class="tl">\s*<ul>\n)[\s\S]*?(\n\s*<\/ul>)/, (m, a, b) => a + list(hP, hC, mode === 'call') + b);
  fs.writeFileSync(f, s);
}
console.log('Turm neu: call/, projects/');
