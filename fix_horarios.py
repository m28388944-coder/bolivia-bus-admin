with open('src/components/Horarios.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace(
    "if (!confirm(''cancelar'')) return;",
    "if (!window.confirm('Cancelar este horario?')) return;"
)
with open('src/components/Horarios.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
print('OK: Horarios.jsx corregido')