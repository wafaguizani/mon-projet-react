import React, { useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, LabelList
} from "recharts";

function TypePage({ data }) {
  useEffect(() => {
    console.log("✅ Données reçues dans TypePage :", data);
    if (data?.length > 0) console.log("🧪 Exemple de ligne :", data[0]);
  }, [data]);

  if (!data || data.length === 0) {
    return <p>📂 Aucune donnée Excel chargée.</p>;
  }

  const allKeys = Object.keys(data[0]);
  const typeKey = allKeys.find(k => k.toLowerCase().includes("repa_instart"));
  const minKey = allKeys.find(k => k.toLowerCase().includes("user_min"));

  if (!typeKey || !minKey) {
    return (
      <div>
        <p>🚫 Colonnes nécessaires non trouvées.</p>
        <p><strong>Colonnes disponibles :</strong></p>
        <ul>{allKeys.map(k => <li key={k}>{k}</li>)}</ul>
      </div>
    );
  }

  const validTypes = ["wartung", "error proofing", "stoerung"];

  const timeByType = {};
  data.forEach(row => {
    const rawType = row[typeKey]?.trim()?.toLowerCase() || "inconnu";
    const minutes = parseInt(row[minKey]) || 0;

    if (validTypes.includes(rawType)) {
      const type = rawType.charAt(0).toUpperCase() + rawType.slice(1);
      timeByType[type] = (timeByType[type] || 0) + minutes;
    }
  });

  const summaryData = Object.entries(timeByType).map(([type, minutes]) => ({
    type,
    minutes,
  }));

  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI, sans-serif", background: "#f4f7fa", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "2rem" }}>
        ⏱️ Temps total par type de panne
      </h2>

      {/* Tableau stylé */}
      <div style={{
        overflowX: "auto",
        marginBottom: "2rem",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        padding: "1rem"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#1976d2", color: "#fff" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Total Minutes</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map(row => (
              <tr key={row.type} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{row.type}</td>
                <td style={{ padding: "12px" }}>{row.minutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Histogramme moderne */}
      <h3 style={{ textAlign: "center", color: "#444", marginBottom: "1rem" }}>📊 Histogramme</h3>
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "20px",
        padding: "2rem",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={summaryData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <defs>
              <linearGradient id="typeColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00c6ff" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#0072ff" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis
              dataKey="type"
              tick={{ fontSize: 12, angle: -45, textAnchor: "end", fill: "#333" }}
              interval={0}
              height={80}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#555" }}
              label={{
                value: 'Minutes',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#555', fontSize: 14 },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "none",
              }}
              cursor={{ fill: "rgba(0, 150, 255, 0.05)" }}
            />
            <Bar dataKey="minutes" fill="url(#typeColor)" radius={[8, 8, 0, 0]}>
              <LabelList dataKey="minutes" position="top" style={{ fill: "#333", fontWeight: "bold", fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TypePage;
