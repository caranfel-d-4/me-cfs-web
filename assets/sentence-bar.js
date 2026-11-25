// Fußzeile der P1-Unterseiten: scrollt den Satz so, dass das aktuelle Satzglied direkt am linken Seitenrand beginnt (am Ende bündig rechts).
// Die Zeile bleibt seitlich scrollbar (Wischen, Trackpad, Mausrad), damit jedes Satzglied erreichbar ist.
// Gleiten nur, wenn man vom vorigen Satzglied kommt (nicht von Home oder einem Sprung, nicht bei „Bewegung reduzieren“).
(function(){
  var b=document.querySelector('.sbar'); if(!b) return;
  var w=b.querySelector('.sb-win'), t=b.querySelector('.sb-trk'), links=[].slice.call(t.querySelectorAll('a'));
  var cur=t.querySelector('.cur'), at=cur||links[0], rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function go(el,anim){ w.scrollTo({left:Math.max(0,el.offsetLeft),behavior:anim&&!rm?'smooth':'auto'}); }
  var prev=cur&&links[links.indexOf(cur)-1], ref=document.referrer.split(/[?#]/)[0];
  var fromPrev=prev&&ref&&ref.replace(/index\.html$/,'')===prev.href.replace(/index\.html$/,'');
  if(fromPrev&&!rm){ go(prev,false); requestAnimationFrame(function(){ go(at,true); }); }
  else go(at,false);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(function(){ if(!fromPrev) go(at,false); });
  addEventListener('resize',function(){ go(at,false); });
  // Blass an den Rändern nur, wo der Satz weitergeht (siehe sentence-bar.css)
  function fade(){ var x=w.scrollLeft, max=w.scrollWidth-w.clientWidth;
    var clean=x<=1||links.some(function(a){ return Math.abs(a.offsetLeft-x)<2; });
    w.classList.toggle("fl",!clean); w.classList.toggle("fr",x<max-1); }
  w.addEventListener("scroll",fade,{passive:true}); addEventListener("resize",fade); fade();
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fade);
  // Mausrad (senkrecht) schiebt die Zeile seitlich
  w.addEventListener('wheel',function(e){ if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){ w.scrollLeft+=e.deltaY; e.preventDefault(); } },{passive:false});
  // Mit der Tastatur: das fokussierte Satzglied ins Bild holen
  t.addEventListener('focusin',function(e){ if(e.target.tagName==='A') go(e.target,true); });
})();

/* Lesebalken der Kopfzeile (03.11.2026): Anteil der gelesenen Seite als --rd auf .rd-bar */
(function(){
  var b=document.querySelector('.sub-hd .rd-bar');if(!b)return;
  var q=false;
  function upd(){q=false;var d=document.documentElement,max=d.scrollHeight-innerHeight;b.style.setProperty('--rd',max>0?Math.min(1,Math.max(0,scrollY/max)):0);}
  function req(){if(!q){q=true;requestAnimationFrame(upd);}}
  addEventListener('scroll',req,{passive:true});addEventListener('resize',req);upd();
})();

/* Nach-oben-Knopf (25.11.2026, Canvas „Nach oben mit Farbrahmen“, Variante C Dunkelblau):
   gefüllter Kreis, weißer Kopfzeilen-Pfeil nach oben. Erscheint, sobald man scrollt; sitzt rechts unten über der Satzleiste. */
(function(){
  if(!document.querySelector('.sub-hd'))return;
  var a=document.createElement('button');a.type='button';a.className='btt';a.setAttribute('aria-label','Back to top');
  a.innerHTML='<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V4M6 10l6-6 6 6"/></svg>';
  document.body.appendChild(a);
  var bar=document.querySelector('.sbar'),rm=matchMedia('(prefers-reduced-motion: reduce)'),q=false;
  function upd(){q=false;
    a.style.setProperty('--bb',(bar?bar.offsetHeight:0)+'px');
    a.classList.toggle('on',scrollY>40);}
  function req(){if(!q){q=true;requestAnimationFrame(upd);}}
  addEventListener('scroll',req,{passive:true});addEventListener('resize',req);upd();
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(upd);
  a.addEventListener('click',function(){scrollTo({top:0,behavior:rm.matches?'auto':'smooth'});
    var h=document.querySelector('.sub-hd .home-btn');if(h)h.focus({preventScroll:true});});
})();
