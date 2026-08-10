import React, { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API = "https://thesis-back-end.onrender.com";

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981"];

export default function SecurityLog() {
  const [system, setSystem] = useState("Checking...");

  const [metalStatus, setMetalStatus] = useState("CLEAR");

  const [stats, setStats] = useState({
    totalIncidents: 0,

    confiscatedItems: 0,

    resolvedCases: 0,
  });

  const [weekly, setWeekly] = useState([]);

  const [summary, setSummary] = useState([]);

  const [detections, setDetections] = useState([]);

  const loadData = async () => {
    try {
      // SYSTEM

      await fetch(`${API}/`);

      setSystem("Online");

      // METAL STATUS

      const metal = await fetch(`${API}/api/metal-status`);

      const metalData = await metal.json();

      setMetalStatus(metalData.status);

      // STATS

      const stat = await fetch(`${API}/api/detections/stats`);

      const statData = await stat.json();

      setStats(statData);

      // SUMMARY

      const sum = await fetch(`${API}/api/detections/summary`);

      setSummary(await sum.json());

      // WEEKLY

      const week = await fetch(`${API}/api/detections/weekly`);

      setWeekly(await week.json());

      // LOGS

      const logs = await fetch(`${API}/api/detections`);

      setDetections(await logs.json());
    } catch (error) {
      console.log(error);

      setSystem("Offline");
    }
  };

  useEffect(() => {
    loadData();

    const timer = setInterval(loadData, 3000);

    return () => clearInterval(timer);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(
        `${API}/api/detections/${id}/status`,

        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        },
      );

      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Metal Detection Log</h1>

          <p className="text-slate-500">Real-time security monitoring</p>
        </div>

        <span
          className={`px-4 py-2 rounded-full ${
            system === "Online"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          System {system}
        </span>
      </div>

      {/* METAL STATUS */}

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold text-lg mb-4">Metal Detector Status</h2>

        <div
          className={`p-6 rounded-lg text-center ${
            metalStatus === "METAL"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          <h1 className="text-3xl font-bold">
            {metalStatus === "METAL" ? "🔴 METAL DETECTED" : "🟢 CLEAR"}
          </h1>
        </div>
      </div>

      {/* CARDS */}

      <div className="grid md:grid-cols-4 gap-4">
        <Card title="Total Detection" value={stats.totalIncidents} />

        <Card title="Confiscated Items" value={stats.confiscatedItems} />

        <Card title="Resolved Cases" value={stats.resolvedCases || 0} />

        <Card title="Status" value={metalStatus} />
      </div>

      {/* BAR CHART */}

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold mb-4">Weekly Incidents</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="incidents" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE CHART */}

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold mb-4">Detection Summary</h2>

        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={summary}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {summary.map((item, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6">
          <h2 className="font-bold text-lg">Recent Detections</h2>
        </div>

        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Student</th>

              <th>Item</th>

              <th>Location</th>

              <th>Time</th>

              <th>Status</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {detections.map((log, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">{log.student}</td>

                <td>{log.item}</td>

                <td>{log.location}</td>

                <td>{log.time}</td>

                <td>
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    {log.status}
                  </span>
                </td>

                <td className="space-x-2">
                  <button
                    onClick={() => updateStatus(log._id, "Confiscated")}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Confiscate
                  </button>

                  <button
                    onClick={() => updateStatus(log._id, "Resolved")}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Resolve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-slate-500">{title}</p>

      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}
