const u="container",f="wrapper",w=[{key:"ultra-narrow",token:"container-width-ultra-narrow",cls:"container-ultra-narrow"},{key:"narrow",token:"container-width-narrow",cls:"container-narrow"},{key:"normal",token:"container-width",cls:""},{key:"wide",token:"container-width-wide",cls:"container-wide"},{key:"ultra-wide",token:"container-width-ultra-wide",cls:"container-ultra-wide"}],k={key:"full",token:"",cls:"container-full"},y=t=>Array.isArray(t)?t:String(t||"").split(/\s+/);function j(t){const n=y(t);return n.includes(u)?u:n.includes(f)?f:""}function S(t,n=u){return t.cls&&n===f?t.cls.replace(u,f):t.cls}const v=[u,f].flatMap(t=>[...w,k].map(n=>S(n,t)).filter(Boolean));function B(t){const n=y(t);return[...w,k].find(e=>e.cls&&[u,f].some(i=>n.includes(S(e,i))))?.key||"normal"}function N(t){return`${Number((t/16).toFixed(4))}rem`}function d(t){const n=String(t||""),e=[];let i=0,r=0;for(;r<n.length;){const s=n[r];if(s==="/"&&n[r+1]==="*"){const l=n.indexOf("*/",r+2);r=l===-1?n.length:l+2;continue}if(s==='"'||s==="'"){r=p(n,r);continue}if(s==="{")i++;else if(s==="}")i=Math.max(0,i-1);else if(i===0&&s==="@"&&/^@utility\b/.test(n.slice(r,r+9))){const l=O(n,r);if(l){e.push(l),r=l.end;continue}}r++}return e}function x(t){return new Map(d(t).map(n=>[n.name,n.body]))}const C="/* locked */",A=/\/\*\s*locked\s*\*\/[ \t]*\r?\n[ \t]*$/;function m(t,n){return t.slice(0,n).match(A)}function M(t){const n=String(t||"");return new Set(d(n).filter(e=>m(n,e.start)).map(e=>e.name))}function _(t,n,e){const i=String(t||""),r=d(i).find(l=>l.name===n);if(!r)return i;const s=m(i,r.start);return e?s?i:`${i.slice(0,r.start)}${C}
${i.slice(r.start)}`:s?i.slice(0,s.index)+i.slice(s.index+s[0].length):i}function E(t,n){let e=String(t||"");const i=new Map(Object.entries(n||{}));for(const o of d(e).reverse()){if(!i.has(o.name))continue;const a=i.get(o.name);i.delete(o.name),a==null?e=L(e,o):h(e.slice(o.open+1,o.close))!==$(a)&&(e=e.slice(0,o.open+1)+g(a,o.indent)+e.slice(o.close))}const r=[...i].filter(([,o])=>o!=null);if(!r.length)return e;const s=d(e).pop(),l=s?.indent||"    ",c=r.map(([o,a])=>`@utility ${o} {${g(a,l)}}`).join(`

`);return s?`${e.slice(0,s.end)}

${c}${e.slice(s.end)}`:`${e.replace(/\s*$/,"")}

${c}
`}function I(t,n=[]){const e=String(t||"").trim();return e?/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(e)?n.includes(e)?"taken":null:"format":"empty"}function T(t){const n=String(t||"");let e=0;for(let i=0;i<n.length;i++){const r=n[i];if(r==="/"&&n[i+1]==="*"){const s=n.indexOf("*/",i+2);if(s===-1)return"braces";i=s+1}else if(r==='"'||r==="'"){const s=p(n,i);if(s>n.length)return"braces";i=s-1}else if(r==="{")e++;else if(r==="}"&&--e<0)return"braces"}return e===0?null:"braces"}function W(t){const n=[];let e=0;for(const i of String(t||"").split(`
`)){const r=i.trim(),s=e===0?/^(-{0,2}[a-zA-Z][\w-]*)\s*:(?!:)/.exec(r):null;s&&!r.includes("{")&&n.push(s[1]),e+=(r.match(/\{/g)||[]).length-(r.match(/\}/g)||[]).length,e=Math.max(0,e)}return[...new Set(n)]}function z(t){const n=String(t||""),e=[...n.matchAll(/@theme\b[^{]*\{[^}]*\}/g)].map(r=>r[0].trim()),i=d(n).map(r=>n.slice(r.start,r.end).trim());return[...e,...i].join(`

`)}function b(t){const n=String(t||""),e=[];let i=0;for(let r=0;r<n.length;r++)if(n[r]==="{")i++;else if(n[r]==="}")i=Math.max(0,i-1);else if(i===0&&n.startsWith("@apply",r)){const s=n.indexOf(";",r);if(s===-1)break;e.push({start:r,end:s+1,value:n.slice(r+6,s).trim()}),r=s}return e}function U(t){return b(t).map(n=>n.value).filter(Boolean).join(" ").replace(/\s+/g," ")}function D(t,n){const e=String(t||""),i=String(n||"").trim().replace(/\s+/g," "),r=i?`@apply ${i};`:"",s=b(e);if(!s.length)return[r,e.trim()].filter(Boolean).join(`
`);let l=e;return s.slice().reverse().forEach((c,o)=>{const a=o===s.length-1;l=l.slice(0,c.start)+(a?r:"")+l.slice(c.end)}),l.split(`
`).filter(c=>c.trim()).join(`
`)}function h(t){const n=String(t||"").replace(/\r\n?/g,`
`).split(`
`);for(;n.length&&!n[0].trim();)n.shift();for(;n.length&&!n[n.length-1].trim();)n.pop();const e=n.filter(r=>r.trim()).map(r=>/^[ \t]*/.exec(r)[0].length),i=e.length?Math.min(...e):0;return n.map(r=>r.trim()?r.slice(i).replace(/\s+$/,""):"").join(`
`)}function $(t){return h(t)}function g(t,n){const e=$(t).split(`
`);return e.length===1&&!e[0]?`
`:`
${e.map(i=>i?n+i:"").join(`
`)}
`}function O(t,n){const e=t.indexOf("{",n);if(e===-1)return null;const i=t.slice(n+8,e).trim();if(!i||/[;{}]/.test(i))return null;let r=0;for(let s=e;s<t.length;s++){const l=t[s];if(l==="/"&&t[s+1]==="*"){const c=t.indexOf("*/",s+2);s=c===-1?t.length:c+1;continue}if(l==='"'||l==="'"){s=p(t,s)-1;continue}if(l==="{")r++;else if(l==="}"&&--r===0){const c=t.slice(e+1,s),o=c.split(`
`).find(a=>a.trim());return{name:i,body:h(c),indent:o&&/^[ \t]*/.exec(o)[0]||"    ",start:n,open:e,close:s,end:s+1}}}return null}function p(t,n){const e=t[n];let i=n+1;for(;i<t.length&&t[i]!==e;)i+=t[i]==="\\"?2:1;return i+1}function L(t,n){let e=n.start,i=n.end;for(e=m(t,e)?.index??e;e>0&&/[ \t]/.test(t[e-1]);)e--;for(;i<t.length&&/[ \t]/.test(t[i]);)i++;return t[i]===`
`&&i++,t.slice(e-2,e)===`

`&&e--,t.slice(0,e)+t.slice(i)}export{w as C,k as F,v as W,S as a,u as b,j as c,x as d,z as e,E as f,U as g,D as h,N as i,W as j,h as k,M as l,T as m,_ as s,I as u,B as w};
