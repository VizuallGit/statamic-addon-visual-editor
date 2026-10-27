function f(i){const e=String(i||""),n=[];let t=0,l=0;for(;l<e.length;){const s=e[l];if(s==="/"&&e[l+1]==="*"){const o=e.indexOf("*/",l+2);l=o===-1?e.length:o+2;continue}if(s==='"'||s==="'"){l=m(e,l);continue}if(s==="{")t++;else if(s==="}")t=Math.max(0,t-1);else if(t===0&&s==="@"&&/^@utility\b/.test(e.slice(l,l+9))){const o=p(e,l);if(o){n.push(o),l=o.end;continue}}l++}return n}function b(i){return new Map(f(i).map(e=>[e.name,e.body]))}function w(i,e){let n=String(i||"");const t=new Map(Object.entries(e||{}));for(const r of f(n).reverse()){if(!t.has(r.name))continue;const u=t.get(r.name);t.delete(r.name),u==null?n=g(n,r):a(n.slice(r.open+1,r.close))!==h(u)&&(n=n.slice(0,r.open+1)+d(u,r.indent)+n.slice(r.close))}const l=[...t].filter(([,r])=>r!=null);if(!l.length)return n;const s=f(n).pop(),o=s?.indent||"    ",c=l.map(([r,u])=>`@utility ${r} {${d(u,o)}}`).join(`

`);return s?`${n.slice(0,s.end)}

${c}${n.slice(s.end)}`:`${n.replace(/\s*$/,"")}

${c}
`}function y(i,e=[]){const n=String(i||"").trim();return n?/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(n)?e.includes(n)?"taken":null:"format":"empty"}function $(i){const e=String(i||"");let n=0;for(let t=0;t<e.length;t++){const l=e[t];if(l==="/"&&e[t+1]==="*"){const s=e.indexOf("*/",t+2);if(s===-1)return"braces";t=s+1}else if(l==='"'||l==="'"){const s=m(e,t);if(s>e.length)return"braces";t=s-1}else if(l==="{")n++;else if(l==="}"&&--n<0)return"braces"}return n===0?null:"braces"}function S(i){const e=[];let n=0;for(const t of String(i||"").split(`
`)){const l=t.trim(),s=n===0?/^(-{0,2}[a-zA-Z][\w-]*)\s*:(?!:)/.exec(l):null;s&&!l.includes("{")&&e.push(s[1]),n+=(l.match(/\{/g)||[]).length-(l.match(/\}/g)||[]).length,n=Math.max(0,n)}return[...new Set(e)]}function j(i){const e=String(i||""),n=[...e.matchAll(/@theme\b[^{]*\{[^}]*\}/g)].map(l=>l[0].trim()),t=f(e).map(l=>e.slice(l.start,l.end).trim());return[...n,...t].join(`

`)}function a(i){const e=String(i||"").replace(/\r\n?/g,`
`).split(`
`);for(;e.length&&!e[0].trim();)e.shift();for(;e.length&&!e[e.length-1].trim();)e.pop();const n=e.filter(l=>l.trim()).map(l=>/^[ \t]*/.exec(l)[0].length),t=n.length?Math.min(...n):0;return e.map(l=>l.trim()?l.slice(t).replace(/\s+$/,""):"").join(`
`)}function h(i){return a(i)}function d(i,e){const n=h(i).split(`
`);return n.length===1&&!n[0]?`
`:`
${n.map(t=>t?e+t:"").join(`
`)}
`}function p(i,e){const n=i.indexOf("{",e);if(n===-1)return null;const t=i.slice(e+8,n).trim();if(!t||/[;{}]/.test(t))return null;let l=0;for(let s=n;s<i.length;s++){const o=i[s];if(o==="/"&&i[s+1]==="*"){const c=i.indexOf("*/",s+2);s=c===-1?i.length:c+1;continue}if(o==='"'||o==="'"){s=m(i,s)-1;continue}if(o==="{")l++;else if(o==="}"&&--l===0){const c=i.slice(n+1,s),r=c.split(`
`).find(u=>u.trim());return{name:t,body:a(c),indent:r&&/^[ \t]*/.exec(r)[0]||"    ",start:e,open:n,close:s,end:s+1}}}return null}function m(i,e){const n=i[e];let t=e+1;for(;t<i.length&&i[t]!==n;)t+=i[t]==="\\"?2:1;return t+1}function g(i,e){let n=e.start,t=e.end;for(;n>0&&/[ \t]/.test(i[n-1]);)n--;for(;t<i.length&&/[ \t]/.test(i[t]);)t++;return i[t]===`
`&&t++,i.slice(n-2,n)===`

`&&n--,i.slice(0,n)+i.slice(t)}export{$ as a,S as b,j as c,a as d,y as e,b as u,w};
