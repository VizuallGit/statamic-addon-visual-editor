/**
 * Run a check when the Control Panel changes page.
 *
 * The CP is Inertia: a visit swaps the page into the document that is already
 * open, so there is no load event to hang a mount on. The obvious answer is a
 * MutationObserver over the whole document — and it is also the expensive one.
 * It asks the browser to build a record for every DOM change on the page, for
 * the whole session, to catch a handful of moments. On the Live Preview screen
 * that is every panel, every drag and every morph, forever.
 *
 * So: Inertia's own navigation events do the work, and an observer lives only
 * for the moment around a navigation — when the page really is being rebuilt —
 * then disconnects itself on the first mutation after its window closes. A busy
 * screen therefore switches it off quickly; a quiet one leaves it connected with
 * nothing to report, which costs nothing either.
 */

const SETTLE_MS = 2000;
const DEBOUNCE_MS = 40;

export function watchPage(win, run) {
  let timer = 0;
  let observer = null;
  let openUntil = 0;

  const fire = () => {
    win.clearTimeout(timer);
    timer = win.setTimeout(run, DEBOUNCE_MS);
  };

  const arm = () => {
    openUntil = Date.now() + SETTLE_MS;

    if (observer) {
      return;
    }

    observer = new win.MutationObserver(() => {
      if (Date.now() > openUntil) {
        observer?.disconnect();
        observer = null;

        return;
      }

      fire();
    });

    observer.observe(win.document.body, { childList: true, subtree: true });
  };

  const onNavigate = () => {
    fire();
    arm();
  };

  // `inertia:finish` lands when the visit completes; the page may render a tick
  // later, which is what the observer window is for.
  win.document.addEventListener('inertia:finish', onNavigate);
  win.addEventListener('popstate', onNavigate);

  run();
  arm();

  return () => {
    win.clearTimeout(timer);
    observer?.disconnect();
    observer = null;
    win.document.removeEventListener('inertia:finish', onNavigate);
    win.removeEventListener('popstate', onNavigate);
  };
}
