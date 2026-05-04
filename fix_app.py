with open('src/App.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace(
    "import Reportes from './components/Reportes';",
    "import Reportes from './components/Reportes';\nimport Horarios from './components/Horarios';"
)
c = c.replace(
    "horarios: <div className='text-center py-20 text-gray-400 text-lg'>Módulo de Horarios — En desarrollo</div>,",
    "horarios: <Horarios/>,"
)
with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
print('OK: App.jsx actualizado')