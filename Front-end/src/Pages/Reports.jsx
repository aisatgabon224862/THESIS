import React, { useState } from "react";

const API = "https://thesis-back-end.onrender.com";

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const [downloads, setDownloads] = useState([]);

  const [loading, setLoading] = useState(false);

  const reports = [
    {
      key: "security-pdf",
      title: "Security Incident Report",
      desc: "Metal detection logs, detected items, and security incidents.",
      type: "pdf",
    },

    {
      key: "security-excel",
      title: "Security Audit Excel",
      desc: "Export all security detection records.",
      type: "excel",
    },
  ];

  const generateReport = async (report) => {
    if (!selectedDate) {
      alert("Please select date first");

      return;
    }

    setLoading(true);

    try {
      let url = "";

      let filename = "";

      if (report.type === "pdf") {
        url = `${API}/api/reports/security/pdf?date=${selectedDate}`;

        filename = "security-report.pdf";
      } else {
        url = `${API}/api/reports/security/excel?date=${selectedDate}`;

        filename = "security-report.xlsx";
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed generating report");
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = downloadUrl;

      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      setDownloads((prev) => [
        {
          name: filename,

          date: new Date().toLocaleString(),

          size: "Generated",
        },

        ...prev,
      ]);
    } catch (error) {
      console.log(error);

      alert("Report generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>

      <p className="text-slate-500">
        Generate real system reports from database.
      </p>

      <div className="bg-white p-5 rounded-xl shadow">
        <label className="block text-sm mb-2">Select Report Date</label>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="
border rounded-lg
px-3 py-2
"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div
            key={report.key}
            className="
bg-white
p-6
rounded-xl
shadow
border
"
          >
            <h2 className="font-bold text-lg">{report.title}</h2>

            <p className="text-sm text-slate-500 mt-2">{report.desc}</p>

            <button
              disabled={loading}
              onClick={() => generateReport(report)}
              className="
mt-5
bg-blue-600
text-white
px-4
py-2
rounded-lg
"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold text-lg mb-4">Recent Downloads</h2>

        {downloads.length === 0 ? (
          <p className="text-slate-400">No generated reports yet.</p>
        ) : (
          <ul>
            {downloads.map((file, index) => (
              <li
                key={index}
                className="
flex
justify-between
border-b
py-3
"
              >
                <div>
                  <p className="font-medium">{file.name}</p>

                  <p className="text-xs text-slate-400">
                    {file.size} • {file.date}
                  </p>
                </div>

                <button
                  onClick={() => {
                    window.open(`${API}/api/reports/security/pdf`, "_blank");
                  }}
                  className="
text-blue-600
text-sm
"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold">Scheduled Reports</h2>

        <p className="text-slate-500 mt-2">
          Automatic report generation will be available.
        </p>
      </div>
    </div>
  );
};

export default Reports;
