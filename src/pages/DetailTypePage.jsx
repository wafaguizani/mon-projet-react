import React from "react";
import { useParams } from "react-router-dom";

// ✅ Conversion précise des dates Excel en Date JS
const excelDateToJSDate = (serial) => {
  if (!serial || isNaN(serial)) return "";
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // 30 décembre 1899
  return new Date(excelEpoch.getTime() + serial * millisecondsPerDay);
};

function DetailTypePage({ data }) {
  const { typeName } = useParams();

  const normalize = (str) =>
    (str || "").trim().toLowerCase().replace(/\s+/g, "");

  if (!data || data.length === 0) {
    return <p>📂 Aucune donnée Excel chargée.</p>;
  }

  const allKeys = Object.keys(data[0]);

  const typeKey = allKeys.find((k) =>
    k.toLowerCase().includes("repa_instart")
  );
  const startKey = allKeys.find((k) =>
    k.toLowerCase().includes("repa_atermin")
  );
  const endKey = allKeys.find((k) =>
    k.toLowerCase().includes("repa_etermin")
  );
  const techKey = allKeys.find((k) =>
    k.toLowerCase().includes("user_id")
  );
  const minKey = allKeys.find((k) =>
    k.toLowerCase().includes("user_min")
  );
  const stationKey = allKeys.find((k) =>
    k.toLowerCase().includes("repa_wpgnr")
  );

  const filtered = data.filter((row) => {
    const raw = normalize(row[typeKey]);
    const target = normalize(typeName);
    return raw === target;
  });

  if (filtered.length === 0) {
    return (
      <div style={{ padding: "2rem" }}>
        <h3>❌ Aucun enregistrement trouvé pour : <strong>{typeName}</strong></h3>
        <p>Vérifie que le type est bien présent dans les données Excel.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI, sans-serif" }}>
      <h2 style={{ marginBottom: "1.5rem", color: "#003366" }}>
        🔍 Détails pour le type : <strong>{typeName}</strong>
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          boxShadow: "0 0 10px rgba(0,0,0,0.05)",
        }}
      >
        <thead style={{ backgroundColor: "#1976d2", color: "white" }}>
          <tr>
            <th style={{ padding: "10px" }}>🕒 Début</th>
            <th style={{ padding: "10px" }}>⏰ Fin</th>
            <th style={{ padding: "10px" }}>👨‍🔧 Technicien</th>
            {stationKey && <th style={{ padding: "10px" }}>🏭 Station</th>}
            <th style={{ padding: "10px" }}>⏳ Durée (min)</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, i) => {
            const startDate = excelDateToJSDate(row[startKey]);
            const endDate = excelDateToJSDate(row[endKey]);

            return (
              <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px" }}>{startDate.toLocaleString()}</td>
                <td style={{ padding: "8px" }}>{endDate.toLocaleString()}</td>
                <td style={{ padding: "8px" }}>{row[techKey]}</td>
                {stationKey && (
                  <td style={{ padding: "8px" }}>{row[stationKey]}</td>
                )}
                <td style={{ padding: "8px" }}>{row[minKey]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DetailTypePage;
