import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, LabelList
} from "recharts";

function TimePage({ data }) {
  useEffect(() => {
    console.log("✅ Données reçues dans TimePage :", data);
    if (data?.length > 0) console.log("🧪 Exemple de ligne :", data[0]);
  }, [data]);

  if (!data || data.length === 0) {
    return <p>📂 Aucune donnée Excel chargée.</p>;
  }

  const allKeys = Object.keys(data[0]);
  const userKey = allKeys.find(k => k.toLowerCase().includes("user_id"));
  const minKey = allKeys.find(k => k.toLowerCase().includes("user_min"));

  if (!userKey || !minKey) {
    return (
      <div>
        <p>🚫 Colonnes non trouvées.</p>
        <p><strong>Colonnes disponibles :</strong></p>
        <ul>
          {allKeys.map(k => <li key={k}>{k}</li>)}
        </ul>
      </div>
    );
  }

  const timeByTechnician = {};
  data.forEach(row => {
    const tech = row[userKey]?.trim();
    const minutes = parseInt(row[minKey]) || 0;
    if (tech) timeByTechnician[tech] = (timeByTechnician[tech] || 0) + minutes;
  });

  const summaryData = Object.entries(timeByTechnician).map(([name, minutes]) => ({
    name,
    minutes,
  }));

  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI, sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        Temps total par technicien
      </h2>

      {/* Tableau moderne */}
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "2rem",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <thead style={{ backgroundColor: "#2196f3", color: "#fff" }}>
          <tr>
            <th style={{ padding: "12px", textAlign: "left" }}>Technicien</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Temps (minutes)</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map(row => (
            <tr key={row.name} style={{ backgroundColor: "#fff", borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px" }}>
                <Link
                  to={`/detail-technicien/${encodeURIComponent(row.name)}`}
                  style={{ color: "#0077cc", fontWeight: "bold", textDecoration: "none" }}
                >
                  {row.name}
                </Link>
              </td>
              <td style={{ padding: "12px" }}>{row.minutes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Histogramme moderne */}
      <h3 style={{ textAlign: "center", marginBottom: "1rem", color: "#444" }}>
        Histogramme du temps passé
      </h3>
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
            barCategoryGap="25%"
          >
            <defs>
              <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4fc3f7" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#0288d1" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, angle: -45, textAnchor: "end", fill: "#444" }}
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
              cursor={{ fill: "rgba(33, 150, 243, 0.05)" }}
            />
            <Bar
              dataKey="minutes"
              fill="url(#colorTech)"
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
            >
              <LabelList
                dataKey="minutes"
                position="top"
                style={{ fill: "#333", fontSize: 12, fontWeight: "bold" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TimePage;
