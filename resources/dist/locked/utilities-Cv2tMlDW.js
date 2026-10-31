function f(s){const n=String(s||""),e=[];let i=0,t=0;for(;t<n.length;){const l=n[t];if(l==="/"&&n[t+1]==="*"){const r=n.indexOf("*/",t+2);t=r===-1?n.length:r+2;continue}if(l==='"'||l==="'"){t=m(n,t);continue}if(l==="{")i++;else if(l==="}")i=Math.max(0,i-1);else if(i===0&&l==="@"&&/^@utility\b/.test(n.slice(t,t+9))){const r=g(n,t);if(r){e.push(r),t=r.end;continue}}t++}return e}function w(s){return new Map(f(s).map(n=>[n.name,n.body]))}function y(s,n){let e=String(s||"");const i=new Map(Object.entries(n||{}));for(const o of f(e).reverse()){if(!i.has(o.name))continue;const u=i.get(o.name);i.delete(o.name),u==null?e=b(e,o):a(e.slice(o.open+1,o.close))!==p(u)&&(e=e.slice(0,o.open+1)+d(u,o.indent)+e.slice(o.close))}const t=[...i].filter(([,o])=>o!=null);if(!t.length)return e;const l=f(e).pop(),r=l?.indent||"    ",c=t.map(([o,u])=>`@utility ${o} {${d(u,r)}}`).join(`

`);return l?`${e.slice(0,l.end)}

${c}${e.slice(l.end)}`:`${e.replace(/\s*$/,"")}

${c}
`}function S(s,n=[]){const e=String(s||"").trim();return e?/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(e)?n.includes(e)?"taken":null:"format":"empty"}function $(s){const n=String(s||"");let e=0;for(let i=0;i<n.length;i++){const t=n[i];if(t==="/"&&n[i+1]==="*"){const l=n.indexOf("*/",i+2);if(l===-1)return"braces";i=l+1}else if(t==='"'||t==="'"){const l=m(n,i);if(l>n.length)return"braces";i=l-1}else if(t==="{")e++;else if(t==="}"&&--e<0)return"braces"}return e===0?null:"braces"}function j(s){const n=[];let e=0;for(const i of String(s||"").split(`
`)){const t=i.trim(),l=e===0?/^(-{0,2}[a-zA-Z][\w-]*)\s*:(?!:)/.exec(t):null;l&&!t.includes("{")&&n.push(l[1]),e+=(t.match(/\{/g)||[]).length-(t.match(/\}/g)||[]).length,e=Math.max(0,e)}return[...new Set(n)]}function k(s){const n=String(s||""),e=[...n.matchAll(/@theme\b[^{]*\{[^}]*\}/g)].map(t=>t[0].trim()),i=f(n).map(t=>n.slice(t.start,t.end).trim());return[...e,...i].join(`

`)}function h(s){const n=String(s||""),e=[];let i=0;for(let t=0;t<n.length;t++)if(n[t]==="{")i++;else if(n[t]==="}")i=Math.max(0,i-1);else if(i===0&&n.startsWith("@apply",t)){const l=n.indexOf(";",t);if(l===-1)break;e.push({start:t,end:l+1,value:n.slice(t+6,l).trim()}),t=l}return e}function v(s){return h(s).map(n=>n.value).filter(Boolean).join(" ").replace(/\s+/g," ")}function C(s,n){const e=String(s||""),i=String(n||"").trim().replace(/\s+/g," "),t=i?`@apply ${i};`:"",l=h(e);if(!l.length)return[t,e.trim()].filter(Boolean).join(`
`);let r=e;return l.slice().reverse().forEach((c,o)=>{const u=o===l.length-1;r=r.slice(0,c.start)+(u?t:"")+r.slice(c.end)}),r.split(`
`).filter(c=>c.trim()).join(`
`)}function a(s){const n=String(s||"").replace(/\r\n?/g,`
`).split(`
`);for(;n.length&&!n[0].trim();)n.shift();for(;n.length&&!n[n.length-1].trim();)n.pop();const e=n.filter(t=>t.trim()).map(t=>/^[ \t]*/.exec(t)[0].length),i=e.length?Math.min(...e):0;return n.map(t=>t.trim()?t.slice(i).replace(/\s+$/,""):"").join(`
`)}function p(s){return a(s)}function d(s,n){const e=p(s).split(`
`);return e.length===1&&!e[0]?`
`:`
${e.map(i=>i?n+i:"").join(`
`)}
`}function g(s,n){const e=s.indexOf("{",n);if(e===-1)return null;const i=s.slice(n+8,e).trim();if(!i||/[;{}]/.test(i))return null;let t=0;for(let l=e;l<s.length;l++){const r=s[l];if(r==="/"&&s[l+1]==="*"){const c=s.indexOf("*/",l+2);l=c===-1?s.length:c+1;continue}if(r==='"'||r==="'"){l=m(s,l)-1;continue}if(r==="{")t++;else if(r==="}"&&--t===0){const c=s.slice(e+1,l),o=c.split(`
`).find(u=>u.trim());return{name:i,body:a(c),indent:o&&/^[ \t]*/.exec(o)[0]||"    ",start:n,open:e,close:l,end:l+1}}}return null}function m(s,n){const e=s[n];let i=n+1;for(;i<s.length&&s[i]!==e;)i+=s[i]==="\\"?2:1;return i+1}function b(s,n){let e=n.start,i=n.end;for(;e>0&&/[ \t]/.test(s[e-1]);)e--;for(;i<s.length&&/[ \t]/.test(s[i]);)i++;return s[i]===`
`&&i++,s.slice(e-2,e)===`

`&&e--,s.slice(0,e)+s.slice(i)}export{v as a,w as b,C as c,k as d,j as e,a as f,$ as g,S as u,y as w};
