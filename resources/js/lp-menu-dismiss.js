export function dropMenu(el) {
  if (!el) {
    return;
  }

  el._sveUnbind?.();
  el.remove();
}

/**
 * Dismiss a Live Preview header menu on outside pointer, Escape, or preview click.
 * Does not import the kernel.
 */

export function bindMenuDismiss(win, isInside, dismiss) {
  const doc = win.document;
  const iframe = doc.getElementById('live-preview-iframe');
  let iframeWin = null;

  const onPointer = (event) => {
    if (isInside(event.target)) {
      return;
    }

    dismiss();
  };

  const onKey = (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    event.preventDefault();
    dismiss();
  };

  const onPreview = () => dismiss();

  try {
    iframeWin = iframe?.contentWindow || null;
  } catch {
    iframeWin = null;
  }

  doc.addEventListener('pointerdown', onPointer, true);
  win.addEventListener('keydown', onKey, true);
  iframe?.addEventListener('pointerdown', onPreview);

  if (iframeWin) {
    try {
      iframeWin.addEventListener('pointerdown', onPreview, true);
      iframeWin.addEventListener('keydown', onKey, true);
    } catch {
      iframeWin = null;
    }
  }

  return () => {
    doc.removeEventListener('pointerdown', onPointer, true);
    win.removeEventListener('keydown', onKey, true);
    iframe?.removeEventListener('pointerdown', onPreview);

    if (iframeWin) {
      try {
        iframeWin.removeEventListener('pointerdown', onPreview, true);
        iframeWin.removeEventListener('keydown', onKey, true);
      } catch {
        /* iframe navigated */
      }
    }
  };
}
