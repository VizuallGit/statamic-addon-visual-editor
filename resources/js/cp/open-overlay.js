import { mountSurface } from './mount.js';

export function openCpOverlay(doc, component, props) {
  const host = doc.createElement('div');

  doc.body.appendChild(host);

  let app;

  const dismiss = () => {
    app?.unmount();
    host.remove();
  };

  // What the surface's own ✕ does: the caller's onClose, then gone.
  const close = () => {
    props.onClose?.();
    dismiss();
  };

  app = mountSurface(component, host, {
    ...props,
    onClose: close,
  });

  return {
    close,
    dismiss,
    host,
    app,
  };
}
