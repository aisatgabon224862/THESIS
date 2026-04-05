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

const INCIDENTS_STATS = [
  { label: "Total Incidents", value: 124, change: "+12%" },
  { label: "Confiscated Items", value: 45, change: "+5%" },
  { label: "Avg Response Time", value: "2m 15s", change: "-30s" },
  { label: "Resolved Cases", value: "98%", change: "+2%" },
];

const WEEKLY_INCIDENTS = [
  { day: "Mon", incidents: 3 },
  { day: "Tue", incidents: 7 },
  { day: "Wed", incidents: 4 },
  { day: "Thu", incidents: 10 },
  { day: "Fri", incidents: 5 },
];

const CONTRABAND = [
  { name: "Phones", value: 45 },
  { name: "Vapes", value: 30 },
  { name: "Knives", value: 5 },
  { name: "Other", value: 20 },
];

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981"];

export default function SecurityLog() {
  const [system, setSystem] = useState("checking...");
  useEffect(() => {
    const test = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/students/view");
        const data = await res.json();
        console.log(data);
        setSystem("Online");
      } catch (error) {
        console.log(error);
        setSystem("Offline");
      }
    };

    test();
  }, []);
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Metal Detection Log
          </h1>
          <p className="text-slate-500 mt-1">
            Real-time monitoring of security checkpoints
          </p>
        </div>
        <div className="flex gap-3">
          <span
            className={`px-3 py-1 bg-green-100 rounded-full font-medium ${system === "Online" ? " text-green-700 " : "text-red-700"}`}
          >
            {`System ${system}`}
          </span>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {INCIDENTS_STATS.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {stat.value}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {stat.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* Weekly Incidents */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Incidents Overview
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEKLY_INCIDENTS} barSize={32}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b" }}
              />
              <Tooltip cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="incidents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contraband Types */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Contraband Types
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CONTRABAND}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {CONTRABAND.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Recent Detections Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900">
            Recent Detections
          </h3>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full pl-3 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Item Detected</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                {
                  student: "Michael Chen",
                  item: "Screw Driver",
                  location: "Entrance",
                  time: "08:15 AM",
                  date: "Oct 24, 2026",
                  status: "Review",
                },
                {
                  student: "Sarah Johnson",
                  item: "Pocket Knife",
                  location: "Exit",
                  time: "10:30 AM",
                  date: "Oct 24, 2026",
                  status: "Confiscated",
                },
                {
                  student: "David Smith",
                  item: "Smart Watch",
                  location: "Entrance",
                  time: "02:15 PM",
                  date: "Oct 23, 2026",
                  status: "Resolved",
                },
              ].map((log, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {log.student}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{log.item}</td>
                  <td className="px-6 py-4 text-slate-600">{log.location}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono">{`${log.time} • ${log.date}`}</td>
                  <td className={`px-6 py-4`}>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === "Review"
                          ? "bg-yellow-100 text-yellow-700"
                          : log.status === "Confiscated"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
