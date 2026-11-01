function u(s){const n=String(s||""),e=[];let t=0,i=0;for(;i<n.length;){const l=n[i];if(l==="/"&&n[i+1]==="*"){const r=n.indexOf("*/",i+2);i=r===-1?n.length:r+2;continue}if(l==='"'||l==="'"){i=m(n,i);continue}if(l==="{")t++;else if(l==="}")t=Math.max(0,t-1);else if(t===0&&l==="@"&&/^@utility\b/.test(n.slice(i,i+9))){const r=w(n,i);if(r){e.push(r),i=r.end;continue}}i++}return e}function S(s){return new Map(u(s).map(n=>[n.name,n.body]))}const b="/* locked */",$=/\/\*\s*locked\s*\*\/[ \t]*\r?\n[ \t]*$/;function f(s,n){return s.slice(0,n).match($)}function k(s){const n=String(s||"");return new Set(u(n).filter(e=>f(n,e.start)).map(e=>e.name))}function j(s,n,e){const t=String(s||""),i=u(t).find(r=>r.name===n);if(!i)return t;const l=f(t,i.start);return e?l?t:`${t.slice(0,i.start)}${b}
${t.slice(i.start)}`:l?t.slice(0,l.index)+t.slice(l.index+l[0].length):t}function v(s,n){let e=String(s||"");const t=new Map(Object.entries(n||{}));for(const o of u(e).reverse()){if(!t.has(o.name))continue;const a=t.get(o.name);t.delete(o.name),a==null?e=y(e,o):d(e.slice(o.open+1,o.close))!==g(a)&&(e=e.slice(0,o.open+1)+h(a,o.indent)+e.slice(o.close))}const i=[...t].filter(([,o])=>o!=null);if(!i.length)return e;const l=u(e).pop(),r=l?.indent||"    ",c=i.map(([o,a])=>`@utility ${o} {${h(a,r)}}`).join(`

`);return l?`${e.slice(0,l.end)}

${c}${e.slice(l.end)}`:`${e.replace(/\s*$/,"")}

${c}
`}function O(s,n=[]){const e=String(s||"").trim();return e?/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(e)?n.includes(e)?"taken":null:"format":"empty"}function C(s){const n=String(s||"");let e=0;for(let t=0;t<n.length;t++){const i=n[t];if(i==="/"&&n[t+1]==="*"){const l=n.indexOf("*/",t+2);if(l===-1)return"braces";t=l+1}else if(i==='"'||i==="'"){const l=m(n,t);if(l>n.length)return"braces";t=l-1}else if(i==="{")e++;else if(i==="}"&&--e<0)return"braces"}return e===0?null:"braces"}function x(s){const n=[];let e=0;for(const t of String(s||"").split(`
`)){const i=t.trim(),l=e===0?/^(-{0,2}[a-zA-Z][\w-]*)\s*:(?!:)/.exec(i):null;l&&!i.includes("{")&&n.push(l[1]),e+=(i.match(/\{/g)||[]).length-(i.match(/\}/g)||[]).length,e=Math.max(0,e)}return[...new Set(n)]}function A(s){const n=String(s||""),e=[...n.matchAll(/@theme\b[^{]*\{[^}]*\}/g)].map(i=>i[0].trim()),t=u(n).map(i=>n.slice(i.start,i.end).trim());return[...e,...t].join(`

`)}function p(s){const n=String(s||""),e=[];let t=0;for(let i=0;i<n.length;i++)if(n[i]==="{")t++;else if(n[i]==="}")t=Math.max(0,t-1);else if(t===0&&n.startsWith("@apply",i)){const l=n.indexOf(";",i);if(l===-1)break;e.push({start:i,end:l+1,value:n.slice(i+6,l).trim()}),i=l}return e}function B(s){return p(s).map(n=>n.value).filter(Boolean).join(" ").replace(/\s+/g," ")}function M(s,n){const e=String(s||""),t=String(n||"").trim().replace(/\s+/g," "),i=t?`@apply ${t};`:"",l=p(e);if(!l.length)return[i,e.trim()].filter(Boolean).join(`
`);let r=e;return l.slice().reverse().forEach((c,o)=>{const a=o===l.length-1;r=r.slice(0,c.start)+(a?i:"")+r.slice(c.end)}),r.split(`
`).filter(c=>c.trim()).join(`
`)}function d(s){const n=String(s||"").replace(/\r\n?/g,`
`).split(`
`);for(;n.length&&!n[0].trim();)n.shift();for(;n.length&&!n[n.length-1].trim();)n.pop();const e=n.filter(i=>i.trim()).map(i=>/^[ \t]*/.exec(i)[0].length),t=e.length?Math.min(...e):0;return n.map(i=>i.trim()?i.slice(t).replace(/\s+$/,""):"").join(`
`)}function g(s){return d(s)}function h(s,n){const e=g(s).split(`
`);return e.length===1&&!e[0]?`
`:`
${e.map(t=>t?n+t:"").join(`
`)}
`}function w(s,n){const e=s.indexOf("{",n);if(e===-1)return null;const t=s.slice(n+8,e).trim();if(!t||/[;{}]/.test(t))return null;let i=0;for(let l=e;l<s.length;l++){const r=s[l];if(r==="/"&&s[l+1]==="*"){const c=s.indexOf("*/",l+2);l=c===-1?s.length:c+1;continue}if(r==='"'||r==="'"){l=m(s,l)-1;continue}if(r==="{")i++;else if(r==="}"&&--i===0){const c=s.slice(e+1,l),o=c.split(`
`).find(a=>a.trim());return{name:t,body:d(c),indent:o&&/^[ \t]*/.exec(o)[0]||"    ",start:n,open:e,close:l,end:l+1}}}return null}function m(s,n){const e=s[n];let t=n+1;for(;t<s.length&&s[t]!==e;)t+=s[t]==="\\"?2:1;return t+1}function y(s,n){let e=n.start,t=n.end;for(e=f(s,e)?.index??e;e>0&&/[ \t]/.test(s[e-1]);)e--;for(;t<s.length&&/[ \t]/.test(s[t]);)t++;return s[t]===`
`&&t++,s.slice(e-2,e)===`

`&&e--,s.slice(0,e)+s.slice(t)}export{S as a,B as b,A as c,M as d,x as e,d as f,C as g,k as l,j as s,O as u,v as w};
