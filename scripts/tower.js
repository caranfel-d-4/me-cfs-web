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
  {t:'ME/CFS 2024 – Understanding ME/CFS', l:['Call 2024 · since 01/2025 · €695,445.','Each slab is one project, up to','€100,000 for 12 to 15 months.']},
  {t:'ME/CFS Consolidation Call 2026', l:[`${eur(CTOT)} · two consortia.`,'Awarded 10/2026, start 2027.','Each builds on a project below.']}
];

// mode 'call': Konsortien voll, Projekte schraffiert. mode 'proj': Projekte voll, Konsortien nur schraffiert,
// ohne Link, Beschriftung und Linien (ihr Auftritt ist auf call/, Carolina 23.10.)
function tower(desk, mode, hP, hC, pid) {
  const call = mode === 'call';
  const W = desk ? 1088 : 331, U = desk ? 15 : 12, w = desk ? 130 : 90, d = desk ? 90 : 44, G = desk ? 12 : 8;
  // Schrift in festen px (01.11.2026): 24 px groß, klein 15 px Computer / 14 px Handy; in SVG-Einheiten für das schmalste Fenster
  // (Computer 900 px → Turm 827 px breit, Handy 360 px → 316 px), damit es dort noch passt. Größen selbst: sub.css .tx-l/.tx-s
  const K = desk ? W / 827 : W / 316, LS = 24 * K, SS = (desk ? 15 : 14) * K;
  const x = desk ? 520 : 20, top = desk ? 60 : 62; // Handy höher: Platz für den zweizeiligen Call-Namen über der Klammer
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
  yy = conBottom + (desk ? 40 : 46);
  for (let i = P.length - 1; i >= 0; i--) { const hh = P[i].eur / 100000 * U; ys[i] = [yy, hh]; yy += hh + G; }
  const bottom = yy - G, sv = d * .12, rEdge = x + w + d + 6, px = desk ? x + w + d + 24 : x + w + d + 24;
  const cw = SS * .47; // geschätzte Zeichenbreite für das Ende der Beschriftung
  const mid = ([y, h]) => y + h / 2 - sv / 2;
  const ends = {}; // rechtes Ende der Beschriftung je Platte, für die Verbindungslinien
  let h = '', lab = '', ld = '';
  function slab(href, aria, title, yh, open, name, amount, key) {
    const my = mid(yh), txt = name;
    ends[key] = [px + txt.length * cw + (desk ? 8 + amount.length * SS * .5 : 0), my];
    return `<a class="slab" href="${href}" aria-label="${aria}"><title>${title}</title>`
      + box(x, yh[0], w, yh[1], open)
      + `<path class="ld" d="M ${f1(desk ? rEdge : x + w + d + 4)} ${f1(my)} H ${f1(px - 8)}"/>`
      + `<text class="pl tx-s" x="${f1(px)}" y="${f1(my + SS * .36)}">${txt}${desk ? `<tspan class="am" dx="8">${amount}</tspan>` : ''}</text></a>`;
  }
  P.forEach((p, i) => { h += slab(`${hP}${p.nr}/`, `Project ME-CFS24-${p.nr}, ${p.ac}, ${eur(p.eur)}`, `ME-CFS24-${p.nr} ${p.ac} · ${eur(p.eur)}`, ys[i], call, `${p.nr}  ${p.ac}`, eur(p.eur), 'p' + p.nr); });
  if (!call) C.forEach((c, i) => { h += `<g class="blk">${box(x, yc[i][0], w, yc[i][1], true)}</g>`; });
  else C.forEach((c, i) => { h += slab(`${hC}${c.nr}/`, `Consortium ME-CFS-CC26-${c.nr}, ${c.ac}, ${c.t}, ${eur(c.eur)}`, `ME-CFS-CC26-${c.nr} ${c.ac} · ${eur(c.eur)}`, yc[i], false, `CC26-${c.nr}  ${c.ac}`, eur(c.eur), 'c' + c.nr); });
  // Feine Linien rechts außen: jedes Konsortium zu dem Projekt, auf dem es aufbaut
  const cols = desk ? [W - 22, W - 8] : [W - 9, W - 3];
  if (call) C.forEach((c, i) => {
    const a = ends['c' + c.nr], b = ends['p' + c.from], cx = cols[i], g = desk ? 8 : 4;
    ld += `<path class="ld cx" d="M ${f1(a[0] + g)} ${f1(a[1] - (desk ? 4 : 3))} H ${f1(cx)} V ${f1(b[1] - (desk ? 4 : 3))} H ${f1(b[0] + g)}"/>`;
  });
  const gapY = conBottom + 20, lx = 16, bxx = x - 16, ex = bxx - 6 - 6 - 4.6 * LS - 16;
  const wrap = (str, max, cwid) => { const out = []; let cur = ''; str.split(' ').forEach(t => { const n = cur ? cur + ' ' + t : t; if (cur && n.length * cwid > max) { out.push(cur); cur = t; } else cur = n; }); out.push(cur); return out; };
  if (desk) {
    const maxW = ex - 12 - lx;
    [[TXT[1], top - 4, top + (conBottom - top) * .5], [TXT[0], gapY + 20, (ys[6][0] + bottom) / 2]].forEach(([o, ty, ey]) => {
      // Beschriftung links = Name des Calls, ohne Notizen darunter (01.11.2026, Carolina)
      let yl = ty + LS * .75;
      wrap(o.t, maxW, LS * .47).forEach((z, i) => { if (i) yl += LS * 1.1; lab += `<text class="ti tx-l" x="${f1(lx)}" y="${f1(yl)}">${z}</text>`; });
      const ly = Math.max(ey, yl + SS * .8);
      ld += `<path class="ld" d="M ${f1(lx - 14)} ${f1(ty)} V ${f1(ly)} H ${f1(ex)}"/>`;
    });
  }
  const bx = x - (desk ? 16 : 10), tk = desk ? 6 : 4;
  // Jahreszahl nicht beim Betrag (01.11.2026, Carolina): Computer steht sie links bei der Beschriftung, Handy hinter der kleinen Beschriftung
  // Handy (01.11.2026, Carolina, Screenshot): neben dem Betrag der Call-Name statt „2 projects · 2026“, bei Bedarf zweizeilig
  function brk(y1, y2, big, small, name) {
    const m = (y1 + y2) / 2;
    if (desk) {
      ld += `<path class="ld" d="M ${f1(bx + tk)} ${f1(y1)} H ${f1(bx)} V ${f1(y2)} H ${f1(bx + tk)} M ${f1(bx)} ${f1(m)} H ${f1(bx - tk)}"/>`;
      lab += `<text class="tot tx-l" x="${f1(bx - tk - 6)}" y="${f1(m - LS * .12)}" text-anchor="end">${big}</text>`
        + `<text class="tx tx-s" x="${f1(bx - tk - 6)}" y="${f1(m + SS * 1.15)}" text-anchor="end">${small}</text>`;
    } else {
      ld += `<path class="ld" d="M ${f1(bx + tk)} ${f1(y1)} H ${f1(bx)} V ${f1(y2)} H ${f1(bx + tk)}"/>`;
      const nx = big.length * LS * .52 + SS * .6, lines = wrap(name, W - nx, SS * .5), ls = SS * 1.15;
      const by = y1 - SS * .5 - (lines.length - 1) * ls;
      lab += `<text class="tot tx-l" x="0" y="${f1(by)}">${big}</text>`;
      lines.forEach((z, i) => { lab += `<text class="tx tx-s" x="${f1(nx)}" y="${f1(by + i * ls)}">${z}</text>`; });
    }
  }
  brk(top - sv, conBottom, '€2 million', '2 projects', 'ME/CFS Consolidation Call 2026');
  brk(ys[6][0] - sv, bottom, eur(TOT), '7 projects', 'ME/CFS 2024');
  const H = bottom + (desk ? 30 : 20);
  return `<svg data-fit class="tw ${desk ? 'dk' : 'ph'}${call ? ' call' : ''}" viewBox="0 0 ${W} ${f1(H)}" aria-hidden="true">`
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
  s = s.replace(/<svg (?:data-fit )?class="tw ph[\s\S]*?<\/svg>(?=\s*<svg (?:data-fit )?class="tw dk)/, () => tower(false, mode, hP, hC, pid));
  s = s.replace(/<svg (?:data-fit )?class="tw dk[\s\S]*?<\/svg>(?=\s*<figcaption)/, () => tower(true, mode, hP, hC, pid + 'd'));
  s = s.replace(/(<figure class="tower" aria-label=")[^"]*/, (m, a) => a + AL[mode]);
  s = s.replace(/(<figcaption class="tl">\s*<ul>\n)[\s\S]*?(\n\s*<\/ul>)/, (m, a, b) => a + list(hP, hC, mode === 'call') + b);
  fs.writeFileSync(f, s);
}
console.log('Turm neu: call/, projects/');
