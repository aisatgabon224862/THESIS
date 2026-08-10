import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import Detection from "./models/Detection.js";
import { getStudent } from "./studentSession.js";

let metalStatus = "CLEAR";
let previousStatus = "CLEAR";
let lastDetectionTime = 0;

const detectionDelay = 5000;

const enableArduino = process.env.ENABLE_ARDUINO === "true";

if (enableArduino) {
  const port = new SerialPort({
    path: process.env.ARDUINO_PORT || "/dev/ttyUSB0",
    baudRate: 115200,
  });

  const parser = port.pipe(
    new ReadlineParser({
      delimiter: "\n",
    }),
  );

  parser.on("data", async (data) => {
    const status = data.trim();

    if (status !== "METAL" && status !== "CLEAR") {
      return;
    }

    metalStatus = status;

    console.log("Metal Status:", metalStatus);

    if (status === "METAL" && previousStatus !== "METAL") {
      const now = Date.now();

      if (now - lastDetectionTime > detectionDelay) {
        try {
          const student = getStudent();

          console.log("METAL CURRENT STUDENT:", student);

          const detection = await Detection.create({
            student: student?.student || "Unknown",
            studentID: student?.studentID || "",
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

  port.on("open", () => {
    console.log(
      `Arduino connected on ${process.env.ARDUINO_PORT || "/dev/ttyUSB0"}`,
    );
  });

  port.on("error", (error) => {
    console.error("Arduino serial error:", error.message);
  });
} else {
  console.log("Arduino disabled. Running without hardware.");
}

export function getMetalStatus() {
  return metalStatus;
}
