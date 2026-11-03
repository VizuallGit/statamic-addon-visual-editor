/**
 * Statamic's entry publish form, read from the outside.
 *
 * The form is the one source for whether the open page has a public URL:
 * its `permalink` (the entry's absolute URL, kept current on save) and
 * `activeLocalization.status` ('published', 'draft', 'scheduled', 'expired'),
 * both of which Statamic writes back the moment a save or a publish lands —
 * no reload. The Inertia page props hold only the values from page load, and
 * the "Visit URL" link is drawn for drafts too, so neither of those answers.
 *
 * The CP's Vue build carries no `__vueParentComponent`, so the form is found
 * the way the other field enhancements find theirs: one global mixin, added
 * before Statamic mounts. It only reads; it writes nothing to the form.
 *
 *   registerEntryPublishForm()   once, at Statamic.configuring (addon.js)
 *   publicUrlOf(win)             the live page's URL, or null
 *
 * Named in scripts/statamic-update-check.py (CONTRACTS) on the site.
 *
 * May import: nothing.
 */

let form = null;

/** The entry (or term) publish form: the one component with these two. */
function isEntryPublishForm(vm) {
  return !!vm.$props && 'initialPermalink' in vm.$props && 'activeLocalization' in vm;
}

export function registerEntryPublishForm() {
  if (typeof window.Statamic?.configuring !== 'function') {
    return;
  }

  window.Statamic.configuring(() => {
    window.Statamic.$app.mixin({
      mounted() {
        if (isEntryPublishForm(this)) {
          form = this;
        }
      },
      unmounted() {
        if (form === this) {
          form = null;
        }
      },
    });
  });
}

/**
 * The open page's public URL, or null while it has none: no form on screen,
 * a new entry, no route, or a status that keeps it off the site (draft,
 * scheduled, expired — the same test the frontend's 404 makes).
 */
export function publicUrlOf(win = window) {
  if (!form || form.$el?.ownerDocument?.defaultView !== win) {
    return null;
  }

  const permalink = form.permalink;

  if (typeof permalink !== 'string' || permalink === '') {
    return null;
  }

  return form.activeLocalization?.status === 'published' ? permalink : null;
}
