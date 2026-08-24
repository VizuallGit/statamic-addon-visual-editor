import { mountSurface } from './mount.js';

export function openCpOverlay(doc, component, props) {
  const host = doc.createElement('div');

  doc.body.appendChild(host);

  let app;

  const dismiss = () => {
    app?.unmount();
    host.remove();
  };

  app = mountSurface(component, host, {
    ...props,
    onClose: () => {
      props.onClose?.();
      dismiss();
    },
  });

  return {
    dismiss,
    host,
    app,
  };
}
