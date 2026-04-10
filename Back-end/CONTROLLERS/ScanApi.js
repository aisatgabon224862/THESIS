import attendance from "../SCHEMA/AttendanceSchema.js";
import Student from "../SCHEMA/StudentSchema.js";

// HELPERS
const getStartOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const getEndOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

// INITIALIZE
const initializeStudents = async (req, res) => {
  try {
    const start = getStartOfToday();
    const end = getEndOfToday();

    const students = await Student.find({ Status: "Active" });

    const existingRecords = await attendance.find({
      date: { $gte: start, $lte: end },
    });

    const existingStudentIds = new Set(
      existingRecords.map((r) => r.student.toString()),
    );

    const toInsert = students
      .filter((s) => !existingStudentIds.has(s._id.toString()))
      .map((s) => ({
        student: s._id,
        date: new Date(),
        Status: "Absent",
      }));

    if (toInsert.length > 0) {
      await attendance.insertMany(toInsert);
    }

    res.status(200).json({ message: "Attendance initialized for today" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// SCANNER
const barcodeScanner = async (req, res) => {
  try {
    const { studentID } = req.body;

    if (!studentID) {
      return res.status(400).json({ message: "Student ID required" });
    }

    const student = await Student.findOne({ studentID });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const start = getStartOfToday();
    const end = getEndOfToday();

    let record = await attendance.findOne({
      student: student._id,
      date: { $gte: start, $lte: end },
    });

    if (record) {
      if (record.Status !== "Present") {
        record.Status = "Present";
        record.time = new Date(); // store actual Date object
        await record.save();

        return res.json({
          message: "Attendance updated to Present",
          student: student.name,
        });
      }

      return res.json({ message: "Already scanned today" });
    }

    // create new record
    record = await attendance.create({
      student: student._id,
      date: new Date(),
      Status: "Present",
      time: new Date(),
    });

    res.status(201).json({
      message: "Attendance recorded",
      student: student.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET WEEKLY ATTENDANCE
const getWeeklyAttendance = async (req, res) => {
  try {
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const activeStudents = await Student.countDocuments({ Status: "Active" });

    const records = await attendance.find({
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const grouped = {
      Sun: { present: 0 },
      Mon: { present: 0 },
      Tue: { present: 0 },
      Wed: { present: 0 },
      Thu: { present: 0 },
      Fri: { present: 0 },
      Sat: { present: 0 },
    };

    records.forEach((r) => {
      const day = new Date(r.date).toLocaleString("en-US", {
        weekday: "short",
      });
      if (r.Status === "Present") grouped[day].present++;
    });

    const chartData = Object.keys(grouped).map((day) => ({
      name: day,
      present: grouped[day].present,
      absent: activeStudents - grouped[day].present,
    }));

    res.json(chartData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// GET ATTENDANCE
const getAttendance = async (req, res) => {
  try {
    const start = getStartOfToday();
    const end = getEndOfToday();

    const students = await Student.find({ Status: "Active" });
    const records = await attendance.find({ date: { $gte: start, $lte: end } });

    const map = {};
    records.forEach((r) => {
      map[r.student.toString()] = r;
    });

    const result = students.map((s) => {
      const record = map[s._id.toString()];

      return {
        _id: record?._id || s._id,
        name: s.name,
        yearLevel: s.yearLevel,
        studentID: s.studentID,
        Status: record?.Status || "Absent",
        time: record?.time ? new Date(record.time).toLocaleTimeString() : "-",
        date: record?.date || new Date(),
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllAttendance = async (req, res) => {
  try {
    const records = await attendance.find().populate("student");

    const result = records.map((r) => ({
      _id: r._id,
      name: r.student?.name,
      yearLevel: r.student?.yearLevel,
      Status: r.Status,
      time: r.time,
      date: r.date,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  initializeStudents,
  barcodeScanner,
  getAttendance,
  getWeeklyAttendance,
  getAllAttendance,
};
