import React from "react";
import { useParams } from "react-router-dom";

function DetailPannePage({ data }) {
  const { errorCode } = useParams();

  if (!data || data.length === 0) {
    return <p>📂 Aucune donnée Excel chargée.</p>;
  }

  const allKeys = Object.keys(data[0]);
  const codeKey = allKeys.find(k => k.toLowerCase().includes("errorcode"));
  const stationKey = allKeys.find(k => k.toLowerCase().includes("wpgnr"));
  const timeKey = allKeys.find(k => k.toLowerCase().includes("user_min"));
  const userKey = allKeys.find(k => k.toLowerCase().includes("user_id"));
  const textKey = allKeys.find(k => k.toLowerCase().includes("repa_text"));

  if (!codeKey || !stationKey || !timeKey || !userKey || !textKey) {
    return <p>🚫 Colonnes nécessaires non trouvées.</p>;
  }

  const filtered = data.filter(
    row => (row[codeKey] || "").trim() === errorCode
  );

  if (filtered.length === 0) {
    return <p>⚠️ Aucune donnée trouvée pour le code : {errorCode}</p>;
  }

  return (
    <div>
      <h2>🔍 Détails pour l'erreur : <span style={{ color: "red" }}>{errorCode}</span></h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Station</th>
            <th>Temps (min)</th>
            <th>Technicien</th>
            <th>Texte d'erreur</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, index) => (
            <tr key={index}>
              <td>{row[stationKey]}</td>
              <td>{row[timeKey]}</td>
              <td>{row[userKey]}</td>
              <td>{row[textKey]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DetailPannePage;
