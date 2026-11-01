// Personenseiten (01.11.2026, Carolina): Auf dem Handy laufen die zwei Fotos unten seitlich durch, gesteuert vom normalen
// Scrollen nach unten (Skill horizontal-scroll-track). Kein Eingriff in Scroll-/Wheel-Events, nur translateX auf der Spur.
// Am Computer und bei „weniger Bewegung“ bleiben die Fotos wie bisher (CSS: .hs-pin/.hs-track display:contents).
(function () {
  var duo = document.querySelector('.duo.wide');
  if (!duo) return;
  var figs = [].slice.call(duo.querySelectorAll(':scope > figure'));
  if (figs.length < 2) return;
  var pin = document.createElement('div'), track = document.createElement('div');
  pin.className = 'hs-pin'; track.className = 'hs-track';
  figs.forEach(function (f) { track.appendChild(f); });
  pin.appendChild(track); duo.appendChild(pin); duo.classList.add('hs');
  var phone = matchMedia('(max-width: 899px)'), calm = matchMedia('(prefers-reduced-motion: reduce)');
  var n = figs.length, queued = false;
  function update() {
    queued = false;
    if (!phone.matches || calm.matches) { track.style.transform = ''; return; }
    var r = duo.getBoundingClientRect(), total = r.height - window.innerHeight;
    var p = total <= 0 ? 1 : Math.min(1, Math.max(0, -r.top / total));
    track.style.transform = 'translateX(' + (-p * (n - 1) * 100) + 'vw)';
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  update();
})();
