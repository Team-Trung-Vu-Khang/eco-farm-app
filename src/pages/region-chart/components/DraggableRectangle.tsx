import { Rectangle, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

interface DraggableRectangleProps {
  bounds: L.LatLngBoundsExpression;
  setBounds: (b: L.LatLngBounds) => void;
  color?: string;
}

export const DraggableRectangle = ({
  bounds,
  setBounds,
  color = "blue",
}: DraggableRectangleProps) => {
  // Ensure we have a LatLngBounds object
  const boundsObj =
    bounds instanceof L.LatLngBounds ? bounds : L.latLngBounds(bounds as any);
  const sw = boundsObj.getSouthWest();
  const ne = boundsObj.getNorthEast();

  const nw = L.latLng(ne.lat, sw.lng);
  const se = L.latLng(sw.lat, ne.lng);

  const handleDragSW = (e: any) => {
    const newLatLng = e.target.getLatLng();
    setBounds(L.latLngBounds(newLatLng, ne));
  };

  const handleDragNE = (e: any) => {
    const newLatLng = e.target.getLatLng();
    setBounds(L.latLngBounds(sw, newLatLng));
  };

  const handleDragNW = (e: any) => {
    const newLatLng = e.target.getLatLng();
    // NW drag -> SE fixed
    setBounds(L.latLngBounds(se, newLatLng));
  };

  const handleDragSE = (e: any) => {
    const newLatLng = e.target.getLatLng();
    // SE drag -> NW fixed
    setBounds(L.latLngBounds(nw, newLatLng));
  };

  return (
    <>
      <Rectangle bounds={bounds} pathOptions={{ color: color }} />
      {/* SW */}
      <Marker
        position={sw}
        draggable={true}
        eventHandlers={{ drag: handleDragSW }}
      />
      {/* NE */}
      <Marker
        position={ne}
        draggable={true}
        eventHandlers={{ drag: handleDragNE }}
      />
      {/* NW */}
      <Marker
        position={nw}
        draggable={true}
        eventHandlers={{ drag: handleDragNW }}
      />
      {/* SE */}
      <Marker
        position={se}
        draggable={true}
        eventHandlers={{ drag: handleDragSE }}
      />
    </>
  );
};

export const MapController = ({ center }: { center: L.LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);
  return null;
};
