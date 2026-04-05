import React from "react";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );
  return (
    <>
      <div className="dark:bg-gray-900 dark:text-white min-h-screen transition-colors">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          ></Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
