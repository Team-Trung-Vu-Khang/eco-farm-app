import { Marker, Rectangle, useGoogleMap } from "@react-google-maps/api";
import { useEffect } from "react";

interface DraggableRectangleProps {
  bounds: google.maps.LatLngBoundsLiteral;
  setBounds: (b: google.maps.LatLngBoundsLiteral) => void;
  color?: string;
}

export const DraggableRectangle = ({
  bounds,
  setBounds,
  color = "blue",
}: DraggableRectangleProps) => {
  const { north, south, east, west } = bounds;

  const sw = { lat: south, lng: west };
  const ne = { lat: north, lng: east };
  const nw = { lat: north, lng: west };
  const se = { lat: south, lng: east };

  const handleDragSW = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    setBounds({ south: e.latLng.lat(), west: e.latLng.lng(), north, east });
  };

  const handleDragNE = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    setBounds({ south, west, north: e.latLng.lat(), east: e.latLng.lng() });
  };

  const handleDragNW = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    // NW drag -> SE fixed
    setBounds({ south, east, north: e.latLng.lat(), west: e.latLng.lng() });
  };

  const handleDragSE = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    // SE drag -> NW fixed
    setBounds({ north, west, south: e.latLng.lat(), east: e.latLng.lng() });
  };

  return (
    <>
      <Rectangle
        bounds={bounds}
        options={{ strokeColor: color, fillOpacity: 0.1 }}
      />
      {/* SW */}
      <Marker position={sw} draggable onDrag={handleDragSW} />
      {/* NE */}
      <Marker position={ne} draggable onDrag={handleDragNE} />
      {/* NW */}
      <Marker position={nw} draggable onDrag={handleDragNW} />
      {/* SE */}
      <Marker position={se} draggable onDrag={handleDragSE} />
    </>
  );
};

export const MapController = ({
  center,
}: {
  center: { lat: number; lng: number };
}) => {
  const map = useGoogleMap();

  useEffect(() => {
    if (!map) return;
    // Keep the current zoom level instead of forcing a default so manual zooms persist
    const currentZoom = map.getZoom();
    map.panTo(center);
    if (currentZoom !== undefined) map.setZoom(currentZoom);
  }, [center, map]);

  return null;
};
