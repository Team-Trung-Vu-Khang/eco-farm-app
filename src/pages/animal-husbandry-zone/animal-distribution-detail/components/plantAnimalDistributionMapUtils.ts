import L from "leaflet";

export const createCustomIcon = (color: string, isSelected: boolean) => {
  const size = isSelected ? 16 : 12;
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}"
        fill="${color}"
        stroke="${isSelected ? "#fff" : color}"
        stroke-width="${isSelected ? 2 : 1}"
        opacity="${isSelected ? 1 : 0.8}"/>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: "custom-animal-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};
