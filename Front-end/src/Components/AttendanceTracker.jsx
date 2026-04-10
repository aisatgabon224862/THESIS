// AttendanceTracker.js
import { useEffect, useState } from "react";

export default function AttendanceTracker({ onPresent }) {
  const [attendanceToday, setAttendanceToday] = useState([]);
  const [prevPresent, setPrevPresent] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3000/attendance/api/view");
      const data = await res.json();
      setAttendanceToday(data);
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentPresent = attendanceToday
      .filter((a) => a.Status === "Present")
      .map((a) => a.name);

    if (isFirstLoad) {
      setPrevPresent(currentPresent);
      setIsFirstLoad(false);
      return;
    }

    const newOnes = currentPresent.filter(
      (name) => !prevPresent.includes(name),
    );

    newOnes.forEach((name) => {
      onPresent && onPresent(name);
    });

    setPrevPresent(currentPresent);
  }, [attendanceToday]);

  return null;
}
