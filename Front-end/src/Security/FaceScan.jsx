import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function FaceScanner() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  useEffect(() => {
    fetch("http://localhost:3000/api/students/view")
      .then((res) => res.json())
      .then(setStudents);
  }, []);
  //  reference sa video element (camera)
  const videoRef = useRef();

  //  reference sa canvas (pang draw ng box + labels)
  const canvasRef = useRef();

  //  storage ng matcher (face comparison engine)
  const faceMatcherRef = useRef(null);

  //  para hindi paulit-ulit mag attendance
  const markedToday = useRef(new Set());

  //  run once pag load ng component
  useEffect(() => {
    start();
  }, []);

  //  MAIN START FUNCTION

  const start = async () => {
    await loadModels(); // load AI models
    await initMatcher(); // load faces from DB
    startVideo(); // start webcam
  };

  //  LOAD FACE API MODELS

  const loadModels = async () => {
    const MODEL_URL = "/models";

    // face detection (box)
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

    // landmarks (mata, ilong, etc)
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

    // face recognition (comparison)
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  };

  //  START CAMERA

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Camera error:", err));
  };

  //  LOAD STUDENT FACES FROM BACKEND

  const loadLabeledFaces = async () => {
    const res = await fetch("http://localhost:3000/api/students/view");
    const data = await res.json();

    // convert DB data → face-api format
    return data
      .filter((s) => s.faceDescriptor?.length)
      .map((s) => {
        return new faceapi.LabeledFaceDescriptors(s.studentID, [
          new Float32Array(s.faceDescriptor),
        ]);
      });
  };

  //  INITIALIZE FACE MATCHER

  const initMatcher = async () => {
    const labeledFaces = await loadLabeledFaces();

    // 0.6 = threshold (lower = stricter)
    faceMatcherRef.current = new faceapi.FaceMatcher(labeledFaces, 0.6);
  };

  //  REAL-TIME DETECTION + MATCHING

  const handlePlay = () => {
    // create canvas overlay
    const canvas = faceapi.createCanvasFromMedia(videoRef.current);

    canvasRef.current.innerHTML = "";
    canvasRef.current.append(canvas);

    const displaySize = {
      width: videoRef.current.width,
      height: videoRef.current.height,
    };

    faceapi.matchDimensions(canvas, displaySize);

    //  loop every 1 second
    setInterval(async () => {
      // ensure matcher is ready
      if (!faceMatcherRef.current) return;

      // detect faces + landmarks + descriptors
      const video = videoRef.current;

      if (!video || video.readyState < 2) return;

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      // resize for canvas
      const resized = faceapi.resizeResults(detections, displaySize);

      // clear canvas
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // loop each detected face
      resized.forEach(async (detection) => {
        // compare face
        const match = faceMatcherRef.current.findBestMatch(
          detection.descriptor,
        );

        const label = match.toString(); // ex: "12345 (0.45)"

        // draw box + name
        const box = detection.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label });
        drawBox.draw(canvas);

        //  AUTO ATTENDANCE
        if (match.label !== "unknown") {
          await markAttendance(match.label);
        }
      });
    }, 1000);
  };

  //  MARK ATTENDANCE (API CALL)

  const markAttendance = async (studentID) => {
    // prevent duplicate scan
    if (markedToday.current.has(studentID)) return;

    try {
      const res = await fetch("http://localhost:3000/attendance/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentID }),
      });

      const data = await res.json();

      console.log("Attendance:", data.message);

      // mark as scanned
      markedToday.current.add(studentID);
    } catch (err) {
      console.error("Attendance error:", err);
    }
  };

  //  ENROLL FACE (SAVE TO DB)

  const enrollFace = async () => {
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No face detected");
      return;
    }

    // convert Float32Array → normal array (for DB)
    const descriptor = Array.from(detection.descriptor);

    await fetch("http://localhost:3000/api/students/enroll-face", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentID: selectedStudent, //  palitan later dynamic
        descriptor,
      }),
    });

    alert("Face enrolled!");
  };

  //  UI

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-xl font-bold mb-4">Attendance Face Scanner</h1>

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          width="600"
          height="450"
          onPlay={handlePlay}
          className="rounded-lg"
        />

        {/* canvas overlay */}
        <div ref={canvasRef} className="absolute top-0 left-0" />
      </div>
      <select
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
      >
        <option value="">Select Student</option>
        {students.map((s) => (
          <option key={s.studentID} value={s.studentID}>
            {s.name} ({s.studentID})
          </option>
        ))}
      </select>

      <button
        onClick={enrollFace}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Enroll Face
      </button>
    </div>
  );
}
