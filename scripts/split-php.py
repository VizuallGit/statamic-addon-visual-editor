#!/usr/bin/env python3
"""Split one PHP utility class into a facade + N classes, moving methods verbatim.

WP7d tool (2026-09). One JSON config per class lives in scripts/splits/. Run from the addon root:
    python3 scripts/split-php.py scripts/splits/<class>.json

Usage: split-php.py <config.json>
config: {
  "src": "src/SectionTemplate.php",
  "root_ns": "MarioHamann\\StatamicVisualEditor",
  "sub_ns": "SectionTemplate",             # new classes live in root_ns\\sub_ns, dir src/<sub_ns>/
  "targets": {"Paths": {"doc": "...", "methods": [..], "consts": [..]}, ...},
  "keep": [..],                            # members that stay in the source class (instance or static)
  "facade": ["split", "join", ...],        # public methods the facade delegates to their new class
  "facade_doc_extra": "text appended to the class docblock",
  "wp": "WP7d"
}
Moved methods become static (none may use instance state — the script refuses `$this->prop`).
`$this->m(` / `static::m(` / `self::m(` are rewritten to `Target::m(` where `m` moved elsewhere.
"""
import json, os, re, sys, glob

cfg = json.load(open(sys.argv[1]))
src_path = cfg['src']
lines = open(src_path).read().split('\n')

# ---- parse header ---------------------------------------------------------
class_idx = next(i for i, l in enumerate(lines) if re.match(r'^(final )?(abstract )?class \w+', l))
class_line = lines[class_idx]
class_name = re.search(r'class (\w+)', class_line).group(1)
doc_start = class_idx
while doc_start > 0 and (lines[doc_start-1].startswith(' *') or lines[doc_start-1].startswith('/**') or lines[doc_start-1].strip() == '*/'):
    doc_start -= 1
class_doc = lines[doc_start:class_idx]
uses = [l for l in lines[:doc_start] if l.startswith('use ')]

# ---- parse members ----------------------------------------------------------
def leading_doc(i):
    j = i
    while j > 0 and (lines[j-1].startswith('    /**') or lines[j-1].startswith('     *') or lines[j-1].startswith('    #[')):
        j -= 1
    return j

HEREDOC = re.compile(r"<<<\s*['\"]?(\w+)['\"]?\s*$")

def method_end(sig):
    """Index of the method's closing `    }` — a `    }` inside a heredoc does not count."""
    j = sig + 1
    while j < len(lines):
        l = lines[j]
        h = HEREDOC.search(l)
        if h:
            marker = re.compile(r'^\s*' + h.group(1) + r'\b')
            j += 1
            while j < len(lines) and not marker.match(lines[j]):
                j += 1
            j += 1
            continue
        if l == '    }':
            return j
        j += 1
    raise SystemExit(f'no end found for method at line {sig+1}')

members = {}
order = []
i = class_idx + 1
while i < len(lines):
    l = lines[i]
    m = re.match(r'^    (public|protected|private)( static)? function (\w+)\(', l)
    c = re.match(r'^    (?:(public|protected|private) )?const (\w+)', l)
    p = re.match(r'^    (public|protected|private)( static)? (?:\??[\w\\]+ )?\$(\w+)', l)
    if m:
        name = m.group(3)
        end = method_end(i)
        members[name] = dict(kind='method', start=leading_doc(i), sig_line=i, end=end, vis=m.group(1), static=bool(m.group(2)))
        order.append(name); i = end + 1; continue
    if c:
        name = c.group(2)
        end = i
        if not l.rstrip().endswith(';'):
            end = next(j for j in range(i+1, len(lines)) if lines[j].rstrip().endswith(';') and (lines[j].startswith('    ]') or lines[j].startswith('    )') or lines[j].strip().endswith('];')))
        members[name] = dict(kind='const', start=leading_doc(i), sig_line=i, end=end, vis=c.group(1) or 'public', static=True)
        order.append(name); i = end + 1; continue
    if p:
        name = '$' + p.group(3)
        end = i if l.rstrip().endswith(';') else next(j for j in range(i+1, len(lines)) if lines[j].rstrip().endswith(';'))
        members[name] = dict(kind='prop', start=leading_doc(i), sig_line=i, end=end, vis=p.group(1), static=bool(p.group(2)))
        order.append(name); i = end + 1; continue
    i += 1

class_end = max(j for j, l in enumerate(lines) if l == '}')
covered = set()
for mb in members.values():
    covered.update(range(mb['start'], mb['end'] + 1))
stray = [j + 1 for j in range(class_idx + 1, class_end) if j not in covered and lines[j].strip() not in ('', '{') and not lines[j].strip().startswith(('//', '/*', '*'))]
assert not stray, f'lines not inside any member (parser gap): {stray[:10]}'

assigned = {}
for tname, t in cfg['targets'].items():
    for n in t.get('methods', []) + t.get('consts', []):
        assert n in members, f'unknown member {n}'
        assert n not in assigned, f'{n} assigned twice'
        assigned[n] = tname
for n in cfg.get('keep', []):
    assert n in members, f'unknown member {n}'
    assert n not in assigned, f'{n} assigned twice'
    assigned[n] = '@self'
missing = [n for n in order if n not in assigned]
assert not missing, f'unassigned members: {missing}'

src_dir = os.path.dirname(src_path) or '.'
root_classes = {os.path.basename(p)[:-4] for p in glob.glob(os.path.join(src_dir, '*.php'))}
root_classes.discard(class_name)

REF = re.compile(r'(\$this->|static::|self::)(\w+)(\(|\b)')

def raw(name):
    mb = members[name]
    return '\n'.join(lines[mb['start']:mb['end']+1])

def member_text(name, home):
    """The member's text as it reads in `home` ('@self' or a target class)."""
    text = raw(name)
    def repl(m):
        kind, ref, tail = m.group(1), m.group(2), m.group(3)
        target = assigned.get(ref)
        if target is None:
            if kind == '$this->' and home != '@self':
                raise SystemExit(f'{name}: uses $this->{ref} which is not a member being split — instance state?')
            return m.group(0)
        if target == home:
            return ('static::' if (kind == '$this->' and home != '@self') else kind) + ref + tail
        if target == '@self':
            raise SystemExit(f'{name} (→ {home}) calls {ref}, which stays in {class_name}; move it too or keep {name}')
        return target + '::' + ref + tail
    if home != '@self':
        magic = re.search(r'__DIR__|__FILE__|__CLASS__|static::class|self::class|get_called_class\(\)|__NAMESPACE__', text)
        if magic and name not in cfg.get('allow_magic', []):
            raise SystemExit(f'{name} (→ {home}) uses {magic.group(0)}, which changes meaning when the file moves; fix it by hand after the split and list it under "allow_magic"')
        prop = re.search(r'(?:static|self)::\$(\w+)', text)
        if prop:
            raise SystemExit(f'{name} (→ {home}) reads static::${prop.group(1)}, which stays on {class_name}; keep {name} or move the cache too')
    text = REF.sub(repl, text)
    if home != '@self' and members[name]['kind'] == 'method' and not members[name]['static']:
        text = re.sub(r'^(    (?:public|protected|private)) function ', r'\1 static function ', text, count=1, flags=re.M)
    return text

# a protected member reached from another class becomes public
callers = {}
for name in order:
    for m in REF.finditer(raw(name)):
        ref = m.group(2)
        if ref in assigned and assigned[ref] != assigned[name]:
            callers.setdefault(ref, set()).add(assigned[name])
opened = []
def visibility_fix(name, text):
    mb = members[name]
    if mb['vis'] in ('protected', 'private') and callers.get(name):
        opened.append(name)
        if mb['kind'] == 'method':
            return re.sub(r'^    (?:protected|private) (static )?function ' + name + r'\(', lambda m: '    public ' + (m.group(1) or '') + 'function ' + name + '(', text, count=1, flags=re.M)
        return re.sub(r'^    (?:protected|private) const ' + name.lstrip('$'), '    public const ' + name.lstrip('$'), text, count=1, flags=re.M)
    return text

def use_lines_for(body, root=False):
    needed = [] if root else sorted(c for c in root_classes if re.search(r'(?<![\\\w])' + re.escape(c) + r'::|\bnew ' + re.escape(c) + r'\(|\b' + re.escape(c) + r'\s+\$|\(\s*' + re.escape(c) + r'\s+\$|catch \(' + re.escape(c) + r'\b', body))
    out = [f'use {cfg["root_ns"]}\\{c};' for c in needed]
    for u in uses:
        short = u[4:].rstrip(';').split('\\')[-1].split(' as ')[-1]  # `use Closure;` has no separator
        if re.search(r'\b' + re.escape(short) + r'\b', body) and u not in out:
            out.append(u)
    return sorted(set(out))

# ---- emit target classes -----------------------------------------------------
out_dir = os.path.join(src_dir, cfg['sub_ns'])
os.makedirs(out_dir, exist_ok=True)
report = []
for tname, t in cfg['targets'].items():
    body = '\n\n'.join(visibility_fix(n, member_text(n, tname)) for n in order if assigned[n] == tname)
    doc = t.get('doc', '').strip('\n')
    header = ['<?php', '', f'namespace {cfg["root_ns"]}\\{cfg["sub_ns"]};', '']
    ul = use_lines_for(body)
    if ul:
        header += ul + ['']
    header += ['/**'] + [' * ' + l if l else ' *' for l in doc.split('\n')] + [f' * Moved verbatim out of {class_name} in {cfg["wp"]}.', ' */']
    header += [f'final class {tname}', '{']
    content = '\n'.join(header) + '\n' + body + '\n}\n'
    path = os.path.join(out_dir, tname + '.php')
    open(path, 'w').write(content)
    report.append((path, content.count('\n')))

# ---- emit facade -------------------------------------------------------------
parts = []
for name in order:
    if assigned[name] == '@self':
        parts.append(visibility_fix(name, member_text(name, '@self')))
for name in cfg['facade']:
    mb = members[name]
    assert mb['kind'] == 'method' and mb['vis'] == 'public' and assigned[name] != '@self', name
    sig = lines[mb['sig_line']]
    summary = []
    for dl in lines[mb['start']:mb['sig_line']]:
        t = dl.strip()
        if t.startswith('/**') and t.endswith('*/'):
            summary.append('     * ' + t[3:-2].strip())
            break
        if t in ('/**', '*/') or t.startswith('* @') or t.startswith('#['):
            continue
        if t == '*':
            break
        summary.append(dl)
    doc_lines = ['    /**'] + summary + (['     *'] if summary else []) + [f'     * @see {assigned[name]}::{name}()', '     */']
    params = re.findall(r'\$(\w+)', sig.split('(', 1)[1].rsplit(')', 1)[0])
    call = f'{assigned[name]}::{name}(' + ', '.join('$' + p for p in params) + ')'
    ret = sig.rsplit(')', 1)[1].strip()
    stmt = f'        {call};' if ret == ': void' else f'        return {call};'
    parts.append('\n'.join(doc_lines + [sig, '    {', stmt, '    }']))
consts = [f'    public const {n} = {assigned[n]}::{n};' for n in order
          if members[n]['kind'] == 'const' and members[n]['vis'] == 'public' and assigned[n] != '@self']
extra = cfg.get('facade_doc_extra', '').strip('\n').split('\n')
doc = class_doc[:-1] + [' *'] + [' * ' + l if l else ' *' for l in extra] + [' */']
body = '\n\n'.join(parts)
# the class line's `extends` / `implements` need their imports too
ul = sorted(set(use_lines_for(body + '\n' + class_line, root=True)) | {f'use {cfg["root_ns"]}\\{cfg["sub_ns"]}\\{t};' for t in cfg['targets'] if re.search(r'\b' + t + r'::', body)})
facade = ['<?php', '', f'namespace {cfg["root_ns"]};', ''] + ul + [''] + doc + [class_line, '{']
if consts:
    facade += consts + ['']
facade_text = '\n'.join(facade) + '\n' + body + '\n}\n'
open(src_path, 'w').write(facade_text)
report.append((src_path, facade_text.count('\n')))

for p, n in report:
    print(f'{n:5d}  {p}')
if opened:
    print('protected → public (reached across classes):', ', '.join(opened))
