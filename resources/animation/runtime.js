(() => {
  const watched = document.querySelectorAll('[data-anim-on="view"]');

  if (!watched.length || !('IntersectionObserver' in window)) {
    return;
  }

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
