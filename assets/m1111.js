/* Handy-Feinschliff 11.11.2026: baut einzelne Seiten am Handy um (Projekt-/Personenseiten, Tabellen, Kopfzeilen-Punkte, News). Nur bis 899 px; ohne JavaScript bleibt die bisherige Seite. */
(function(){
if(innerWidth>899)return;
function run(){
 // Startseite: „Impact so far“ → „Impact“
 var g=document.querySelector('.b3 .sent .kw .g');if(g)g.remove();
 // Kopfzeile mit Punkten
 var sib=document.querySelector('.sib'),hd=document.querySelector('.sub-hd');
 if(sib&&hd){var nav=document.createElement('nav');nav.className='pv-nav';nav.setAttribute('aria-label',sib.getAttribute('aria-label')||'');
  sib.querySelectorAll('a:not(.sib-up)').forEach(function(a){var b=document.createElement('a');b.href=a.href;b.setAttribute('aria-label',a.textContent);if(a.hasAttribute('aria-current'))b.setAttribute('aria-current','page');nav.appendChild(b);});
  hd.appendChild(nav);}
 // Projektseite PQ-A
 var cur=sib&&sib.querySelector('[aria-current]');
 var proj=document.querySelector('.cols.proj .head .big');
 if(proj&&cur&&/^[0-9]{3}$/.test(cur.textContent.trim())){var p=document.createElement('p');p.className='big pv-num';p.textContent=cur.textContent.trim();proj.parentNode.insertBefore(p,proj);p.style.margin='0';}
 // Personen PE-A
 var per=document.querySelector('.cols.person');
 if(per){
  var name=(per.querySelector('.big')||{}).textContent||'';var his=/Martin/.test(name);
  var facts=[].map.call(per.querySelectorAll('.hsub>span:not(.sr)'),function(s){return s.textContent;});
  var quote=per.querySelector('blockquote');
  var story=[].filter.call(per.querySelectorAll('p.lead'),function(p){return !p.closest('blockquote');});
  var fam=quote&&/her father|her mother|family/i.test(quote.textContent);
  var acc=document.createElement('div');acc.className='acc';
  function row(t,html){var d=document.createElement('details');d.innerHTML='<summary>'+t+'</summary><div class="ac-b">'+html+'</div>';acc.appendChild(d);}
  row('At a glance','<p>'+facts.join('<br>')+'</p>');
  row(his?'His story':'Her story',story.map(function(p){return '<p>'+p.innerHTML+'</p>';}).join(''));
  if(quote)row(fam?'In her family’s words':(his?'In his words':'In her words'),'<p>'+quote.querySelector('p').innerHTML+'</p><p>'+((quote.querySelector('cite')||{}).textContent||'')+'</p>');
  var pic=per.querySelector('.pic');
  [].slice.call(per.children).forEach(function(c){if(c!==pic&&!c.classList.contains('head'))c.remove();});
  per.appendChild(acc);
 }
 // Resources: News-Zeile
 var nws=document.querySelector('.ri.nws');
 if(nws){var t=(nws.querySelector('.np')||{}).textContent||'';var m=t.match(/·\s*([^↗︎]+)/);
  var s=document.createElement('span');s.className='pv-news';s.innerHTML='<span class="pv-btn">News</span><span class="pv-date">'+(m?m[1].trim():'')+'</span>';
  var pl=document.createElement('span');pl.className='pv-plus';pl.textContent='+';nws.appendChild(s);nws.appendChild(pl);}
 // Striche von Rand zu Rand
 document.querySelectorAll('.acc,.rl,.ins,.lv-t,.steps,.how,.cont,.sites,.wish,.sel,.tl,.gh,.list').forEach(function(el){
  if(el.closest('.stage'))return;
  var r=el.getBoundingClientRect();if(!r.width)return;var L=r.left,R=innerWidth-r.right;if(L<1&&R<1)return;
  var cs=getComputedStyle(el);el.style.marginLeft=(parseFloat(cs.marginLeft)-L)+'px';el.style.marginRight=(parseFloat(cs.marginRight)-R)+'px';
  var kids=el.classList.contains('gh')?[el]:[].slice.call(el.children);
  if(el.classList.contains('gh')){el.style.paddingLeft=(parseFloat(cs.paddingLeft)+L)+'px';el.style.paddingRight=(parseFloat(cs.paddingRight)+R)+'px';return;}
  kids.forEach(function(c){var k=getComputedStyle(c);c.style.boxSizing='border-box';c.style.paddingLeft=(parseFloat(k.paddingLeft)+L)+'px';c.style.paddingRight=(parseFloat(k.paddingRight)+R)+'px';});
 });
}
if(document.fonts)document.fonts.load('600 24px "Source Sans 3"').then(function(){dispatchEvent(new Event('resize'));});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

(function(){
if(innerWidth>899)return;
var PLUS='+',ARR='<svg class="pv-ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>';
function row(n,t,s,icon,href){var a=document.createElement(href?'a':'div');if(href)a.href=href;a.className='pv-row'+(n===null?' nn':'');a.innerHTML=(n!==null?'<span class="pv-n">'+n+'</span>':'')+'<span class="pv-t">'+t+(s?'<span class="pv-s">'+s+'</span>':'')+'</span><span class="pv-i">'+(icon||'')+'</span>';return a;}
function det(n,t,body){var d=document.createElement('details');var s=document.createElement('summary');s.appendChild(row(n,t,'',PLUS));d.appendChild(s);var b=document.createElement('div');b.className='pv-d';b.innerHTML=body;d.appendChild(b);d.addEventListener('toggle',function(){s.querySelector('.pv-i').textContent=d.open?'–':'+';});return d;}
function fitH(h){h.innerHTML=h.innerHTML.replace(/<wbr\s*\/?>/g,'').replace(/<br\s*\/?>/g,' ').replace(/\s+/g,' ').trim();h.style.whiteSpace='nowrap';var cs=parseFloat(getComputedStyle(h).fontSize);var w=h.parentNode.clientWidth;if(h.scrollWidth>w){var n=cs*w/h.scrollWidth;if(n>=34){h.style.fontSize=Math.floor(n)+'px';}else{h.style.whiteSpace='normal';h.style.textWrap='balance';}}}
function run(){
 var path=location.pathname;
 // Unter-Unterseiten: Überschrift ohne komische Umbrüche
 document.querySelectorAll('.cols.proj .head h1.big,.cols.person .head h1.big').forEach(fitH);
 // Consolidation-Projekte wie die 7 Projekte
 if(/\/call\/00[34]\//.test(path)){
  var acc=document.querySelector('.cols.proj .acc');
  if(acc){var ds=acc.querySelectorAll('details');var per=ds[1]&&ds[1].querySelector('.ac-b p').innerHTML,fun=ds[2]&&ds[2].querySelector('.ac-b p').innerHTML;
   if(ds[1]&&ds[2]){ds[1].querySelector('summary').textContent='Period & funding';ds[1].querySelector('.ac-b p').innerHTML=per+'<br>'+fun;ds[2].remove();}}
  var cur=document.querySelector('.sib [aria-current]');var h=document.querySelector('.cols.proj .head h1.big');
  if(cur&&h&&!document.querySelector('.pv-num')){var p=document.createElement('p');p.className='big pv-num';p.style.margin='0';p.textContent=cur.textContent.trim();h.parentNode.insertBefore(p,h);fitH(h);}
 }
 // mecfs/: Tabelle zu den Personen
 var ppl=document.querySelector('ol.ins.ppl');
 if(ppl){var info={'Mila Hermisson':'Age 23 · ME/CFS since 2018','Carmen Rinnhofer':'Age 31 · ME/CFS since 2022','Martin Privec':'Age 32 · ME/CFS since 2017'};
  var tab=document.createElement('div');tab.className='pv-tab';var i=0;
  ppl.querySelectorAll('a').forEach(function(a){i++;tab.appendChild(row('0'+i,a.textContent,info[a.textContent]||'',ARR,a.getAttribute('href')));});
  ppl.replaceWith(tab);}
 // vienna/: Legende als Tabelle mit +
 var sites=document.querySelector('ul.sites');
 if(sites){var t=document.createElement('div');t.className='pv-tab';
  sites.querySelectorAll('li').forEach(function(li){t.appendChild(det(li.querySelector('.n').textContent,li.querySelector('.nm').innerHTML,li.querySelector('.ds').innerHTML));});
  sites.replaceWith(t);}
 var wish=document.querySelector('ol.wish');
 if(wish){var t2=document.createElement('div');t2.className='pv-tab';var k=0;wish.querySelectorAll('li').forEach(function(li){k++;t2.appendChild(row(String(k),li.innerHTML,'',''));});wish.replaceWith(t2);}
 // patients/: Jury als Punktmatrix
 var seats=document.querySelector('.seats');
 if(seats){var cols=[].map.call(seats.querySelectorAll('.col'),function(c){return {d:c.querySelector('.jh b').textContent,c:c.querySelector('.jh span').textContent,m:[].map.call(c.querySelectorAll('li>span'),function(s){return s.firstChild.textContent.replace(', chair','').trim();})};});
  var names=[];cols.forEach(function(c){c.m.forEach(function(n){if(names.indexOf(n)<0)names.push(n);});});
  var ex='Keith Geraghty';names=names.filter(function(n){return n!==ex;}).concat([ex]);
  var mx=document.createElement('div');mx.className='pv-mx';mx.innerHTML='<span class="h"></span>'+cols.map(function(c){return '<span class="h">'+c.d+'<br>'+c.c.replace('Consolidation Call','Consol.')+'</span>';}).join('');
  names.forEach(function(n){mx.innerHTML+='<span class="nm'+(n===ex?' ex':'')+'">'+n+'</span>'+cols.map(function(c){return '<span class="c'+(n===ex?' ex':'')+'">'+(c.m.indexOf(n)>=0?'<i class="dt"></i>':'<i class="no"></i>')+'</span>';}).join('');});
  seats.replaceWith(mx);var cap=document.querySelector('.seat-cap');if(cap)cap.innerHTML='<span style="color:#005b94">●</span> sat in this jury meeting · <span style="color:#ec6a61">●</span> expert by experience · international jury of WWTF';}
 // fellowships/: B, Schrift statt Netz
 var fnet=document.querySelector('figure.fnet');
 if(fnet){var ins=[],outs=[];fnet.querySelectorAll('ol.fls li').forEach(function(li){var sp=li.querySelectorAll('span');var r={n:li.querySelector('b').textContent,w:sp[0].textContent,m:sp[1]?sp[1].textContent:''};(/→.*(Wien|Vienna)/.test(r.w)?ins:outs).push(r);});
  var box=document.createElement('div');
  [['into Vienna',ins],['out of Vienna',outs]].forEach(function(g){var h=document.createElement('p');h.className='pv-th';h.style.margin='28px 0 0';h.innerHTML='<span style="color:#9d9d9c">'+g[1].length+'</span> '+g[0];box.appendChild(h);var t=document.createElement('div');t.className='pv-tab';g[1].forEach(function(r){t.appendChild(row(null,r.n,r.w+' · '+r.m,''));});box.appendChild(t);});
  fnet.replaceWith(box);}
 // beginning/: Impact + Mosaik-Platzhalter
 if(/\/beginning\//.test(path)){var hb=document.querySelector('.head h1.big');if(hb)hb.textContent='Impact';
  var body=document.querySelector('.cols .body');var sec=document.createElement('div');
  sec.innerHTML='<h2 class="sh">Impact so far</h2><div class="pv-mo"><div class="w"><b>“Quote tbc”</b><span>Voice from the field · placeholder</span></div><div><b>What others say</b><span>Science for ME · tbc</span></div><div><b>Articles</b><span>Press · tbc</span></div><div><b>WE&amp;ME Award</b><span>from 2027</span></div><div><b>Beyond Vienna</b><span>WE&amp;ME calls 2026–2029</span></div><div class="w"><b>International view</b><span>tbc</span></div></div>';
  body.insertBefore(sec,body.querySelector('.sh'));}
 // Striche von Rand zu Rand für die neuen Tabellen
 document.querySelectorAll('.pv-tab,.pv-mx').forEach(function(el){var r=el.getBoundingClientRect();var L=r.left,R=innerWidth-r.right;if(L<1)return;el.style.marginLeft=(-L)+'px';el.style.marginRight=(-R)+'px';
  var kids=el.classList.contains('pv-mx')?[]:[].slice.call(el.children);kids.forEach(function(c){var tgt=c.tagName==='DETAILS'?c.querySelector('.pv-row'):c;tgt.style.paddingLeft=L+'px';tgt.style.paddingRight=R+'px';if(c.tagName==='DETAILS'){c.querySelector('.pv-d').style.paddingLeft=(L+48)+'px';c.querySelector('.pv-d').style.paddingRight=R+'px';}});
  if(el.classList.contains('pv-mx')){el.style.paddingLeft=L+'px';el.style.paddingRight=R+'px';}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,0);});else setTimeout(run,0);
if(document.fonts)document.fonts.ready.then(function(){document.querySelectorAll('.cols.proj .head h1.big,.cols.person .head h1.big').forEach(function(h){h.style.fontSize='';fitH(h);});});
})();

(function(){
if(innerWidth>899)return;
function bleed(el,inner){var r=el.getBoundingClientRect();var L=r.left,R=innerWidth-r.right;if(L<1)return;el.style.marginLeft=(-L)+'px';el.style.marginRight=(-R)+'px';inner.forEach(function(c){c.style.paddingLeft=L+'px';c.style.paddingRight=R+'px';});}
function run(){
 var path=location.pathname;
 // Wien: Legenden-Tabelle weg
 if(/\/vienna\//.test(path))document.querySelectorAll('.pv-tab').forEach(function(t){if(t.querySelector('details'))t.remove();});
 // Consolidation: WWTF-Link weg, Team offen
 if(/\/call\/00[34]\//.test(path)){document.querySelectorAll('.cols.proj .lead a.op').forEach(function(a){var p=a.previousSibling;if(p&&p.nodeName==='BR')p.remove();a.remove();});var d=document.querySelector('.cols.proj .acc details');if(d)d.open=true;}
 document.querySelectorAll('.pv-mx .h').forEach(function(h){var t=h.innerHTML.split('<br>')[0];h.innerHTML=t;});
 // patients: What patients added als Kreise
 var rv=document.querySelector('figure.rv .dots');
 if(rv){var g=document.createElement('div');g.className='pv-dots';rv.querySelectorAll('span').forEach(function(s){var i=document.createElement('i');if(s.classList.contains('ex'))i.className='ex';g.appendChild(i);});rv.replaceWith(g);
  var cap=document.querySelector('figure.rv .seat-cap');if(cap)cap.innerHTML='<span style="color:#005b94">●</span> scientists and clinicians · <span style="color:#ec6a61">●</span> Science for ME · Consolidation Call 2026, 41 reviews of 6 proposals';}
 // fellowships: B mit Knopf
 if(/\/fellowships\//.test(path)){
  var heads=[].filter.call(document.querySelectorAll('.pv-th'),function(h){return /into Vienna|out of Vienna/.test(h.textContent);});
  if(heads.length===2){var box=heads[0].parentNode;var rows=[];box.querySelectorAll('.pv-row').forEach(function(r){rows.push({n:r.querySelector('.pv-t').firstChild.textContent,s:r.querySelector('.pv-s').textContent});});
   var nb=document.createElement('div');
   function grp(cls,lb,num,list,arr){var d=document.createElement('div');d.className='pv-dir '+cls;d.innerHTML='<div class="hdr"><span class="lb">'+lb+'</span><span class="num">'+num+'</span></div>';
    list.forEach(function(r){var parts=r.s.split(' · ');var route=parts[0].split('→').map(function(x){return x.trim();});var inn=cls==='green';var city=(inn?route[0]:route[1]).replace(/^UC /,'');var inst=inn?route[1]:'from '+route[0];
     var FN={'Karen Giménez Orenga':'001','Leonardo Vincenzi':'002','Daniel García de Otazo':'003','Maria Ljungström':'004','Jordan McGing':'005','Magdalena Eitenberger':'006'};var e=document.createElement(FN[r.n]?'a':'div');if(FN[r.n])e.href=FN[r.n]+'/';e.className='pv-row nn';e.style.borderBottom='0';e.style.borderTop='1px solid #e4e4e3';e.innerHTML='<span class="pv-t">'+city+'<span class="pv-s">'+r.n+' · '+inst+' · '+parts[1]+'</span></span><span class="pv-i">'+arr+'</span>';d.appendChild(e);});
    return d;}
   var ins=rows.filter(function(r){return /→.*(Wien|Vienna)/.test(r.s);}),outs=rows.filter(function(r){return !/→.*(Wien|Vienna)/.test(r.s);});
   var g1=grp('green','Come to Vienna','3 in',ins,'<svg class="pv-ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>'),g2=grp('','Go from Vienna','3 out',outs,'<svg class="pv-ar ur" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>');g2.style.borderBottom='1px solid #181715';
   nb.appendChild(g1);nb.appendChild(g2);box.replaceWith(nb);
   [g1,g2].forEach(function(g){bleed(g,[].slice.call(g.children));});}
 }
 // Resources: News wie RS-3 (zu) und RS-4 (offen)
 var nws=document.querySelector('.ri.nws');
 if(nws){var n=nws.querySelector('.n');if(n)n.remove();
  var links=[].map.call(nws.querySelectorAll('.nk a'),function(a){return {h:a.getAttribute('href'),t:a.textContent.trim()};});var npl=nws.querySelector('.np');var all=npl?npl.getAttribute('href'):'';
  // News öffnet sich als Knopf: die Pillenform des NEWS-Knopfs wächst, erst am Ende werden die Ecken eckig und nur die News-Fläche füllt (11.11.)
  var news=nws.querySelector('.pv-news'),plus=nws.querySelector('.pv-plus');nws.classList.add('pv-nw');
  var bg=document.createElement('div');bg.className='pv-bg';bg.setAttribute('aria-hidden','true');
  var hd=document.createElement('div');hd.className='pv-nhd';hd.setAttribute('role','button');hd.tabIndex=0;hd.setAttribute('aria-expanded','false');hd.appendChild(news);hd.appendChild(plus);
  var body=document.createElement('div');body.className='pv-nb';body.hidden=true;
  body.innerHTML=links.map(function(k){return '<a class="hl" href="'+k.h+'" target="_blank" rel="noopener"><span class="t">'+k.t+'<span class="s">Science for ME · News in Brief</span></span><span class="i"><svg class="pv-ar ur" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></span></a>';}).join('')+'<a class="all" href="'+all+'" target="_blank" rel="noopener">All news <svg class="pv-ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg></a>';
  nws.insertBefore(bg,nws.firstChild);nws.appendChild(hd);nws.appendChild(body);
  var busy=false,rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function geo(){var b=nws.getBoundingClientRect(),k=news.querySelector('.pv-btn').getBoundingClientRect();return {t:k.top-b.top,l:k.left-b.left,r:b.right-k.right,bo:b.bottom-k.bottom,rad:k.height/2};}
  function tog(){if(busy)return;var open=body.hidden;busy=true;hd.setAttribute('aria-expanded',String(open));plus.textContent=open?'–':'+';
   if(open)body.hidden=false;
   var g=geo(),from='inset('+g.t+'px '+g.r+'px '+g.bo+'px '+g.l+'px round '+g.rad+'px)',mid='inset(0px 0px 0px 0px round '+g.rad+'px)',to='inset(0px 0px 0px 0px round 0px)';
   function done(){bg.style.clipPath=open?to:from;if(!open)body.hidden=true;busy=false;}
   if(rm||!bg.animate){done();return;}
   var kf=open?[{clipPath:from,easing:'cubic-bezier(.45,0,.2,1)'},{clipPath:mid,offset:.78,easing:'ease-out'},{clipPath:to}]:[{clipPath:to,easing:'ease-in'},{clipPath:mid,offset:.22,easing:'cubic-bezier(.4,0,.2,1)'},{clipPath:from}];
   var an=bg.animate(kf,{duration:open?750:450});
   if(open)body.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:320,delay:330,easing:'ease-out',fill:'backwards'});
   else body.animate([{opacity:1},{opacity:0}],{duration:180,fill:'forwards'});
   bg.style.clipPath=open?to:from;
   an.finished.then(function(){body.getAnimations().forEach(function(x){x.cancel();});done();},done);}
  hd.addEventListener('click',tog);hd.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tog();}});
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,60);});else setTimeout(run,60);
function bk(){document.querySelectorAll('a.bk').forEach(function(a){if(a.dataset.pv)return;a.dataset.pv='1';a.innerHTML=a.innerHTML.replace(/^\s*→\s*/,'<svg class="pv-ar sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg> ');});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bk);else bk();
})();
/* Startseite Handy: gleiche sichtbare Abstände WWTF-Zeichen → Satz → Tabelle → Impact → Resources (11.11.).
   Gemessen an der Schrift selbst (Versalhöhe, Grundlinie; Source Sans 3: Oberlänge 1,024, Unterlänge 0,4, Versalhöhe 0,66 em). */
(function(){
 if(innerWidth>899||!document.querySelector('.stage .sent.b1'))return;
 var G=26;
 var cv=document.createElement('canvas').getContext('2d');
 function box(el){var cs=getComputedStyle(el);var fs=parseFloat(cs.fontSize);cv.font=cs.fontWeight+' '+fs+'px '+cs.fontFamily;var m=cv.measureText('EH');var asc=m.fontBoundingBoxAscent,cap=m.actualBoundingBoxAscent;
  var r=document.createRange();r.selectNodeContents(el);var rs=[].slice.call(r.getClientRects()).filter(function(x){return x.height>fs*.5;});
  var top=Math.min.apply(null,rs.map(function(x){return x.top;})),bot=Math.max.apply(null,rs.map(function(x){return x.bottom;}));var desc=m.fontBoundingBoxDescent;
  return {cap:top+(asc-cap),base:bot-desc};}
 function eq(){
  var logo=document.querySelector('.wwtf-mark'),s=document.querySelector('.stage .sent.b1'),lh=document.querySelector('.stage .lh'),b3s=document.querySelector('.stage .b3 .sent'),rb=document.querySelector('.stage .rb');
  if(!logo||!s||!lh||!b3s||!rb)return;
  [s,lh,b3s,rb].forEach(function(e){e.style.marginTop='0px';});
  var list=document.querySelector('.stage .list');
  var a=G-(box(s).cap-logo.getBoundingClientRect().bottom);s.style.marginTop=a+'px';
  var b=G-(box(lh).cap-box(s).base);lh.style.marginTop=b+'px';
  var c=G-(box(b3s).cap-list.getBoundingClientRect().bottom);b3s.style.marginTop=c+'px';
  var d=G-(rb.getBoundingClientRect().top-box(b3s).base);rb.style.marginTop=d+'px';
 }
 function later(){requestAnimationFrame(function(){requestAnimationFrame(eq);});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',later);else later();
 if(document.fonts)document.fonts.ready.then(later);
 addEventListener('load',later);addEventListener('resize',later);
})();
