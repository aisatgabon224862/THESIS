import React, { useState } from "react";
import ScannerTest from "./Scanner";

const Reports = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [downloads, setDownloads] = useState([
    {
      name: "Weekly Attendance - Grade 10.pdf",
      size: "2.4 MB",
      date: "Oct 24, 2023",
    },
    {
      name: "Monthly Security Audit.xlsx",
      size: "1.8 MB",
      date: "Oct 23, 2023",
    },
    {
      name: "Incident #4291 Details.pdf",
      size: "0.5 MB",
      date: "Oct 23, 2023",
    },
    {
      name: "Q3 Student Performance.pdf",
      size: "5.2 MB",
      date: "Oct 20, 2023",
    },
  ]);

  const reports = [
    {
      key: "attendance",
      title: "Attendance Summary",
      desc: "Daily, weekly, and monthly attendance records grouped by grade.",
      last: "2 hours ago",
    },
    {
      key: "security",
      title: "Security Incident Log",
      desc: "Detailed report of all security breaches, confiscated items, and resolutions.",
      last: "Yesterday",
    },
    {
      key: "behavior",
      title: "Student Behavior Report",
      desc: "Aggregation of disciplinary actions and commendations per student.",
      last: "3 days ago",
    },
    {
      key: "facility",
      title: "Facility Usage Report",
      desc: "Logs of facility access times and high-traffic areas.",
      last: "1 week ago",
    },
  ];

  // Handle date selection
  const handleDateChange = (key, value) => {
    setSelectedDates({ ...selectedDates, [key]: value });
  };

  // Mock generate function
  const handleGenerate = (report) => {
    const date = selectedDates[report.key];
    if (!date) {
      alert(`Please select a date for ${report.title}`);
      return;
    }

    // Replace with actual API call
    alert(`Generating ${report.title} for ${date}...`);

    // Add to downloads as mock
    setDownloads([
      { name: `${report.title} - ${date}.pdf`, size: "1.2 MB", date },
      ...downloads,
    ]);
  };

  return (
    <div className="p-6 space-y-6 font-sans bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
      <p className="text-slate-500">
        Generate detailed insights and export data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {reports.map((report) => (
          <div
            key={report.key}
            className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between border border-slate-100"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {report.title}
              </h3>
              <p className="text-slate-500 text-sm mt-2">{report.desc}</p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-xs text-slate-400">
                Last generated: {report.last}
              </p>
              <input
                type="date"
                className="border border-slate-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDates[report.key] || ""}
                onChange={(e) => handleDateChange(report.key, e.target.value)}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                onClick={() => handleGenerate(report)}
              >
                Generate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Downloads */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Recent Downloads
        </h3>
        <ul className="divide-y divide-slate-100">
          {downloads.map((file, i) => (
            <li key={i} className="flex justify-between py-3 items-center">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">
                  {file.size} • {file.date}
                </p>
              </div>
              <button className="px-3 py-1 text-xs bg-slate-100 rounded-lg hover:bg-slate-200">
                View
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Barcode Scanner */}
      <div>
        <ScannerTest />
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Scheduled Reports
        </h3>
        <p className="text-slate-500">
          You have 2 reports scheduled for automatic generation.
        </p>
      </div>
    </div>
  );
};

export default Reports;
