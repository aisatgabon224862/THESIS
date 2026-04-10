import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError("Please fill in all fields");
    }

    if (!email.includes("@")) {
      return setError("Enter a valid email");
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/admin/create/authloginuser",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold leading-tight">AISAT SECURITY</h1>
          <p className="mt-4 text-blue-100 ">
            IMPLEMENTING AN AUTOMATED CHECK-IN AND CHECK-OUT SYSTEM USING FACIAL
            RECOGNITION AND ID RECOGNITION AND METAL DETECTION AT AISAT COLLEGE
            DASMARIÑAS
          </p>
        </div>

        <div className="text-sm text-blue-200">
          © 2026 AISAT College Dasmariñas
        </div>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-100">
        <div className="bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-[380px]">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Login to continue to your dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3  rounded-xl border border-gray-300 !bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-16 rounded-xl border border-gray-300 !bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-600"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm bg-red-100 p-2 rounded-lg">
                {error}
              </p>
            )}
            {/* OPTIONS */}
            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" />
                Remember me
              </label>
            </div>
            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold 
              hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
