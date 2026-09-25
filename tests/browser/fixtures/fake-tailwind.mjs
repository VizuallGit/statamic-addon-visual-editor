// A stand-in for the Tailwind compiler chunk (sveTwCompile): one rule per class
// found in the HTML, so a test can see which classes a sheet was built for.
export async function loadTailwindCompiler() {
  return { fake: true };
}

export function buildTailwind(state, html) {
  const names = new Set();
  for (const m of String(html || '').matchAll(/class="([^"]*)"/g)) {
    for (const name of m[1].split(/\s+/)) if (name) names.add(name);
  }
  return [...names].map((n) => `.${n.replace(/[^a-zA-Z0-9_-]/g, (c) => '\\' + c)}{--sve-fake:1}`).join('\n');
}
