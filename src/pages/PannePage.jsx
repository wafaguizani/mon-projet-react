import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, LabelList
} from "recharts";

function PannePage({ data }) {
  const [viewBy, setViewBy] = useState("code");
  const [typeSelected, setTypeSelected] = useState("");
  const [showTop5, setShowTop5] = useState(false);

  useEffect(() => {
    console.log("📊 Données reçues dans PannePage:", data);
  }, [data]);

  if (!data || data.length === 0) {
    return <p>📂 Aucune donnée Excel chargée.</p>;
  }

  const allKeys = Object.keys(data[0]);
  const typeKey = allKeys.find(k => k.toLowerCase().includes("repa_instart"));
  const stationKey = allKeys.find(k => k.toLowerCase().includes("repa_wpgnr"));
  const errorKey = allKeys.find(k => k.toLowerCase().includes("errorcode"));
  const minKey = allKeys.find(k => k.toLowerCase().includes("user_min"));

  if (!typeKey || !stationKey || !errorKey || !minKey) {
    return <p>🚫 Colonnes essentielles non trouvées.</p>;
  }

  const acceptedTypes = ["Wartung", "Stoerung", "Error proofing"];

  const filteredData = data.filter(row =>
    acceptedTypes.includes((row[typeKey] || "").trim())
  );

  const groupedData = {};
  filteredData.forEach(row => {
    const type = row[typeKey]?.trim();
    const station = row[stationKey]?.toString().trim() || "?";
    const errorCodeRaw = row[errorKey];
    const errorCode = typeof errorCodeRaw === "string"
      ? errorCodeRaw.trim()
      : String(errorCodeRaw || "Code?");
    const minutes = parseInt(row[minKey]) || 0;

    if (!groupedData[type]) groupedData[type] = {};
    if (!groupedData[type][station]) groupedData[type][station] = {};
    if (!groupedData[type][station][errorCode]) groupedData[type][station][errorCode] = 0;

    groupedData[type][station][errorCode] += minutes;
  });

  const selectedGroup = groupedData[typeSelected] || {};

  const chartData =
    viewBy === "code"
      ? Object.entries(selectedGroup).reduce((acc, [_, errors]) => {
          Object.entries(errors).forEach(([code, min]) => {
            const existing = acc.find(e => e.code === code);
            if (existing) existing.minutes += min;
            else acc.push({ code, minutes: min });
          });
          return acc;
        }, [])
      : Object.entries(selectedGroup).map(([station, errors]) => ({
          station,
          minutes: Object.values(errors).reduce((a, b) => a + b, 0)
        }));

  const chartDataSorted = [...chartData].sort((a, b) => b.minutes - a.minutes);
  const displayData = showTop5 ? chartDataSorted.slice(0, 5) : chartDataSorted;

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f9fafb", fontFamily: "Segoe UI, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        📍 Détail des erreurs par type
      </h2>

      {/* Filtres */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
        <label>
          🔧 Type :
          <select
            value={typeSelected}
            onChange={e => setTypeSelected(e.target.value)}
            style={{ marginLeft: "10px", padding: "6px", borderRadius: "6px" }}
          >
            <option value="">-- Choisir un type --</option>
            {acceptedTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <label>
          📊 Vue :
          <select
            value={viewBy}
            onChange={(e) => setViewBy(e.target.value)}
            style={{ marginLeft: "10px", padding: "6px", borderRadius: "6px" }}
          >
            <option value="code">Par code erreur</option>
            <option value="station">Par station</option>
          </select>
        </label>

        <label>
          🔝 Top 5
          <input
            type="checkbox"
            checked={showTop5}
            onChange={() => setShowTop5(!showTop5)}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      {typeSelected && (
        <>
          <h3 style={{ marginBottom: "1rem", color: "#444" }}>
            🔧 Type sélectionné : {typeSelected}
          </h3>

          {/* Tableau */}
          <div style={{ overflowX: "auto", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "2rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#ff7043", color: "white" }}>
                <tr>
                  <th style={{ padding: "10px" }}>Station</th>
                  <th style={{ padding: "10px" }}>Code erreur</th>
                  <th style={{ padding: "10px" }}>Temps (min)</th>
                  <th style={{ padding: "10px" }}>Total station</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(selectedGroup).flatMap(([station, errors]) => {
                  const total = Object.values(errors).reduce((a, b) => a + b, 0);
                  return Object.entries(errors).map(([code, min], i) => (
                    <tr key={`${typeSelected}-${station}-${code}-${i}`} style={{ background: i % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                      <td style={{ padding: "10px" }}>{i === 0 ? station : ""}</td>
                      <td style={{ padding: "10px" }}>
                        <Link to={`/detail-panne/${code}`} style={{ textDecoration: "none", color: "#ff5722", fontWeight: "bold" }}>
                          {code}
                        </Link>
                      </td>
                      <td style={{ padding: "10px" }}>{min}</td>
                      <td style={{ padding: "10px" }}>{i === 0 ? <strong>{total}</strong> : ""}</td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>

          {/* Histogramme */}
          <h4 style={{ textAlign: "center", marginBottom: "1rem" }}>
            📊 Histogramme {viewBy === "code" ? "par code d’erreur" : "par station"}
          </h4>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
          }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff7043" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#bf360c" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={viewBy === "code" ? "code" : "station"}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  label={{ value: "Minutes", angle: -90, position: "insideLeft", style: { fill: "#555" } }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    border: "none",
                  }}
                  cursor={{ fill: "rgba(255, 112, 67, 0.1)" }}
                />
                <Bar dataKey="minutes" fill="url(#grad)" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="minutes" position="top" style={{ fill: "#333", fontSize: 12 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default PannePage;
