import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dash from "../Pages/Dash";
import Attendance from "../Pages/Attendance";
import StudentDirectory from "../Pages/Students";
import SecurityLog from "../Pages/SecurityLogs";
import Report from "../Pages/Reports";
import Settings from "../Pages/Settings";
const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "attendance", label: "Attendance", icon: "⏰" },
  { id: "students", label: "Students", icon: "👩‍🎓" },
  { id: "security", label: "Security Log", icon: "🛡️" },
  { id: "reports", label: "Reports", icon: "📄" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

function Dashboard({ children }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    navigate("/");
  };
  const getInitials = (email) => {
    if (!email) return "?";

    const namePart = email.split("@")[0]; // before @
    const parts = namePart.split(/[._]/); // split by . or _

    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
  };
  const email = localStorage.getItem("email");
  const initials = getInitials(email);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dash />;
      case "attendance":
        return <Attendance />;
      case "students":
        return <StudentDirectory />;
      case "security":
        return <SecurityLog />;
      case "reports":
        return <Report />;
      case "settings":
        return <Settings />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200 w-64 p-6 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            T
          </div>
          <span className="text-xl font-bold text-blue-600">THESIS</span>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-3">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false); // auto close on mobile
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium"
        >
          🔓 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>

            <h1 className="text-xl font-bold capitalize">{activeTab}</h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* NOTIFICATION */}
            <button className="relative">
              🔔
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                3
              </span>
            </button>

            {/* PROFILE */}
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children || <div className="text-gray-600">{renderContent()}</div>}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
