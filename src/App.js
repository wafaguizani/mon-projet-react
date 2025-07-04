import React, { useState } from "react";
import * as XLSX from "xlsx";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TimePage from "./pages/TimePage";
import TypePage from "./pages/TypePage";
import PannePage from "./pages/PannePage";
import DetailPannePage from "./pages/DetailPannePage";
import DetailPanneTechnicien from "./pages/DetailPanneTechnicien";
import DetailTypePage from "./pages/DetailTypePage";
import "./App.css";

function App() {
  const [excelData, setExcelData] = useState(null);
  const [fileDates, setFileDates] = useState({ from: null, to: null });

  // Fonction pour convertir "JJ/MM/AAAA" → objet Date
  const parseCustomDate = (str) => {
    const [day, month, year] = str.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Lire toutes les lignes comme tableau brut
      const rows = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
      });

      // 🗓️ Extraire les dates depuis les lignes du haut
      const fromDateRow = rows.find(row => row[0] === "#Date from");
      const toDateRow = rows.find(row => row[0] === "#Date to");

      const fromDate = fromDateRow ? fromDateRow[1] : null;
      const toDate = toDateRow ? toDateRow[1] : null;

      setFileDates({
        from: parseCustomDate(fromDate),
        to: parseCustomDate(toDate),
      });

      // 🔍 Trouver la ligne contenant les en-têtes utiles
      const headerIndex = rows.findIndex(row =>
        row.includes("#RU_USER_ID") && row.includes("#RU_USER_MIN")
      );

      if (headerIndex === -1) {
        console.error("❌ En-tête non trouvé !");
        return;
      }

      const headers = rows[headerIndex];
      const dataRows = rows.slice(headerIndex + 1);

      const jsonData = dataRows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });

      console.log("✅ Données converties :", jsonData);
      setExcelData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Router>
      <div className="container">
        <h1>DRÄXLMAIER Report Viewer</h1>

        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

        {/* 🗓️ Affichage des dates du rapport */}
        {fileDates.from && fileDates.to && (
          <p style={{ marginTop: "20px", fontWeight: "bold", color: "#003366" }}>
            📅 Rapport du : {fileDates.from.toLocaleDateString()} au {fileDates.to.toLocaleDateString()}
          </p>
        )}

        {excelData && (
          <div style={{ marginTop: "30px" }}>
            <Link to="/time"><button>Occupation</button></Link>
            <Link to="/type"><button>Types de pannes</button></Link>
            <Link to="/panne"><button>Pannes détaillées</button></Link>
            <Link to="/detail-panne"><button>Détails par erreur</button></Link>
          </div>
        )}

        <Routes>
          <Route path="/time" element={<TimePage data={excelData} />} />
          <Route path="/type" element={<TypePage data={excelData} />} />
          <Route path="/panne" element={<PannePage data={excelData} />} />
          <Route path="/detail-panne/:errorCode" element={<DetailPannePage data={excelData} />} />
          <Route path="/detail-technicien/:name" element={<DetailPanneTechnicien data={excelData} />} />
          <Route path="/details-type/:typeName" element={<DetailTypePage data={excelData} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
