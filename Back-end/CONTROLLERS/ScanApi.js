import attendance from "../SCHEMA/AttendanceSchema.js";
import Student from "../SCHEMA/StudentSchema.js";
import { setStudent } from "../studentSession.js";

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

    const students = await Student.find({
      Status: "Active",
    });

    const existingRecords = await attendance.find({
      date: {
        $gte: start,
        $lte: end,
      },
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

    res.json({
      message: "Attendance initialized for today",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// SCANNER

const barcodeScanner = async (req, res) => {
  try {
    const { studentID } = req.body;

    if (!studentID) {
      return res.status(400).json({
        message: "Student ID required",
      });
    }

    const student = await Student.findOne({
      studentID,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // ================================
    // SAVE ACTIVE STUDENT
    // PARA SA METAL DETECTOR
    // ================================

    setStudent(student.name, student.studentID);

    console.log("Active Student:", student.name);

    // ATTENDANCE

    const start = getStartOfToday();

    const end = getEndOfToday();

    let record = await attendance.findOne({
      student: student._id,

      date: {
        $gte: start,
        $lte: end,
      },
    });

    if (record) {
      if (record.Status !== "Present") {
        record.Status = "Present";

        record.time = new Date();

        await record.save();

        return res.json({
          message: "Attendance updated to Present",

          student: student.name,
        });
      }

      return res.json({
        message: "Already scanned today",

        student: student.name,
      });
    }

    record = await attendance.create({
      student: student._id,

      date: new Date(),

      Status: "Present",

      time: new Date(),
    });

    res.status(201).json({
      message: "Attendance recorded",

      student: student.name,

      studentID: student.studentID,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
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

    const activeStudents = await Student.countDocuments({
      Status: "Active",
    });

    const records = await attendance.find({
      date: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
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

      if (r.Status === "Present") {
        grouped[day].present++;
      }
    });

    const chartData = Object.keys(grouped).map((day) => ({
      name: day,

      present: grouped[day].present,

      absent: activeStudents - grouped[day].present,
    }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET TODAY ATTENDANCE

const getAttendance = async (req, res) => {
  try {
    const start = getStartOfToday();

    const end = getEndOfToday();

    const students = await Student.find({
      Status: "Active",
    });

    const records = await attendance.find({
      date: {
        $gte: start,
        $lte: end,
      },
    });

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
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL

const getAllAttendance = async (req, res) => {
  try {
    const records = await attendance.find().populate("student");

    const result = records.map((r) => ({
      _id: r._id,

      name: r.student?.name,

      studentID: r.student?.studentID,

      yearLevel: r.student?.yearLevel,

      Status: r.Status,

      time: r.time,

      date: r.date,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getAttendanceReport = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({
      Status: "Active",
    });

    const present = await attendance.countDocuments({
      Status: "Present",
    });

    const absent = await attendance.countDocuments({
      Status: "Absent",
    });

    res.json({
      totalStudents,

      present,

      absent,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  initializeStudents,
  barcodeScanner,
  getAttendance,
  getWeeklyAttendance,
  getAllAttendance,
  getAttendanceReport,
};
