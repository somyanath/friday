# PROTOTYPE: picks one option per slot from each seed by character-code sum mod option count.
import sys, re, pathlib
d = pathlib.Path(sys.argv[1])
ideas = [l for l in (d/'idea-list.md').read_text().splitlines() if re.match(r'^\d+\. ', l)]
slots = (d/'seeds/slots.md').read_text()
def opts(name):
    block = slots.split(f'## {name}')[1].split('##')[0]
    return [l for l in block.splitlines() if re.match(r'^\d+\. ', l)]
axes = [('Concept', ideas), ('Palette', opts('Palette')), ('Type', opts('Type')), ('Layout', opts('Layout')), ('Motion', opts('Motion'))]
cuts = [(0,13),(13,26),(26,39),(39,52),(52,64)]
out = []
for i in range(1,5):
    s = (d/f'seeds/seed-{i}.txt').read_text().strip()
    out.append(f'## Seed {i}')
    for (name, o), (a,b) in zip(axes, cuts):
        total = sum(map(ord, s[a:b])); k = total % len(o)
        out.append(f'- **{name}** (sum {total} mod {len(o)} = {k}): {o[k]}')
    out.append('')
(d/'seeds/picks.md').write_text('# Script picks, SSoT-style round\n\n' + '\n'.join(out))
print('\n'.join(out))
