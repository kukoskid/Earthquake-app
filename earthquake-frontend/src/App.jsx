import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import EarthquakeMap from "./EarthquakeMap";
import "./App.css";

function App() {
    const [earthquakes, setEarthquakes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [minMagnitude, setMinMagnitude] = useState("");
    const [hours, setHours] = useState("");
    const [place, setPlace] = useState("");

    const [sortBy, setSortBy] = useState("timeDesc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const API_BASE = "http://localhost:8080/api/earthquakes";

    const loadEarthquakes = async () => {
        try {
            setError("");
            const response = await axios.get(API_BASE);
            setEarthquakes(response.data);
            setCurrentPage(1);
        } catch (err) {
            setError("Failed to load earthquake data.");
        }
    };

    const fetchLatest = async () => {
        try {
            setLoading(true);
            setError("");
            await axios.post(
                `${API_BASE}/fetch?minMagnitude=${minMagnitude || 2.0}`
            );
            await loadEarthquakes();
        } catch (err) {
            setError("Failed to fetch latest earthquakes.");
        } finally {
            setLoading(false);
        }
    };

    const filterByMagnitude = async () => {
        try {
            setError("");

            if (minMagnitude === "" || isNaN(minMagnitude)) {
                setError("Enter a valid minimum magnitude.");
                return;
            }

            const response = await axios.get(`${API_BASE}/filter/magnitude`, {
                params: {
                    minMagnitude: Number(minMagnitude),
                },
            });

            setEarthquakes(response.data);
            setCurrentPage(1);
        } catch (err) {
            setError("Failed to filter by magnitude.");
        }
    };

    const filterByTime = async () => {
        try {
            setError("");

            if (hours === "" || isNaN(hours)) {
                setError("Enter valid hours.");
                return;
            }

            const afterTime = Date.now() - Number(hours) * 60 * 60 * 1000;

            const response = await axios.get(`${API_BASE}/filter/time`, {
                params: {
                    afterTime,
                },
            });

            setEarthquakes(response.data);
            setCurrentPage(1);
        } catch (err) {
            setError("Failed to filter by time.");
        }
    };

    const filterByPlace = async () => {
        try {
            setError("");

            if (place.trim() === "") {
                setError("Enter a place.");
                return;
            }

            const response = await axios.get(`${API_BASE}/filter/combined`, {
                params: {
                    place: place.trim(),
                },
            });

            setEarthquakes(response.data);
            setCurrentPage(1);
        } catch (err) {
            setError("Failed to filter by place.");
        }
    };

    const applyCombinedFilters = async () => {
        try {
            setError("");

            const hasMagnitude = minMagnitude !== "" && !isNaN(minMagnitude);
            const hasHours = hours !== "" && !isNaN(hours);
            const hasPlace = place.trim() !== "";

            if (!hasMagnitude && !hasHours && !hasPlace) {
                setError("Enter at least one filter.");
                return;
            }

            const afterTime = hasHours
                ? Date.now() - Number(hours) * 60 * 60 * 1000
                : null;

            const response = await axios.get(`${API_BASE}/filter/combined`, {
                params: {
                    minMagnitude: hasMagnitude ? Number(minMagnitude) : null,
                    afterTime,
                    place: hasPlace ? place.trim() : "",
                },
            });

            setEarthquakes(response.data);
            setCurrentPage(1);
        } catch (err) {
            setError("Failed to apply combined filters.");
        }
    };

    const resetFilters = async () => {
        setMinMagnitude("");
        setHours("");
        setPlace("");
        setSortBy("timeDesc");
        setCurrentPage(1);
        await loadEarthquakes();
    };

    const deleteEarthquake = async (id) => {
        try {
            setError("");
            await axios.delete(`${API_BASE}/${id}`);
            await loadEarthquakes();
        } catch (err) {
            setError("Failed to delete earthquake.");
        }
    };

    useEffect(() => {
        loadEarthquakes();
    }, []);

    const sortedEarthquakes = useMemo(() => {
        const copy = [...earthquakes];

        switch (sortBy) {
            case "magAsc":
                return copy.sort((a, b) => (a.magnitude || 0) - (b.magnitude || 0));
            case "magDesc":
                return copy.sort((a, b) => (b.magnitude || 0) - (a.magnitude || 0));
            case "timeAsc":
                return copy.sort((a, b) => (a.time || 0) - (b.time || 0));
            case "timeDesc":
            default:
                return copy.sort((a, b) => (b.time || 0) - (a.time || 0));
        }
    }, [earthquakes, sortBy]);

    const totalPages = Math.ceil(sortedEarthquakes.length / itemsPerPage);

    const paginatedEarthquakes = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedEarthquakes.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedEarthquakes, currentPage]);

    const getMagnitudeClass = (magnitude) => {
        if (magnitude >= 5) return "mag-high";
        if (magnitude >= 3) return "mag-medium";
        return "mag-low";
    };

    return (
        <div className="app-page">
            <div className="container py-4">
                <div className="hero-card mb-4">
                    <div>
                        <h1 className="app-title">Earthquake Dashboard</h1>
                        <p className="app-subtitle">
                            View, filter, sort and manage the latest earthquake records.
                        </p>
                    </div>

                    <button
                        className="btn btn-primary fetch-btn"
                        onClick={fetchLatest}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Fetch Latest Earthquakes"}
                    </button>
                </div>

                <div className="filter-card mb-4">
                    <h4 className="section-title">Filters & Search</h4>

                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Minimum Magnitude</label>
                            <input
                                type="number"
                                step="0.1"
                                className="form-control"
                                placeholder="e.g. 3.0"
                                value={minMagnitude}
                                onChange={(e) => setMinMagnitude(e.target.value)}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Last X Hours</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g. 24"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Search by Place</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Alaska"
                                value={place}
                                onChange={(e) => setPlace(e.target.value)}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Sort By</label>
                            <select
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="timeDesc">Newest First</option>
                                <option value="timeAsc">Oldest First</option>
                                <option value="magDesc">Magnitude High → Low</option>
                                <option value="magAsc">Magnitude Low → High</option>
                            </select>
                        </div>
                    </div>

                    <div className="filter-actions mt-3">
                        <button className="btn btn-warning" onClick={filterByMagnitude}>
                            Filter Magnitude
                        </button>

                        <button className="btn btn-info" onClick={filterByTime}>
                            Filter Time
                        </button>

                        <button className="btn btn-success" onClick={filterByPlace}>
                            Search Place
                        </button>

                        <button className="btn btn-dark" onClick={applyCombinedFilters}>
                            Combined Filter
                        </button>

                        <button className="btn btn-secondary" onClick={resetFilters}>
                            Reset
                        </button>
                    </div>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="stats-row mb-4">
                    <div className="stat-card">
                        <span className="stat-label">Total Records</span>
                        <span className="stat-value">{sortedEarthquakes.length}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Current Page</span>
                        <span className="stat-value">
              {totalPages === 0 ? 1 : currentPage}
            </span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Pages</span>
                        <span className="stat-value">{totalPages || 1}</span>
                    </div>
                </div>

                <EarthquakeMap earthquakes={sortedEarthquakes} />

                <div className="table-card mt-4">
                    <div className="table-responsive">
                        <table className="table custom-table align-middle mb-0">
                            <thead>
                            <tr>
                                <th>USGS ID</th>
                                <th>Magnitude</th>
                                <th>Mag Type</th>
                                <th>Place</th>
                                <th>Title</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedEarthquakes.length > 0 ? (
                                paginatedEarthquakes.map((eq) => (
                                    <tr key={eq.externalId || eq.id}>
                                        <td className="id-cell">{eq.externalId}</td>
                                        <td>
                        <span
                            className={`magnitude-badge ${getMagnitudeClass(
                                eq.magnitude
                            )}`}
                        >
                          {eq.magnitude ?? "N/A"}
                        </span>
                                        </td>
                                        <td>{eq.magType || "N/A"}</td>
                                        <td>{eq.place || "N/A"}</td>
                                        <td>{eq.title || "N/A"}</td>
                                        <td>
                                            {eq.time ? new Date(eq.time).toLocaleString() : "N/A"}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => deleteEarthquake(eq.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        No earthquake data found
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination-box">
                        <button
                            className="btn btn-outline-primary btn-sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                            Previous
                        </button>

                        <span className="page-indicator">
              Page {totalPages === 0 ? 1 : currentPage} of {totalPages || 1}
            </span>

                        <button
                            className="btn btn-outline-primary btn-sm"
                            disabled={currentPage >= totalPages || totalPages === 0}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;