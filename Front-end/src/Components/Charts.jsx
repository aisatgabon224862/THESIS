import { useState, useEffect, useRef } from "react";
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

const Charts = () => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const attendance = fetch("http://localhost:3000/attendance/api/view")
      .then((res) => res.json)
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (containerRef.current) setMounted(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[300px] h-[400px] md:h-[350px] lg:h-[400px] p-4 bg-white rounded-lg shadow"
    >
      {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            {/* Grid */}
            <CartesianGrid stroke="#f1f5f9" vertical={false} />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />

            {/* Y Axis */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />

            {/* Legend */}
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: "12px" }}
            />

            {/* Attendance Line */}
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
            />

            {/* Incidents Line */}
            <Line
              type="monotone"
              dataKey="incidents"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Charts;
