import { MapContainer, TileLayer, Popup, CircleMarker, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

function getMarkerColor(magnitude) {
    if (magnitude >= 5) return "red";
    if (magnitude >= 3) return "orange";
    return "gold";
}

function getMarkerRadius(magnitude) {
    if (magnitude == null) return 6;
    if (magnitude >= 5) return 14;
    if (magnitude >= 4) return 12;
    if (magnitude >= 3) return 10;
    if (magnitude >= 2) return 8;
    return 6;
}

function FitBoundsToEarthquakes({ earthquakes }) {
    const map = useMap();

    useEffect(() => {
        if (!earthquakes || earthquakes.length === 0) return;

        if (earthquakes.length === 1) {
            map.setView([earthquakes[0].latitude, earthquakes[0].longitude], 7);
            return;
        }

        const bounds = L.latLngBounds(
            earthquakes.map((eq) => [eq.latitude, eq.longitude])
        );

        map.fitBounds(bounds, { padding: [30, 30] });
    }, [earthquakes, map]);

    return null;
}

function Legend() {
    const map = useMap();

    useEffect(() => {
        const legend = L.control({ position: "topright" });

        legend.onAdd = function () {
            const div = L.DomUtil.create("div", "legend-box");
            div.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px;">Magnitude</div>
        <div class="legend-item">
          <span class="legend-color" style="background:red;"></span>
          <span>5.0+</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background:orange;"></span>
          <span>3.0 - 4.9</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background:gold;"></span>
          <span>Below 3.0</span>
        </div>
      `;
            return div;
        };

        legend.addTo(map);

        return () => {
            legend.remove();
        };
    }, [map]);

    return null;
}

function EarthquakeMap({ earthquakes }) {
    const validEarthquakes = earthquakes.filter(
        (eq) =>
            eq.latitude !== null &&
            eq.latitude !== undefined &&
            eq.longitude !== null &&
            eq.longitude !== undefined
    );

    return (
        <div className="map-wrapper">
            <MapContainer
                center={[41.9981, 21.4254]}
                zoom={7}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FitBoundsToEarthquakes earthquakes={validEarthquakes} />
                <Legend />

                {validEarthquakes.map((eq) => (
                    <CircleMarker
                        key={eq.externalId || eq.id}
                        center={[eq.latitude, eq.longitude]}
                        radius={getMarkerRadius(eq.magnitude)}
                        pathOptions={{
                            color: getMarkerColor(eq.magnitude),
                            fillColor: getMarkerColor(eq.magnitude),
                            fillOpacity: 0.7,
                            weight: 2,
                        }}
                    >
                        <Popup maxWidth={320} keepInView={true}>
                            <div>
                                <h6 style={{ marginBottom: "8px" }}>{eq.title || "Earthquake"}</h6>
                                <div><strong>USGS ID:</strong> {eq.externalId || "N/A"}</div>
                                <div><strong>Place:</strong> {eq.place || "N/A"}</div>
                                <div><strong>Magnitude:</strong> {eq.magnitude ?? "N/A"}</div>
                                <div><strong>Magnitude Type:</strong> {eq.magType || "N/A"}</div>
                                <div><strong>Latitude:</strong> {eq.latitude ?? "N/A"}</div>
                                <div><strong>Longitude:</strong> {eq.longitude ?? "N/A"}</div>
                                <div><strong>Time:</strong> {eq.time ? new Date(eq.time).toLocaleString() : "N/A"}</div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
}

export default EarthquakeMap;