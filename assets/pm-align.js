/* Personenseiten (02.11.2026, nach ihrer Handy-Skizze): mittleres Etikett „ME/CFS since …“ beginnt genau unter dem WWTF-Zeichen der Kopfzeile,
   „Age“ bleibt links, „… years“ rechtsbündig. Computer und Handy gleich. Ohne Skript oder wenn es zu eng wird: Aufteilung aus person.css. */
(function(){
  var p=document.querySelector('.hsub.pm'),m=document.querySelector('.sub-mark');
  if(!p||!m)return;
  var s=p.querySelectorAll('span:not(.sr)');if(s.length<3)return;
  function fit(){
    p.classList.remove('al');s[1].style.marginLeft='';
    p.classList.add('al');
    var x=m.getBoundingClientRect().left-s[0].getBoundingClientRect().right;
    s[1].style.marginLeft=x+'px';
    if(x<12||s[1].getBoundingClientRect().right+12>s[2].getBoundingClientRect().left){p.classList.remove('al');s[1].style.marginLeft='';}
  }
  fit();addEventListener('resize',fit);
  if(document.fonts)document.fonts.ready.then(fit);
})();
