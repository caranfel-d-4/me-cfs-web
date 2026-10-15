// Fußzeile der P1-Unterseiten: schiebt den Satz so, dass das aktuelle Satzglied ein Fünftel von links steht.
// Beim Laden gleitet er vom vorigen Satzglied her ein (nicht bei „Bewegung reduzieren“). Ohne Skript lässt sich die Zeile seitlich scrollen.
(function(){
  var b=document.querySelector('.sbar'); if(!b) return;
  var w=b.querySelector('.sb-win'), t=b.querySelector('.sb-trk'), links=[].slice.call(t.querySelectorAll('a'));
  var cur=t.querySelector('.cur'), at=cur||links[0], rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  b.classList.add('js');
  function go(el,anim){ t.style.transition=anim&&!rm?'':'none'; t.style.transform='translateX('+Math.min(0,w.clientWidth*.2-el.offsetLeft)+'px)'; }
  var prev=cur&&links[links.indexOf(cur)-1];
  function start(){
    if(prev&&!rm){ go(prev,false); t.getBoundingClientRect(); requestAnimationFrame(function(){ go(at,true); }); }
    else go(at,false);
  }
  start();
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(function(){ go(at,false); });
  addEventListener('resize',function(){ go(at,false); });
  // Mit der Tastatur: das fokussierte Satzglied ins Bild holen
  t.addEventListener('focusin',function(e){ if(e.target.tagName==='A') go(e.target,true); });
  t.addEventListener('focusout',function(){ setTimeout(function(){ if(!t.contains(document.activeElement)) go(at,true); },0); });
})();
