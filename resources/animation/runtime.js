(() => {
  const watched = document.querySelectorAll('[data-anim-on="view"]');

  if (!watched.length || !('IntersectionObserver' in window) || typeof CSSStyleSheet.prototype.replaceSync !== 'function') {
    return;
  }

  // The hold is a sheet of this script's own, not a rule in runtime.css: a copy of the
  // document without its scripts (Build's canvas) keeps data-anim-watch and must not keep the hold.
  const hold = new CSSStyleSheet();
  hold.replaceSync('[data-anim="self"][data-anim-watch]:not([data-in-view]), [data-anim="children"][data-anim-watch]:not([data-in-view]) > * { animation-play-state: paused; }');
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, hold];

  const seen = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-in-view', '');
        seen.unobserve(entry.target);
      }
    }
  });

  for (const el of watched) {
    el.setAttribute('data-anim-watch', '');
    seen.observe(el);
  }
})();
