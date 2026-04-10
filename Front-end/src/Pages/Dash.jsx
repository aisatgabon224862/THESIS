import React, { useEffect, useState, useMemo } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [time, setTime] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [system, setSystem] = useState("checking...");
  const [filter, setFilter] = useState("week");
  const [loading, setLoading] = useState(true);

  //  CLOCK
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  //  FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [studentsRes, attendanceRes] = await Promise.all([
          fetch("http://localhost:3000/api/students/view"),
          fetch("http://localhost:3000/attendance/api/view"),
        ]);

        if (!studentsRes.ok || !attendanceRes.ok)
          throw new Error("Fetch failed");

        const studentsData = await studentsRes.json();
        const attendanceData = await attendanceRes.json();

        setStudents(studentsData);
        setAttendance(attendanceData);
        setSystem("Healthy");
      } catch (err) {
        console.error(err);
        setSystem("Offline");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //  HELPERS
  const normalizeDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getStatus = (status) => status?.toLowerCase().trim();

  //  WEEKLY
  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = days.map((d) => ({ name: d, attendance: 0, incidents: 0 }));

    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    attendance.forEach((a) => {
      const d = normalizeDate(a.date);
      if (!d) return;

      if (d >= start && d <= end) {
        const index = d.getDay();
        const status = getStatus(a.Status);

        if (status === "present") data[index].attendance++;
        if (status === "absent") data[index].incidents++;
      }
    });

    return data;
  }, [attendance]);

  //  MONTHLY
  const monthlyData = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();

    const data = Array.from({ length: daysInMonth }, (_, i) => ({
      name: `Day ${i + 1}`,
      attendance: 0,
      incidents: 0,
    }));

    attendance.forEach((a) => {
      const d = normalizeDate(a.date);
      if (!d) return;

      if (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      ) {
        const index = d.getDate() - 1;
        const status = getStatus(a.Status);

        if (status === "present") data[index].attendance++;
        if (status === "absent") data[index].incidents++;
      }
    });

    return data;
  }, [attendance]);

  const chartData = filter === "month" ? monthlyData : weeklyData;

  //  TODAY
  const today = normalizeDate(new Date());

  const todayRecords = attendance.filter((a) => {
    const d = normalizeDate(a.date);
    return d && d.getTime() === today.getTime();
  });

  const presentToday = todayRecords.filter(
    (a) => getStatus(a.Status) === "present",
  ).length;

  const attendanceRate =
    students.length === 0
      ? 0
      : ((presentToday / students.length) * 100).toFixed(1);

  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            {loading ? (
              <Skeleton width={250} height={30} />
            ) : (
              <h1 className="text-3xl font-bold text-gray-800">
                School Overview
              </h1>
            )}

            {loading ? (
              <Skeleton width={300} />
            ) : (
              <p className="text-gray-500 mt-1">
                Welcome back, Admin. Here's what's happening today.
              </p>
            )}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow flex flex-col items-end">
            {loading ? (
              <Skeleton width={120} />
            ) : (
              <p className="font-semibold text-gray-700">
                {time.toLocaleDateString("en-US", { weekday: "long" })}
              </p>
            )}

            <p className="text-gray-400 text-sm">{time.toLocaleDateString()}</p>

            <p className="text-2xl font-bold text-gray-800">
              {time.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <ModernCard
            title="Total Students"
            value={students.length}
            loading={loading}
          />
          <ModernCard
            title="Present Today"
            value={presentToday}
            loading={loading}
          />
          <ModernCard
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            loading={loading}
          />
          <ModernCard
            title="System Status"
            value={system}
            statusColor={system === "Healthy" ? "green" : "red"}
            loading={loading}
          />
        </div>

        {/* CHART */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800 text-lg">
              Attendance Trends
            </h2>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-100 px-3 py-2 rounded-lg border border-gray-300"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="w-full h-72">
            {loading ? (
              <Skeleton height="100%" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="5 5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="attendance" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="incidents" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

//  CARD
const ModernCard = ({ title, value, statusColor, loading }) => {
  const textColor =
    statusColor === "green"
      ? "text-green-500"
      : statusColor === "red"
        ? "text-red-500"
        : "text-gray-700";

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition">
      <h3 className="text-sm text-gray-400">
        {loading ? <Skeleton width={100} /> : title}
      </h3>

      <p className={`text-2xl font-bold mt-2 ${textColor}`}>
        {loading ? <Skeleton width={60} /> : value}
      </p>
    </div>
  );
};

export default Dashboard;
