import React, { useState } from "react";
import * as XLSX from "xlsx";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TimePage from "./pages/TimePage";
import TypePage from "./pages/TypePage";
import PannePage from "./pages/PannePage";
import DetailPannePage from "./pages/DetailPannePage";
import DetailPanneTechnicien from "./pages/DetailPanneTechnicien";
import "./App.css";

function App() {
  const [excelData, setExcelData] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Lire toutes les lignes sous forme de tableau brut
      const rows = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
      });

      // Trouver la ligne contenant les colonnes utiles (ex : ligne avec "#RU_USER_ID")
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

      console.log("✅ Données converties manuellement :", jsonData);
      setExcelData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Router>
      <div className="container">
        <h1>DRÄXLMAIER Report Viewer</h1>

        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

        {excelData && (
          <div style={{ marginTop: "30px" }}>
            <Link to="/time"><button>Page Time</button></Link>
            <Link to="/type"><button>Page Type</button></Link>
            <Link to="/panne"><button>Page Panne</button></Link>
            <Link to="/detail-panne"><button>Détails de Panne</button></Link>
          </div>
        )}

        <Routes>
          <Route path="/time" element={<TimePage data={excelData} />} />
          <Route path="/type" element={<TypePage data={excelData} />} />
          <Route path="/panne" element={<PannePage data={excelData} />} />
          <Route path="/detail-panne/:errorCode" element={<DetailPannePage data={excelData} />} />
          <Route path="/detail-technicien/:name" element={<DetailPanneTechnicien data={excelData} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
