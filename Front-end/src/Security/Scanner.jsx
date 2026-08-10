import { useState, useRef, useEffect } from "react";
import joel from "../assets/malupiton-aray-ko.mp3";
import bossing from "../assets/bossing.mp3";
export default function Scanner() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    focusInput();
  }, []);

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const playSound = (type) => {
    const audio = new Audio(type === "success" ? bossing : joel);
    audio.play();
  };

  const handleScan = async (value) => {
    if (!value.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("https://thesis-back-end.onrender.com/attendance/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentID: value }),
      });

      const data = await res.json();
      setResult(data);

      if (res.ok) {
        playSound("success");
      } else {
        playSound("error");
      }
    } catch (error) {
      console.log(error);
      playSound("error");
    } finally {
      setLoading(false);
      setInput("");
      focusInput(); // auto focus ulit after scan
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("input", input);
      handleScan(input);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-lg font-semibold text-gray-700">Barcode Scanner</h2>

      <input
        ref={inputRef}
        value={input}
        onFocus={() => console.log("INPUT FOCUSED")}
        onBlur={() => console.log("INPUT LOST FOCUS")}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />

      {loading && <p className="text-blue-500">Scanning...</p>}

      {result && (
        <div
          className={`w-full max-w-md p-3 rounded text-center ${
            result.message.includes("recorded")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <p className="font-semibold">{result.message}</p>
          {result.student && <p>{result.student}</p>}
        </div>
      )}
    </div>
  );
}
