import React from "react";
import { useParams } from "react-router-dom";

function DetailPanneTechnicien({ data }) {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);

  const allKeys = Object.keys(data[0]);
  const userKey = allKeys.find(k => k.toLowerCase().includes("user_id"));
  const stationKey = allKeys.find(k => k.toLowerCase().includes("repa_wpgnr"));
  const errorKey = allKeys.find(k => k.toLowerCase().includes("errorcode"));
  const minKey = allKeys.find(k => k.toLowerCase().includes("user_min"));
  const textKey = allKeys.find(k => k.toLowerCase().includes("text")); // Texte erreur

  const filtered = data.filter(row =>
    (row[userKey] || "").trim() === decodedName
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛠️ Détail des interventions - {decodedName}</h2>

      {filtered.length === 0 ? (
        <p>Aucune intervention trouvée.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Code erreur</th>
              <th>Texte erreur</th>
              <th>Station</th>
              <th>Temps (min)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, index) => (
              <tr key={index}>
                <td>{row[errorKey]}</td>
                <td>{row[textKey] || "—"}</td>
                <td>{row[stationKey]}</td>
                <td>{row[minKey]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DetailPanneTechnicien;
