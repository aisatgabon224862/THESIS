import React, { useEffect, useState, useMemo } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function AttendanceDashboard() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filter, setFilter] = useState("week");
  const [loading, setLoading] = useState(true);
  const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [studentsRes, attendanceRes, weeklyRes] = await Promise.all([
          fetch("http://localhost:3000/api/students/view"),
          fetch("http://localhost:3000/attendance/api/view"),
          fetch("http://localhost:3000/attendance/api/weekly"),
        ]);

        if (!studentsRes.ok || !attendanceRes.ok || !weeklyRes.ok) {
          throw new Error("Failed to fetch");
        }

        const studentsData = await studentsRes.json();
        const attendanceData = await attendanceRes.json();
        const weeklyData = await weeklyRes.json();

        setStudents(studentsData);
        setAttendance(attendanceData);
        setWeekly(weeklyData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const safeDate = (d) => new Date(d);
  const percent = (val) =>
    students.length === 0 ? 0 : ((val / students.length) * 100).toFixed(1);

  const today = new Date();
  const todayRecords = attendance;
  const presentToday = todayRecords.filter(
    (a) => a.Status === "Present",
  ).length;
  const absentToday = todayRecords.filter((a) => a.Status === "Absent").length;

  const monthlyData = useMemo(() => {
    const result = {};
    const now = new Date();
    attendance.forEach((a) => {
      if (!a.date) return;
      const date = safeDate(a.date);
      if (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        const day = date.getDate();
        if (!result[day])
          result[day] = { name: `Day ${day}`, present: 0, absent: 0 };
        if (a.Status === "Present") result[day].present++;
        else if (a.Status === "Absent") result[day].absent++;
      }
    });
    return Object.values(result);
  }, [attendance]);

  const lastMonthData = useMemo(() => {
    const result = {};
    const now = new Date();
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);
    attendance.forEach((a) => {
      if (!a.date) return;
      const date = safeDate(a.date);
      if (
        date.getMonth() === lastMonth.getMonth() &&
        date.getFullYear() === lastMonth.getFullYear()
      ) {
        const day = date.getDate();
        if (!result[day])
          result[day] = { name: `Day ${day}`, present: 0, absent: 0 };
        if (a.Status === "Present") result[day].present++;
        else if (a.Status === "Absent") result[day].absent++;
      }
    });
    return Object.values(result);
  }, [attendance]);

  const chartData =
    filter === "week"
      ? weekly
      : filter === "month"
        ? monthlyData
        : lastMonthData;

  const CLASS_BREAKDOWN = useMemo(() => {
    const total = {};
    const present = {};
    attendance.forEach((a) => {
      const year = a.yearLevel;
      if (!year) return;
      if (!total[year]) total[year] = 0;
      if (!present[year]) present[year] = 0;
      total[year]++;
      if (a.Status === "Present") present[year]++;
    });
    return Object.keys(total).map((year) => ({
      Year: year,
      present: Math.round((present[year] / total[year]) * 100),
    }));
  }, [attendance]);

  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <CardModern
            label="Total Students"
            value={students.length}
            loading={loading}
          />
          <CardModern
            label="Present Today"
            value={presentToday}
            sub={`${percent(presentToday)}%`}
            loading={loading}
          />
          <CardModern
            label="Absent Today"
            value={absentToday}
            sub={`${percent(absentToday)}%`}
            loading={loading}
          />
        </div>

        {/* CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800 text-lg">
              Attendance Trends
            </h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-100 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>

          <div className="h-64">
            {loading ? (
              <Skeleton height="100%" />
            ) : (
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* CLASS BREAKDOWN */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-4">Class Breakdown</h3>
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="mb-4">
                    <Skeleton width="30%" height={20} />
                    <Skeleton height={12} />
                  </div>
                ))
            : CLASS_BREAKDOWN.map((cls, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>{cls.Year}</span>
                    <span>{cls.present}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
                      style={{ width: `${cls.present}%` }}
                    />
                  </div>
                </div>
              ))}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-800">Today's Attendance</h3>
          </div>
          {loading ? (
            <div className="p-4">
              <Skeleton height={20} width={200} className="mb-4" />
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex gap-4 mt-3">
                    <Skeleton width="25%" />
                    <Skeleton width="25%" />
                    <Skeleton width="25%" />
                    <Skeleton width="25%" />
                  </div>
                ))}
            </div>
          ) : (
            <table className="w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-medium text-gray-600">
                    Name
                  </th>
                  <th className="p-3 text-left font-medium text-gray-600">
                    Year
                  </th>
                  <th className="p-3 text-left font-medium text-gray-600">
                    Time
                  </th>
                  <th className="p-3 text-left font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {todayRecords.map((s) => (
                  <tr
                    key={s._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.yearLevel}</td>
                    <td className="p-3">{s.time || "-"}</td>
                    <td
                      className={`p-3 font-medium ${
                        s.Status === "Present"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {s.Status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
}

const CardModern = ({ label, value, sub, loading }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
    <p className="text-gray-400 text-sm mb-1">
      {loading ? <Skeleton width={80} /> : label}
    </p>
    <h2 className="text-3xl font-semibold text-gray-800 mb-1">
      {loading ? <Skeleton width={60} /> : value}
    </h2>
    {sub && (
      <p className="text-gray-500 text-sm">
        {loading ? <Skeleton width={40} /> : sub}
      </p>
    )}
  </div>
);
