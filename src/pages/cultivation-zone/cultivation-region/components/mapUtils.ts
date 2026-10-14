import L from "leaflet";

const COLOR_MAP: Record<string, { fill: string; stroke: string }> = {
  blue: { fill: "#2563EB", stroke: "#1D4ED8" },
  green: { fill: "#139B62", stroke: "#0D6E45" }, // Design system Primary
  amber: { fill: "#F59E0B", stroke: "#D97706" }, // Sub-area marker
  orange: { fill: "#EA580C", stroke: "#C2410C" },
  gold: { fill: "#EAB308", stroke: "#CA8A04" },
  red: { fill: "#EF4444", stroke: "#DC2626" },
  yellow: { fill: "#FBBF24", stroke: "#D97706" },
  grey: { fill: "#64748B", stroke: "#475569" },
  black: { fill: "#1E293B", stroke: "#0F172A" },
  violet: { fill: "#7C3AED", stroke: "#6D28D9" },
};

export const getMarkerIcon = (color: string = "blue") => {
  const palette = COLOR_MAP[color.toLowerCase()] || {
    fill: color.startsWith("#") || color.startsWith("rgb") ? color : "#2563EB",
    stroke: "#1D4ED8",
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41" width="25" height="41">
  <defs>
    <filter id="shadow" x="-30%" y="-20%" width="160%" height="160%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <path d="M12.5 1 C5.87 1 0.5 6.37 0.5 13 C0.5 22.5 12.5 40 12.5 40 C12.5 40 24.5 22.5 24.5 13 C24.5 6.37 19.13 1 12.5 1 Z" fill="${palette.fill}" stroke="${palette.stroke}" stroke-width="1.2" filter="url(#shadow)"/>
  <circle cx="12.5" cy="13" r="4.5" fill="#FFFFFF" opacity="0.95"/>
</svg>`;

  return L.icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [1, -28],
  });
};
