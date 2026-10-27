const m=["section","div","article","aside","nav","header","footer"];function $(n){return[`{{ ${n} }}`,"    {{ _class = type | replace('/', '-') | replace('_', '-') }}",'    {{ partial src="partials/page_sections/{ type }" id="{{ id }}" :class="_class" :_class="_class" }}',`{{ /${n} }}`].join(`
`)}function d(n){const e=/^sections:([A-Za-z_][A-Za-z0-9_]*)$/.exec(String(n||""));return e?e[1]:""}function h(n){const e=d(n);if(e)return $(e);const t=m.includes(n)?n:"div";return`<${t} class="${t==="section"?"py-800":""}">
    
</${t}>`}function f(n,e,t=null){return _(n,h(e),t)}function _(n,e,t=null){const s=String(n||""),l=String(e||""),i=t?t.wrapFrom??t.from:NaN,c=t?t.wrapTo??t.to:NaN;if(!Number.isInteger(i)||!Number.isInteger(c)||i<0||c>s.length||i>c){const o=`${s.replace(/\s+$/,"")}${s.trim()?`

`:""}`;return{html:`${o}${l}
`,at:o.length}}const p=s.lastIndexOf(`
`,i-1)+1,a=s.slice(p,i),r=/^[ \t]*$/.test(a)?a:"",u=l.split(`
`).map(o=>o&&r+o).join(`
`);return{html:`${s.slice(0,c)}
${u}${s.slice(c)}`,at:c+1+r.length}}export{m as T,f as a,_ as w};
