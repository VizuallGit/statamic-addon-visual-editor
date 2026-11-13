const r=[{id:"logic",lang:"code_dock_antlers_logic"},{id:"loops",lang:"code_dock_antlers_loops"},{id:"include",lang:"code_dock_antlers_include"},{id:"fields",lang:"code_dock_antlers_fields"},{id:"output",lang:"code_dock_antlers_output"},{id:"dates",lang:"code_dock_antlers_dates"},{id:"modifiers",lang:"code_dock_antlers_modifiers"}],l=[{id:"if",group:"logic",label:"if",snippet:`{{ if |field }}
  
{{ /if }}`},{id:"if_else",group:"logic",label:"if / else",snippet:`{{ if |field }}
  
{{ else }}
  
{{ /if }}`},{id:"if_elseif",group:"logic",label:"if / elseif / else",snippet:`{{ if |field }}
  
{{ elseif other }}
  
{{ else }}
  
{{ /if }}`},{id:"unless",group:"logic",label:"unless",snippet:`{{ unless |field }}
  
{{ /unless }}`},{id:"unless_else",group:"logic",label:"unless / else",snippet:`{{ unless |field }}
  
{{ else }}
  
{{ /unless }}`},{id:"if_ends_with",group:"logic",label:"if … ends_with('…')",snippet:`{{ if (|field | ends_with('.mp4')) }}
  
{{ /if }}`},{id:"if_starts_with",group:"logic",label:"if … starts_with('…')",snippet:`{{ if (|field | starts_with('http')) }}
  
{{ /if }}`},{id:"if_contains",group:"logic",label:"if … contains('…')",snippet:`{{ if (|field | contains('word')) }}
  
{{ /if }}`},{id:"is_current",group:"logic",label:"is_current",snippet:`{{ if |is_current }}
  
{{ /if }}`},{id:"is_parent",group:"logic",label:"is_parent",snippet:`{{ if |is_parent }}
  
{{ /if }}`},{id:"is_current_or_parent",group:"logic",label:"is_current || is_parent",snippet:`{{ if |is_current || is_parent }}
  
{{ /if }}`},{id:"loop",group:"loops",label:"loop",snippet:`{{ |items }}
  {{ title }}
{{ /items }}`},{id:"collection",group:"loops",label:"collection",snippet:`{{ collection from="|handle" }}
  {{ title }}
{{ /collection }}`},{id:"collection_as",group:"loops",label:"collection as",snippet:`{{ collection from="|handle" as="entries" }}
  {{ if no_results }}
    
  {{ /if }}
  {{ entries }}
    {{ title }}
  {{ /entries }}
{{ /collection }}`},{id:"collection_paginate",group:"loops",label:"collection paginate",snippet:`{{ collection from="|handle" paginate="true" limit="12" as="entries" }}
  {{ entries }}
    {{ title }}
  {{ /entries }}
  {{ paginate }}{{ partial:components/pagination }}{{ /paginate }}
{{ /collection }}`},{id:"foreach",group:"loops",label:"foreach",snippet:`{{ foreach:|items }}
  {{ key }}: {{ value }}
{{ /foreach:items }}`},{id:"nav",group:"loops",label:"nav",snippet:`{{ nav:|main }}
  <a href="{{ url }}"{{ if is_current || is_parent }} aria-current="page"{{ /if }}>{{ title }}</a>
{{ /nav:main }}`},{id:"nav_home",group:"loops",label:"nav include_home",snippet:`{{ nav:|main include_home="true" }}
  <a href="{{ url }}"{{ if is_current || is_parent }} aria-current="page"{{ /if }}>{{ title }}</a>
{{ /nav:main }}`},{id:"nav_children",group:"loops",label:"nav children",snippet:`{{ nav:|main }}
  <a href="{{ url }}">{{ title }}</a>
  {{ if children }}
    {{ children }}
      <a href="{{ url }}">{{ title }}</a>
    {{ /children }}
  {{ /if }}
{{ /nav:main }}`},{id:"breadcrumbs",group:"loops",label:"nav:breadcrumbs",snippet:`{{ nav:breadcrumbs }}
  <a href="{{ url }}">{{ title }}</a>
{{ /nav:breadcrumbs }}`},{id:"partial",group:"include",label:"partial",snippet:"{{ partial:|path }}"},{id:"partial_exists",group:"include",label:"partial:if_exists",snippet:'{{ partial:if_exists src="|path" }}'},{id:"svg",group:"include",label:"svg",snippet:'{{ svg src="|icon" }}'},{id:"iconify",group:"include",label:"iconify",snippet:"{{ iconify:|icon }}"},{id:"nocache",group:"include",label:"nocache",snippet:`{{ nocache }}
  
{{ /nocache }}`},{id:"assets",group:"fields",label:"assets",snippet:`{{ |assets }}
  <img src="{{ url }}" alt="{{ alt }}">
{{ /assets }}`},{id:"asset",group:"fields",label:"asset",snippet:`{{ |image }}
  <img src="{{ url }}" alt="{{ alt }}">
{{ /image }}`},{id:"replicator",group:"fields",label:"replicator",snippet:`{{ |blocks }}
  {{ if type == "set_name" }}
    
  {{ /if }}
{{ /blocks }}`},{id:"grid",group:"fields",label:"grid",snippet:`{{ |items }}
  {{ title }}
{{ /items }}`},{id:"variable",group:"output",label:"{{ field }}",snippet:"{{ |field }}"},{id:"trans",group:"output",label:"trans",snippet:"{{ trans:|key }}"},{id:"comment",group:"output",label:"comment",snippet:"{{# | #}}"},{id:"date_short",group:"dates",label:"23.09.2026",snippet:"{{ |date | format:d.m.Y }}"},{id:"date_long",group:"dates",label:"23. september 2026",snippet:"{{ |date | iso_format('D. MMMM YYYY') }}"},{id:"date_weekday",group:"dates",label:"onsdag 23. september",snippet:"{{ |date | iso_format('dddd D. MMMM') }}"},{id:"date_time",group:"dates",label:"23.09.2026 14:30",snippet:"{{ |date | format('d.m.Y H:i') }}"},{id:"date_time_only",group:"dates",label:"14:30",snippet:"{{ |date | format('H:i') }}"},{id:"date_year",group:"dates",label:"year",snippet:"{{ |date | format:Y }}"},{id:"date_month",group:"dates",label:"month (name)",snippet:"{{ |date | iso_format('MMMM') }}"},{id:"date_day",group:"dates",label:"day",snippet:"{{ |date | format:j }}"},{id:"date_relative",group:"dates",label:"relative (3 dage siden)",snippet:"{{ |date | relative }}"},{id:"date_now",group:"dates",label:"now",snippet:"{{ now | format:d.m.Y }}"},{id:"date_now_year",group:"dates",label:"year now (© 2026)",snippet:"{{ now | format:Y }}"},{id:"date_iso",group:"dates",label:"datetime attribute (ISO)",snippet:'<time datetime="{{ |date | format:Y-m-d }}">{{ date | format:d.m.Y }}</time>'},{id:"mod_upper",group:"modifiers",label:"upper",snippet:" | upper",inline:!0},{id:"mod_lower",group:"modifiers",label:"lower",snippet:" | lower",inline:!0},{id:"mod_title",group:"modifiers",label:"title",snippet:" | title",inline:!0},{id:"mod_ucfirst",group:"modifiers",label:"ucfirst",snippet:" | ucfirst",inline:!0},{id:"mod_truncate",group:"modifiers",label:"truncate",snippet:" | truncate:120",inline:!0},{id:"mod_markdown",group:"modifiers",label:"markdown",snippet:" | markdown",inline:!0},{id:"mod_raw",group:"modifiers",label:"raw",snippet:" | raw",inline:!0},{id:"mod_nl2br",group:"modifiers",label:"nl2br",snippet:" | nl2br",inline:!0},{id:"mod_strip_tags",group:"modifiers",label:"strip_tags",snippet:" | strip_tags",inline:!0},{id:"mod_format",group:"modifiers",label:"format (date)",snippet:" | format:d.m.Y",inline:!0},{id:"mod_iso_format",group:"modifiers",label:"iso_format",snippet:" | iso_format('D. MMMM YYYY')",inline:!0},{id:"mod_relative",group:"modifiers",label:"relative",snippet:" | relative",inline:!0},{id:"mod_count",group:"modifiers",label:"count",snippet:" | count",inline:!0},{id:"mod_first",group:"modifiers",label:"first",snippet:" | first",inline:!0},{id:"mod_last",group:"modifiers",label:"last",snippet:" | last",inline:!0},{id:"mod_reverse",group:"modifiers",label:"reverse",snippet:" | reverse",inline:!0},{id:"mod_sort",group:"modifiers",label:"sort",snippet:" | sort:title:asc",inline:!0},{id:"mod_limit",group:"modifiers",label:"limit",snippet:" | limit:3",inline:!0},{id:"mod_where",group:"modifiers",label:"where",snippet:" | where:field:value",inline:!0},{id:"mod_default",group:"modifiers",label:"default",snippet:' | default:""',inline:!0},{id:"mod_url",group:"modifiers",label:"url",snippet:" | url",inline:!0},{id:"mod_slugify",group:"modifiers",label:"slugify",snippet:" | slugify",inline:!0},{id:"mod_to_int",group:"modifiers",label:"to_int",snippet:" | to_int",inline:!0},{id:"mod_multiply",group:"modifiers",label:"multiply",snippet:" | multiply:2",inline:!0},{id:"mod_add",group:"modifiers",label:"add",snippet:" | add:1",inline:!0},{id:"mod_join",group:"modifiers",label:"join",snippet:' | join:", "',inline:!0},{id:"mod_ends_with",group:"modifiers",label:"ends_with",snippet:" | ends_with('.mp4')",inline:!0},{id:"mod_starts_with",group:"modifiers",label:"starts_with",snippet:" | starts_with('http')",inline:!0},{id:"mod_contains",group:"modifiers",label:"contains",snippet:" | contains('word')",inline:!0}];function o(e){return l.find(i=>i.id===e)||null}function s(e){const i=String(e||"").indexOf("|");return i===-1?{text:e,cursor:String(e||"").length}:{text:e.slice(0,i)+e.slice(i+1),cursor:i}}function a(e,i){return String(e||"").split(`
`).map((t,n)=>n===0?t:`${i}${t}`).join(`
`)}export{r as A,l as a,o as b,s as e,a as i};
