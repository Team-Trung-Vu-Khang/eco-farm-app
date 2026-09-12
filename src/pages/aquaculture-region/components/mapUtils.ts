export const getMarkerIcon = (color: string = "red") => {
  return {
    url:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-" +
      color +
      ".png",
    scaledSize: new google.maps.Size(25, 41),
    anchor: new google.maps.Point(12, 41),
  };
};
