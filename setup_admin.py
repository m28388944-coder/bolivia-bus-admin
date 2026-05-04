with open('tailwind.config.js', 'w', encoding='utf-8') as f:
    f.write(
'/** @type {import(' + chr(39) + 'tailwindcss' + chr(39) + ').Config} */\n'
'export default {\n'
'  content: [' + chr(39) + './index.html' + chr(39) + ', ' + chr(39) + './src/**/*.{js,jsx}' + chr(39) + '],\n'
'  theme: { extend: { colors: { navy: ' + chr(39) + '#1B2A6B' + chr(39) + ', gold: ' + chr(39) + '#D4AF37' + chr(39) + ', bolivian: ' + chr(39) + '#C8102E' + chr(39) + ' } } },\n'
'  plugins: [],\n'
'}\n'
    )
print('OK: tailwind.config.js')

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(
'@tailwind base;\n'
'@tailwind components;\n'
'@tailwind utilities;\n'
'@layer components {\n'
'  .card { @apply bg-white rounded-xl shadow-md p-6 border border-gray-100; }\n'
'  .btn-primary { @apply bg-[#1B2A6B] hover:bg-[#162259] text-white font-semibold py-2 px-4 rounded-lg transition-all; }\n'
'  .btn-danger { @apply bg-[#C8102E] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all; }\n'
'  .badge-active { @apply bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold; }\n'
'  .badge-inactive { @apply bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold; }\n'
'}\n'
    )
print('OK: index.css')