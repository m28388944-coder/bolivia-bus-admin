with open('src/components/TrackingMap.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old = 'background: s.bg, border: 2px solid  }}></div>'
new = 'background: s.bg, border: "2px solid " + s.accent }}></div>'

if old in c:
    c = c.replace(old, new)
    print('Reemplazado OK')
else:
    print('No encontrado, buscando...')
    idx = c.find('2px solid')
    print(repr(c[idx-20:idx+40]))

with open('src/components/TrackingMap.jsx', 'w', encoding='utf-8') as f:
    f.write(c)