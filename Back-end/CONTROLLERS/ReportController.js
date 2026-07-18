import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import Detection from "../models/Detection.js";
import Student from "../SCHEMA/StudentSchema.js";

// PDF REPORT

export const generateSecurityPDF = async (req, res) => {
  try {
    const detections = await Detection.find().sort({
      createdAt: -1,
    });

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=security-report.pdf",
    );

    doc.pipe(res);

    doc.fontSize(20).text("Security Detection Report", {
      align: "center",
    });

    doc.moveDown();

    detections.forEach((d) => {
      doc.fontSize(12).text(
        `Student: ${d.student}
Item: ${d.item}
Status: ${d.status}
Date: ${d.date}
Time: ${d.time}

`,
      );
    });

    doc.end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// EXCEL REPORT

export const generateSecurityExcel = async (req, res) => {
  try {
    const data = await Detection.find();

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Security Log");

    sheet.columns = [
      {
        header: "Student",
        key: "student",
      },

      {
        header: "Item",
        key: "item",
      },

      {
        header: "Status",
        key: "status",
      },

      {
        header: "Date",
        key: "date",
      },

      {
        header: "Time",
        key: "time",
      },
    ];

    data.forEach((d) => {
      sheet.addRow({
        student: d.student,

        item: d.item,

        status: d.status,

        date: d.date,

        time: d.time,
      });
    });

    res.setHeader(
      "Content-Type",

      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",

      "attachment; filename=security-report.xlsx",
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
