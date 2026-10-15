// Hover-Strich der Satzglieder auf ganze Bildschirmpixel legen. Stärke und Lage ergeben sich aus der eingepassten
// Schrift (--fs) und sind meist krumm (z. B. 1,5 px auf y = 309,52). Je nach Zeile wird der Strich dann auf einen
// oder zwei Pixel verteilt und wirkt unterschiedlich dick. Hier: Stärke runden (--ul), Lage um --us verschieben.
(function(){
  var raf=0;
  function snap(){
    raf=0;
    var dpr=window.devicePixelRatio||1;
    document.querySelectorAll('.kw').forEach(function(kw){
      var els=kw.querySelector('.u')?kw.querySelectorAll('.u'):[kw];
      Array.prototype.forEach.call(els,function(el){
        // Übergang kurz aus, sonst liefert getComputedStyle den alten, noch animierten Wert
        el.style.transition='none';el.style.removeProperty('--ul');el.style.removeProperty('--us');
        var cs=getComputedStyle(el);
        var t=parseFloat(cs.backgroundSize.split(' ')[1]);
        var m=/100% - ([\d.]+)px/.exec(cs.backgroundPositionY);
        var r=el.getClientRects()[0];
        if(!t||!m||!r){el.style.removeProperty('transition');return;}
        var tt=Math.max(1,Math.floor(t*dpr+.05))/dpr; // abrunden: lieber fein als dick
        var top=r.bottom-tt-parseFloat(m[1]);
        el.style.setProperty('--ul',tt+'px');
        el.style.setProperty('--us',(Math.round(top*dpr)/dpr-top).toFixed(3)+'px');
        void el.offsetWidth;el.style.removeProperty('transition');
      });
    });
  }
  function later(){if(!raf)raf=requestAnimationFrame(function(){requestAnimationFrame(snap);});}
  // Neu ausrichten, wenn die Einpassung (--fs im style-Attribut) oder die Fenstergröße die Lage verändert
  new MutationObserver(function(ms){
    for(var i=0;i<ms.length;i++){var c=ms[i].target.classList;if(!c.contains('kw')&&!c.contains('u')){later();return;}}
  }).observe(document.documentElement,{attributes:true,attributeFilter:['style','class'],subtree:true});
  window.addEventListener('load',later);
  window.addEventListener('resize',later);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(later);
  later();
})();
