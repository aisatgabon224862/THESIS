import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import Detection from "./models/Detection.js";
import { getStudent } from "./studentSession.js";

const port = new SerialPort({
  path: "/dev/ttyUSB0",

  baudRate: 115200,
});

const parser = port.pipe(
  new ReadlineParser({
    delimiter: "\n",
  }),
);

let metalStatus = "CLEAR";

let previousStatus = "CLEAR";

// para hindi paulit-ulit mag-save
let lastDetectionTime = 0;

const detectionDelay = 5000;

parser.on("data", async (data) => {
  const status = data.trim();

  if (status !== "METAL" && status !== "CLEAR") {
    return;
  }

  metalStatus = status;

  console.log("Metal Status:", metalStatus);

  // SAVE ONLY ONCE PAG BAGONG DETECTION

  if (status === "METAL" && previousStatus !== "METAL") {
    const now = Date.now();

    if (now - lastDetectionTime > detectionDelay) {
      try {
        const student = getStudent();

        console.log("METAL CURRENT STUDENT:", student);

        const detection = await Detection.create({
          student: student.student || "Unknown",

          studentID: student.studentID || "",

          item: "Metal Detected",

          location: "Entrance",

          status: "Detected",

          date: new Date().toLocaleDateString(),

          time: new Date().toLocaleTimeString(),
        });

        console.log("Detection saved:", detection.student);

        lastDetectionTime = now;
      } catch (error) {
        console.log("Detection save error:", error.message);
      }
    }
  }

  previousStatus = status;
});

export function getMetalStatus() {
  return metalStatus;
}
