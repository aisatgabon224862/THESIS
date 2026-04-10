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

export default function AttendanceDashboard({ onPresent }) {
  const [students, setStudents] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState([]);
  const [attendanceAll, setAttendanceAll] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [filter, setFilter] = useState("week");
  const [loading, setLoading] = useState(true);
  const [prevPresent, setPrevpresent] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [s, today, all, w] = await Promise.all([
          fetch("http://localhost:3000/api/students/view"),
          fetch("http://localhost:3000/attendance/api/view"),
          fetch("http://localhost:3000/attendance/api/all"),
          fetch("http://localhost:3000/attendance/api/weekly"),
        ]);

        setStudents(await s.json());
        setAttendanceToday(await today.json());
        setAttendanceAll(await all.json());
        setWeekly(await w.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // every 2 sec

    return () => clearInterval(interval); // cleanup
  }, []);

  useEffect(() => {
    const currentPresent = attendanceToday
      .filter((a) => a.Status === "Present")
      .map((a) => a.name);

    if (isFirstLoad) {
      setPrevpresent(currentPresent);
      setIsFirstLoad(false);
      return;
    }

    const newOnes = currentPresent.filter(
      (name) => !prevPresent.includes(name),
    );

    newOnes.forEach((name) => {
      onPresent?.(name);
    });

    setPrevpresent(currentPresent);
  }, [attendanceToday]);
  // STATS
  const presentToday = attendanceToday.filter(
    (a) => a.Status === "Present",
  ).length;

  const absentToday = attendanceToday.filter(
    (a) => a.Status === "Absent",
  ).length;

  const percent = (val) =>
    students.length === 0 ? 0 : ((val / students.length) * 100).toFixed(1);

  // MONTHLY DATA (FIXED)
  const monthlyData = useMemo(() => {
    const map = {};
    const now = new Date();

    attendanceAll.forEach((a) => {
      if (!a.date) return;

      const d = new Date(a.date);

      if (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      ) {
        const day = d.getDate();

        if (!map[day]) {
          map[day] = {
            name: `Day ${day}`,
            present: 0,
            absent: 0,
          };
        }

        if (a.Status === "Present") map[day].present++;
        else map[day].absent++;
      }
    });

    return Object.values(map).sort(
      (a, b) => parseInt(a.name.split(" ")[1]) - parseInt(b.name.split(" ")[1]),
    );
  }, [attendanceAll]);

  // CHART SWITCH
  const chartData = filter === "week" ? weekly : monthlyData;

  // CLASS BREAKDOWN (TODAY ONLY)
  const CLASS_BREAKDOWN = useMemo(() => {
    const total = {};
    const present = {};

    attendanceToday.forEach((a) => {
      const year = a.yearLevel;
      if (!year) return;

      total[year] = (total[year] || 0) + 1;

      if (a.Status === "Present") {
        present[year] = (present[year] || 0) + 1;
      }
    });

    return Object.keys(total)
      .map((year) => {
        const totalCount = total[year] || 0;
        const presentCount = present[year] || 0;

        if (presentCount === 0) return null;

        return {
          Year: year,
          present: Math.round((presentCount / totalCount) * 100),
        };
      })
      .filter(Boolean);
  }, [attendanceToday]);

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
            <h3 className="font-semibold text-lg">Attendance Trends</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-100 px-3 py-2 rounded-lg"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="h-64">
            {loading ? (
              <Skeleton height="100%" />
            ) : (
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#3b82f6" />
                  <Bar dataKey="absent" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* CLASS BREAKDOWN */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-4">Class Breakdown</h3>

          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} height={20} className="mb-3" />
                ))
            : CLASS_BREAKDOWN.map((cls, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cls.Year}</span>
                    <span>{cls.present}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-blue-500 rounded"
                      style={{ width: `${cls.present}%` }}
                    />
                  </div>
                </div>
              ))}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Today's Attendance</h3>
          </div>

          {loading ? (
            <Skeleton height={200} />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Year</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceToday.map((s) => (
                  <tr key={s._id}>
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

// CARD COMPONENT
const CardModern = ({ label, value, sub, loading }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md">
    <p className="text-gray-400 text-sm mb-1">
      {loading ? <Skeleton width={80} /> : label}
    </p>
    <h2 className="text-3xl font-semibold">
      {loading ? <Skeleton width={60} /> : value}
    </h2>
    {sub && (
      <p className="text-gray-500 text-sm">
        {loading ? <Skeleton width={40} /> : sub}
      </p>
    )}
  </div>
);
