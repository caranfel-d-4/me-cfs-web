/* Schrift in Grafiken in festen px (01.11.2026): setzt --k = SVG-Einheiten pro Bildschirm-px
   auf jedem svg[data-fit], damit font-size:calc(18px*var(--k)) auf dem Schirm genau 18 px ergibt. */
(function(){
  var list=[].slice.call(document.querySelectorAll('svg[data-fit]'));
  function set(s){var w=s.getBoundingClientRect().width;if(!w)return;var vb=s.viewBox.baseVal;s.style.setProperty('--k',(vb.width/w).toFixed(4));}
  list.forEach(set);
  if('ResizeObserver' in window){var ro=new ResizeObserver(function(es){es.forEach(function(e){set(e.target);});});list.forEach(function(s){ro.observe(s);});}
  else addEventListener('resize',function(){list.forEach(set);});
})();
