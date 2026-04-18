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
      const res = await fetch("http://localhost:3000/attendance/api/scan", {
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
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">Barcode Scanner</h1>

      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border p-3 w-full text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Scan barcode..."
      />

      {loading && <p className="mt-3 text-blue-500 text-center">Scanning...</p>}

      {result && (
        <div
          className={`mt-4 p-4 rounded-lg text-center ${
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
