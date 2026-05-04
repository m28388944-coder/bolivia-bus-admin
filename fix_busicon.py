with open('src/components/TrackingMap.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old = '''function createBusIcon(bus) {
  const style = COMPANY_STYLES[bus.company] || { bg: "#555", accent: "#fff", label: "BUS", shape: "circle" };
  const emoji = TYPE_EMOJI[bus.bus_type] || "🚌";
  const isMoving = bus.speed_kmh > 0;

  const shapes = {
    diamond: <polygon points="28,4 52,28 28,52 4,28" fill="" stroke="" stroke-width="3"/>,
    circle:  <circle cx="28" cy="28" r="24" fill="" stroke="" stroke-width="3"/>,
    square:  <rect x="4" y="4" width="48" height="48" rx="8" fill="" stroke="" stroke-width="3"/>,
  };

  const pulse = isMoving ? 
    <circle cx="28" cy="28" r="26" fill="none" stroke="" stroke-width="2" opacity="0.6">
      <animate attributeName="r" from="26" to="38" dur="1.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite"/>
    </circle> : "";

  const svg = <svg xmlns="http://www.w3.org/2000/svg" width="56" height="72" viewBox="0 0 56 72">
    
    
    <text x="28" y="24" text-anchor="middle" font-size="16" font-family="Arial"></text>
    <text x="28" y="38" text-anchor="middle" font-size="8" font-weight="bold" fill="" font-family="Arial"></text>
    <text x="28" y="48" text-anchor="middle" font-size="6" fill="" font-family="Arial"></text>
    <polygon points="22,54 34,54 28,66" fill=""/>
  </svg>;

  return L.divIcon({
    html: svg,
    iconSize: [56, 72],
    iconAnchor: [28, 66],
    className: "",
  });
}'''

new_func = '''function createBusIcon(bus) {
  const style = COMPANY_STYLES[bus.company] || { bg: "#555", accent: "#fff", label: "BUS", shape: "circle" };
  const isMoving = bus.speed_kmh > 0;
  const bg = style.bg;
  const acc = style.accent;
  const lbl = style.label;
  const plate = bus.plate || "";

  let shape = "";
  if (style.shape === "diamond") shape = '<polygon points="28,4 52,28 28,52 4,28" fill="' + bg + '" stroke="' + acc + '" stroke-width="3"/>';
  else if (style.shape === "circle") shape = '<circle cx="28" cy="28" r="24" fill="' + bg + '" stroke="' + acc + '" stroke-width="3"/>';
  else shape = '<rect x="4" y="4" width="48" height="48" rx="8" fill="' + bg + '" stroke="' + acc + '" stroke-width="3"/>';

  let pulse = "";
  if (isMoving) pulse = '<circle cx="28" cy="28" r="26" fill="none" stroke="' + bg + '" stroke-width="2" opacity="0.6"><animate attributeName="r" from="26" to="38" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite"/></circle>';

  const busEmoji = bus.bus_type === "cama" ? "★" : bus.bus_type === "semicama" ? "◆" : "●";

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="72" viewBox="0 0 56 72">',
    pulse,
    shape,
    '<text x="28" y="26" text-anchor="middle" font-size="14" font-family="Arial" fill="' + acc + '">' + busEmoji + '</text>',
    '<text x="28" y="38" text-anchor="middle" font-size="9" font-weight="bold" fill="' + acc + '" font-family="Arial">' + lbl + '</text>',
    '<text x="28" y="48" text-anchor="middle" font-size="6" fill="' + acc + '" font-family="Arial">' + plate + '</text>',
    '<polygon points="22,54 34,54 28,66" fill="' + bg + '"/>',
    '</svg>',
  ].join("");

  return L.divIcon({
    html: svg,
    iconSize: [56, 72],
    iconAnchor: [28, 66],
    className: "",
  });
}'''

c = c.replace(old, new_func)
with open('src/components/TrackingMap.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
print('OK: createBusIcon corregido')