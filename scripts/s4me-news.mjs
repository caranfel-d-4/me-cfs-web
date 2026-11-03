// News-Zeile auf resources/ aus Science for ME „Weekly ME News in Brief“ (Entwurf P, 03.11.2026).
// Läuft jeden Montag über GitHub Actions (.github/workflows/s4me-news.yml), lokal: node scripts/s4me-news.mjs
//
// Regeln (Carolina, 03.11.2026):
// - Quelle nur S4ME, alle Links führen zur Forenseite FORUM, keine Originalquellen, keine Termine.
// - Datum = Startdatum des neuesten Monatsthreads, wie es in der Forenübersicht steht.
// - Bis zu 3 Schlagworte = fett gesetzter Titelanfang unter „ME/CFS research“ im neuesten Wochenbeitrag.
//   Gibt es dort weniger als 3, wird mit Überschriften aus „Research news and commentary“ aufgefüllt,
//   die ME/CFS nennen (ohne API ist „relevant“ nur über diese Regel möglich).
// - Liest nur /forums/ und /threads/ (robots.txt von s4me.info sperrt /posts/).
// - Findet der Job nichts Brauchbares, bricht er mit Fehler ab: die Seite bleibt, GitHub schickt eine Fehler-E-Mail.

import { readFile, writeFile } from "node:fs/promises";

const BASE = "https://s4me.info";
const FORUM = `${BASE}/forums/weekly-me-news-in-brief.102/`;
const PAGE = new URL("../resources/index.html", import.meta.url);
const UA = "me-cfs-web news job (+https://caranfel-d-4.github.io/me-cfs-web/resources/)";
const AUTHOR = "S4ME News";
const MAX = 3;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const get = async (url) => {
  const r = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "en" } });
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  return r.text();
};
const decode = (s) => s
  .replace(/<[^>]+>/g, "")
  .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, "&")
  .replace(/\s+/g, " ").trim();
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const isMe = (s) => /ME\/CFS|myalgic encephalomyelitis|\bME\b/i.test(s);

// 1. Forenübersicht: Monatsthreads „News in Brief – <Monat> <Jahr>“, neuester zuerst (nach Startdatum)
async function threads() {
  const html = await get(FORUM);
  const out = [];
  const re = /<div class="structItem structItem--thread[\s\S]*?href="(\/threads\/news-in-brief-[^"]+?)\/?(?:preview)?"[\s\S]*?<time[^>]*datetime="([^"]+)"/g;
  for (const m of html.matchAll(re)) {
    const path = m[1].replace(/\/preview$/, "").replace(/\/$/, "") + "/";
    if (!out.some((t) => t.path === path)) out.push({ path, start: new Date(m[2]) });
  }
  if (!out.length) throw new Error("Keine News-in-Brief-Threads in der Forenübersicht gefunden (Aufbau geändert?)");
  return out.sort((a, b) => b.start - a.start);
}

// 2. Thread: letzte Seite laden, Beiträge von „S4ME News“ mit Forschungsteil suchen, neuester zuerst
async function weeklyPosts(path) {
  const first = await get(BASE + path);
  const own = new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "page-(\\d+)", "g"); // nur Seitenlinks dieses Threads
  const pages = [...first.matchAll(own)].map((m) => +m[1]);
  const last = pages.length ? Math.max(...pages) : 1;
  const html = last > 1 ? await get(`${BASE}${path}page-${last}`) : first;
  const html2 = last > 1 ? first : "";
  const posts = [];
  for (const doc of [html, html2]) {
    for (const part of doc.split('<article class="message ').slice(1)) {
      const author = (part.match(/data-author="([^"]*)"/) || [])[1];
      const id = (part.match(/data-content="post-(\d+)"/) || [])[1];
      const w = part.indexOf('<div class="bbWrapper">');
      if (author !== AUTHOR || !id || w < 0) continue;
      const body = part.slice(w, part.indexOf("</article>") > 0 ? part.indexOf("</article>") : undefined);
      if (posts.some((x) => x.id === +id)) continue;
      if (/<u>\s*ME\/CFS research\s*<\/u>|<b>\s*Research\s*<\/b>/i.test(body)) posts.push({ id: +id, body });
    }
  }
  return posts.sort((a, b) => b.id - a.id);
}

// 3. Schlagworte aus einem Beitrag
function keywords(body) {
  const lines = body.split(/<br\s*\/?>/i);
  const studies = [], articles = [];
  let sec = "";
  for (const raw of lines) {
    const u = raw.match(/<u>([\s\S]*?)<\/u>/i);
    const t = decode(raw);
    if (u) { sec = decode(u[1]).toLowerCase(); continue; }
    if (/^<b>\s*research\s*<\/b>\s*$/i.test(raw.trim())) { sec = "research"; continue; }
    if (/^research news and commentary$/i.test(t) || /<b>\s*Research news and commentary/i.test(raw)) { sec = "commentary"; }
    const b = raw.trim().match(/^<b>([\s\S]*?)<\/b>([\s\S]*)$/i);
    if (!b) continue;
    const bold = decode(b[1]), rest = decode(b[2]);
    if (sec === "me/cfs research" && bold) studies.push(bold.replace(/[\s:,;—–-]+$/, ""));
    else if (sec === "commentary" && rest && !/^research news and commentary$/i.test(bold) && isMe(bold + " " + rest) && rest.length <= 100 && !/[.!?]\s+\S/.test(rest)) articles.push(rest); // nur echte Überschriften, keine Sätze
  }
  return [...studies, ...articles].filter((x, i, a) => x.length > 3 && a.indexOf(x) === i).slice(0, MAX);
}

const fmt = (d) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", day: "numeric", month: "numeric", year: "numeric" })
    .formatToParts(d).map((x) => [x.type, x.value]));
  return `${+p.day} ${MONTHS[+p.month - 1]} ${p.year}`;
};

const ts = await threads();
let hit = null;
for (const t of ts.slice(0, 2)) {           // neuester Monatsthread, sonst der davor (z. B. wenn der neue noch leer ist)
  for (const p of await weeklyPosts(t.path)) {
    const k = keywords(p.body);
    if (k.length) { hit = { thread: t, post: p.id, k }; break; }
  }
  if (hit) break;
}
if (!hit) throw new Error("Kein Wochenbeitrag mit ME/CFS-Studien gefunden (Aufbau geändert?)");

const date = fmt(hit.thread.start);
const row = `<!--news--><li class="ri nws"><a class="np" href="${FORUM}" target="_blank" rel="noopener">News · ${date}<span aria-hidden="true"> ↗</span></a>`
  + `<div class="nk">${hit.k.map((k) => `<a href="${FORUM}" target="_blank" rel="noopener"><span class="u">${esc(k)}</span></a>`).join("")}</div></li><!--/news-->`;

const page = await readFile(PAGE, "utf8");
if (!/<!--news-->[\s\S]*?<!--\/news-->/.test(page)) throw new Error("Platzhalter <!--news--> fehlt in resources/index.html");
const next = page.replace(/<!--news-->[\s\S]*?<!--\/news-->/, row);
if (next !== page) await writeFile(PAGE, next);
console.log(`${date} · ${hit.thread.path} · post ${hit.post}\n- ${hit.k.join("\n- ")}\n${next === page ? "unverändert" : "aktualisiert"}`);
