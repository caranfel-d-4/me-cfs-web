// Scrollzeichen (Canvas „WMEW Scrollzeichen“): setzt das Zeichen in jedes .scroll-cue ein.
// Gewählt ist C (gerader Pfeil, seit 07.10.). J (Fragezeichen, Stiel endet als Pfeil) bleibt als Alternative: nur CUE ändern.
(function(){
  var CUE='C';
  var V={
    J:{box:'0 4 48 52',d:'M15 14 C15 4 33 3 33 14 C33 22 24 23 24 32 V48',h:'M18 42 L24 48 L30 42'},
    C:{box:'0 0 48 56',d:'M24 4 V52',h:'M18 46 L24 52 L30 46'}
  }[CUE];
  var NS='http://www.w3.org/2000/svg';
  document.querySelectorAll('.scroll-cue').forEach(function(el){
    if(el.querySelector('svg')) return;
    var svg=document.createElementNS(NS,'svg');
    svg.setAttribute('viewBox',V.box); svg.setAttribute('aria-hidden','true');
    [['d',V.d],['h',V.h]].forEach(function(p){
      var path=document.createElementNS(NS,'path');
      path.setAttribute('class',p[0]); path.setAttribute('d',p[1]); path.setAttribute('pathLength','1');
      svg.appendChild(path);
    });
    el.insertBefore(svg,el.firstChild);
  });
})();
