import { useState } from "react";

function SettingsPage() {
  const [settings, setSettings] = useState({
    schoolName: "",
    academicYear: "",
    timezone: "",
    maintenanceMode: false,
    autoLogout: false,
    // placeholders for other sections
    profileName: "",
    profileEmail: "",
    notificationsEmail: false,
    notificationsSMS: false,
    securityPassword: "",
    security2FA: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    alert("Settings saved (placeholder)!");
    console.log(settings);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* School Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <h2 className="text-lg font-bold">School Info</h2>
        <input
          name="schoolName"
          value={settings.schoolName}
          onChange={handleChange}
          placeholder="School Name"
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          name="academicYear"
          value={settings.academicYear}
          onChange={handleChange}
          placeholder="Academic Year"
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          name="timezone"
          value={settings.timezone}
          onChange={handleChange}
          placeholder="Timezone"
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* Profile */}
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Profile</h2>
        <input
          name="profileName"
          value={settings.profileName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          name="profileEmail"
          value={settings.profileEmail}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Notifications</h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="notificationsEmail"
            checked={settings.notificationsEmail}
            onChange={handleChange}
          />
          <label>Email Notifications</label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="notificationsSMS"
            checked={settings.notificationsSMS}
            onChange={handleChange}
          />
          <label>SMS Notifications</label>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Security</h2>
        <input
          type="password"
          name="securityPassword"
          value={settings.securityPassword}
          onChange={handleChange}
          placeholder="Change Password"
          className="w-full border rounded-lg px-3 py-2"
        />
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="security2FA"
            checked={settings.security2FA}
            onChange={handleChange}
          />
          <label>Enable 2FA</label>
        </div>
      </div>

      {/* System Preferences */}
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <h2 className="text-lg font-bold">System Preferences</h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleChange}
          />
          <label>Maintenance Mode</label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="autoLogout"
            checked={settings.autoLogout}
            onChange={handleChange}
          />
          <label>Auto-Logout (30 mins inactivity)</label>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
}
export default SettingsPage;
