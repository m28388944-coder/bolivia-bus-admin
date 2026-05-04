with open('src/App.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

for old in [
    'horarios: <div className="text-center py-20 text-gray-400 text-lg">MÃ³dulo de Horarios â€" En desarrollo</div>,',
    'horarios: <div className="text-center py-20 text-gray-400 text-lg">Módulo de Horarios — En desarrollo</div>,',
    "horarios: <div className='text-center py-20 text-gray-400 text-lg'>Módulo de Horarios — En desarrollo</div>,",
]:
    if old in c:
        c = c.replace(old, 'horarios: <Horarios/>,')
        print('Reemplazado OK')
        break

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
print('OK: App.jsx actualizado')