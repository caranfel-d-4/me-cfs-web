#!/usr/bin/env node
// Fellowships-Grafik „Netz“ (Wireframe F5, Moodboard 11.2, gewählt 02.11.2026): Wien in der Mitte, sechs Fellows, Länder.
// Kommt = grau breit, geht = schwarz fein. Richtungen laut Steckbriefen (Folie WWTF Fellowships). Ersetzt <figure class="fnet"> bzw. die alte <figure class="oi"> in fellowships/index.html.
// Schrift in festen px über svg[data-fit] + sub.css .tx-s (assets/svg-text.js). Aufruf: node scripts/fellows.js
const fs = require('fs'), path = require('path');
const f = path.join(__dirname, '..', 'fellowships', 'index.html');
const f1 = v => Math.round(v * 10) / 10;
const FEL = [ // p = Lage [Computer, Handy] (Anteil von Breite/Höhe), to = Land, k = o raus / i rein
  {n:'García de Otazo', h:'003/', to:'kr', k:'o', p:[[.68,.27],[.68,.27]], a:['',     'end'], dy:[0,0]},
  {n:'Vincenzi', h:'002/',        to:'uk', k:'o', p:[[.38,.27],[.32,.33]], a:['',     ''],    dy:[0,22]},
  {n:'McGing', h:'005/',          to:'uk', k:'i', p:[[.24,.36],[.2,.3]],   a:['end',  'end'], dy:[0,0]},
  {n:'Eitenberger', h:'006/',     to:'ie', k:'o', p:[[.28,.56],[.27,.56]], a:['',     ''],    dy:[24,22]},
  {n:'Giménez Orenga', h:'001/',  to:'es', k:'i', p:[[.36,.73],[.36,.72]], a:['',     ''],    dy:[0,0]},
  {n:'Ljungström', h:'004/',      to:'es', k:'i', p:[[.5,.82],[.5,.82]],   a:['',     ''],    dy:[0,0]}
];
const LAND = {kr:['South Korea',[.88,.1],[.86,.08]], uk:['UK',[.1,.14],[.14,.1]], ie:['Ireland',[.07,.53],[.11,.5]], es:['Spain',[.18,.9],[.2,.9]]};
function net(desk) {
  const W = desk ? 700 : 331, H = desk ? 440 : 470, j = desk ? 0 : 1, X = v => v * W, Y = v => v * H;
  const cx = X(.5), cy = Y(.5), vr = desk ? 40 : 34, o = desk ? 12 : 9;
  const L = (x1, y1, x2, y2, k) => (k === 'i' ? `<line class="fi" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"/>` : `<line class="fo" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"/>`);
  let b = '';
  FEL.forEach(e => { const [x, y] = e.p[j]; b += L(cx, cy, X(x), Y(y), e.k); });
  FEL.forEach(e => { const [x, y] = e.p[j], t = LAND[e.to][j + 1]; b += L(X(x), Y(y), X(t[0]), Y(t[1]), e.k); });
  b += `<circle class="fv" cx="${f1(cx)}" cy="${f1(cy)}" r="${vr}"/><text class="tx-s fc" x="${f1(cx)}" y="${f1(cy + 5)}" text-anchor="middle">Vienna</text>`;
  Object.values(LAND).forEach(l => { const [x, y] = l[j + 1], r = desk ? 11 : 10;
    b += `<circle class="fl" cx="${f1(X(x))}" cy="${f1(Y(y))}" r="${r}"/><text class="tx-s fc" x="${f1(X(x))}" y="${f1(Y(y) + r + 18)}" text-anchor="middle">${l[0]}</text>`; });
  FEL.forEach(e => { const [x, y] = e.p[j], a = e.a[j], dy = e.dy[j];
    b += `<a class="fa" href="${e.h}"><circle class="ff" cx="${f1(X(x))}" cy="${f1(Y(y))}" r="${desk ? 7 : 6}"/><text class="tx-s fm" x="${f1(a === 'end' ? X(x) - o : X(x) + o)}" y="${f1(dy ? Y(y) + dy : Y(y) - (desk ? 10 : 8))}"${a ? ' text-anchor="end"' : ''}>${e.n}</text></a>`; });
  return `<svg data-fit class="fn ${desk ? 'dk' : 'ph'}" viewBox="0 0 ${W} ${H}" aria-hidden="true">${b}</svg>`;
}
const LIST = [['Karen Giménez Orenga','Valencia → MedUni Wien','5 months'],['Leonardo Vincenzi','MedUni Wien → Cambridge','5 months'],
  ['Daniel García de Otazo','TU Wien → Daejeon, South Korea','6 months'],['Maria Ljungström','Valencia → MedUni Wien','6 months'],
  ['Jordan McGing','Oxford → MedUni Wien','5 months'],['Magdalena Eitenberger','University of Vienna → UC Dublin','6 months']];
const fig = `<figure class="fnet" aria-label="Three fellows go from Vienna: Daniel García de Otazo to Daejeon, South Korea, Leonardo Vincenzi to Cambridge, UK, Magdalena Eitenberger to Dublin, Ireland. Three come to Vienna: Karen Giménez Orenga and Maria Ljungström from Valencia, Spain, Jordan McGing from Oxford, UK.">
          ${net(false)}
          ${net(true)}
          <figcaption class="fk"><span><i class="ki"></i>into Vienna</span><span><i class="ko"></i>out of Vienna</span></figcaption>
          <ol class="fls">${LIST.map(r => `<li><b>${r[0]}</b><span>${r[1]}</span><span>${r[2]}</span></li>`).join('')}</ol>
        </figure>`;
let s = fs.readFileSync(f, 'utf8');
const re = /<figure class="(?:oi|fnet)"[\s\S]*?<\/figure>/;
if (!re.test(s)) throw new Error('Figur nicht gefunden');
s = s.replace(re, () => fig);
fs.writeFileSync(f, s);
console.log('Fellowships-Netz neu: fellowships/');
