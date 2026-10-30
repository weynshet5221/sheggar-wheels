"use client";

import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((module) => module.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((module) => module.TileLayer),
  { ssr: false }
);

const CircleMarker = dynamic(
  () => import("react-leaflet").then((module) => module.CircleMarker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((module) => module.Popup),
  { ssr: false }
);

const Polyline = dynamic(
  () => import("react-leaflet").then((module) => module.Polyline),
  { ssr: false }
);

const LOCATIONS = {
  Bole: [8.9806, 38.7578],
  Kazanchis: [9.0105, 38.7613],
  CMC: [9.0227, 38.8351],
  Piassa: [9.03, 38.75],
  Sarbet: [8.99, 38.73],
  Gotera: [8.97, 38.76],
  "4 Kilo": [9.035, 38.761],
  Lebu: [8.91, 38.69]
};

export function CarMap({
  neighbourhood = "Bole",
  latitude,
  longitude,
  title = "Vehicle pickup area"
}) {
  const point =
    Number.isFinite(latitude) && Number.isFinite(longitude)
      ? [latitude, longitude]
      : LOCATIONS[neighbourhood] || [9.0192, 38.7525];

  return (
    <div className="map-shell" aria-label={`${title} map`}>
      <MapContainer
        center={point}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CircleMarker
          center={point}
          radius={9}
          pathOptions={{
            color: "#193d2b",
            fillColor: "#b9674b",
            fillOpacity: 1
          }}
        >
          <Popup>
            {title}: {neighbourhood || "Addis Ababa"}
          </Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}

export function TripMap({
  start = [8.9806, 38.7578],
  destination = [9.03, 38.75]
}) {
  const route = [start, destination];

  return (
    <div className="map-shell" aria-label="Trip route map">
      <MapContainer
        bounds={route}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline
          positions={route}
          pathOptions={{
            color: "#b9674b",
            weight: 5,
            opacity: 0.85
          }}
        />

        <CircleMarker
          center={start}
          radius={7}
          pathOptions={{
            color: "#193d2b",
            fillColor: "#193d2b",
            fillOpacity: 1
          }}
        >
          <Popup>Pickup point</Popup>
        </CircleMarker>

        <CircleMarker
          center={destination}
          radius={8}
          pathOptions={{
            color: "#b9674b",
            fillColor: "#b9674b",
            fillOpacity: 1
          }}
        >
          <Popup>Destination</Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}

export default CarMap;