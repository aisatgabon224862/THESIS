import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dash from "../Pages/Dash";
import AttendanceDashboard from "../Pages/AttendanceDashboard";
import StudentDirectory from "../Pages/Students";
import SecurityLog from "../Pages/SecurityLogs";
import Report from "../Pages/Reports";
import Settings from "../Pages/Settings";
import AttendanceTracker from "../Components/AttendanceTracker";
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
  const [notifation, setNotification] = useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const addNotification = (name) => {
    setNotification((prev) => [
      {
        id: Date.now(),
        message: `${name} marked present`,
      },
      ...prev,
    ]);
  };
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
        return <AttendanceDashboard />;
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
          Logout
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
            <div className="relative">
              <button onClick={() => setShow(!show)} className="relative">
                🔔
                {notifation.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                    {notifation.length}
                  </span>
                )}
              </button>

              {show && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-3 z-50">
                  {notifation.length === 0 ? (
                    <p className="text-sm text-gray-500">No notifications</p>
                  ) : (
                    notifation.map((notif) => (
                      <div
                        key={notif.id}
                        className="text-sm border-b py-1 text-black"
                      >
                        {notif.message}
                      </div>
                    ))
                  )}
                  <button
                    className="text-white border rounded-full px-2 py-1 bg-black mt-2"
                    onClick={() => setShow(false)}
                  >
                    close
                  </button>
                </div>
              )}
            </div>
            {/* PROFILE */}
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* hidden but running */}
          <div className="hidden">
            <AttendanceTracker onPresent={addNotification} />
          </div>

          {/* visible content */}
          <div className="text-gray-600">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
