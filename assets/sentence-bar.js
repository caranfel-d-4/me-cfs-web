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
  // Mausrad (senkrecht) schiebt die Zeile seitlich
  w.addEventListener('wheel',function(e){ if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){ w.scrollLeft+=e.deltaY; e.preventDefault(); } },{passive:false});
  // Mit der Tastatur: das fokussierte Satzglied ins Bild holen
  t.addEventListener('focusin',function(e){ if(e.target.tagName==='A') go(e.target,true); });
})();
