with open('src/api.js', 'w', encoding='utf-8') as f:
    f.write(
'import axios from ' + chr(39) + 'axios' + chr(39) + ';\n'
'const API = axios.create({ baseURL: ' + chr(39) + 'http://localhost:8000/api/v1' + chr(39) + ', headers: { ' + chr(39) + 'Content-Type' + chr(39) + ': ' + chr(39) + 'application/json' + chr(39) + ' } });\n'
'export const getLatestLocations = () => API.get(' + chr(39) + '/tracking/latest' + chr(39) + ');\n'
'export const getSchedules = () => API.get(' + chr(39) + '/schedules/' + chr(39) + ');\n'
'export const searchRoutes = (d) => API.post(' + chr(39) + '/routes/search' + chr(39) + ', d);\n'
'export const getDepartamentos = () => API.get(' + chr(39) + '/routes/departamentos' + chr(39) + ');\n'
'export const getBookings = () => API.get(' + chr(39) + '/bookings/all' + chr(39) + ');\n'
'export const WS_URL = ' + chr(39) + 'ws://localhost:8000/api/v1/tracking/ws/tracking' + chr(39) + ';\n'
'export default API;\n'
    )
print('OK: api.js')