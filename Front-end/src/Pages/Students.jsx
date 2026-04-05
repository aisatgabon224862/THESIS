import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";

export default function StudentDirectory() {
  const [students, setStudents] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [search, setSearch] = useState("");

  const [updated, setUpdated] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [addNew, setAddNew] = useState(false);

  const [name, setName] = useState("");
  const [yearLevel, setYear] = useState("1st Year");
  const [studentID, setStudentID] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState("Active");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await fetch("http://localhost:3000/api/students/view");
        const res = await data.json();
        setStudents(res);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      (s.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (s.studentID?.toLowerCase() || "").includes(search.toLowerCase());
    const matchYear = selectedYear === "All" || s.yearLevel === selectedYear;
    return matchSearch && matchYear;
  });

  const handleUpdate = (student) => {
    setUpdated(student._id);
    setName(student.name);
    setEmail(student.email);
    setAddress(student.address);
    setContact(student.contact);
    setStatus(student.Status);
    setYear(student.yearLevel);
    setStudentID(student.studentID);
  };

  const handleSubmitUpdate = async (id) => {
    const updatedStudent = {
      name,
      email,
      address,
      contact,
      yearLevel,
      studentID,
      Status: status,
    };
    try {
      const res = await fetch(
        `http://localhost:3000/api/students/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedStudent),
        },
      );
      const data = await res.json();
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? { ...s, ...data } : s)),
      );
    } catch (error) {
      console.error("Error updating student:", error);
    } finally {
      setUpdated(null);
    }
  };

  const handleAddStudent = async () => {
    const newStudent = {
      name,
      email,
      address,
      contact,
      yearLevel,
      studentID,
      Status: status,
    };
    try {
      const res = await fetch("http://localhost:3000/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      const data = await res.json();

      // Ensure a unique _id exists
      const studentWithId = { ...data, _id: data._id || crypto.randomUUID() };

      setStudents((prev) => [...prev, newStudent]);
      const exist = students.some((s) => s.studentID === newStudent.studentID);

      if (exist) {
        alert("student id already exist ");
        return;
      }
    } catch (error) {
      console.error("Error adding student:", error);
    } finally {
      setAddNew(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setAddress("");
    setContact("");
    setStatus("Active");
    setYear("1st Year");
    setStudentID("");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Student Directory
          </h1>
          <p className="text-slate-500 mt-1">
            Manage student records and information
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => {
            setAddNew(true);
            resetForm();
          }}
        >
          Add New Student
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search by name or ID..."
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/4"
        >
          <option value="All">All Grades</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-100 relative">
        {/* Desktop Table */}
        <table className="min-w-full divide-y divide-gray-200 hidden md:table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Year Level</th>
              <th className="px-4 py-3 font-medium">ID Number</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((s) => (
              <tr
                key={s.studentID}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">{s.yearLevel}</td>
                <td className="px-4 py-3">{s.studentID}</td>
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleUpdate(s)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setViewStudent(s)}
                    className="text-gray-700 hover:underline text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {filteredStudents.map((s) => (
            <div
              key={s._id || s.studentID}
              className="border p-4 rounded-lg shadow-sm space-y-2"
            >
              <p>
                <span className="font-semibold">Name:</span> {s.name}
              </p>
              <p>
                <span className="font-semibold">Year Level:</span> {s.yearLevel}
              </p>
              <p>
                <span className="font-semibold">ID:</span> {s.studentID}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {s.email}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(s)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setViewStudent(s)}
                  className="text-gray-700 hover:underline text-sm"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {/* Update Modal */}
      {updated && (
        <StudentForm
          title="Update Student"
          submitAction={() => handleSubmitUpdate(updated)}
          closeAction={() => setUpdated(null)}
          formData={{
            name,
            email,
            address,
            contact,
            studentID,
            status,
            yearLevel,
          }}
          setFormData={{
            setName,
            setEmail,
            setAddress,
            setContact,
            setStudentID,
            setStatus,
            setYear,
          }}
        />
      )}

      {/* Add New Student Modal */}
      {addNew && (
        <StudentForm
          title="Add New Student"
          submitAction={handleAddStudent}
          closeAction={() => setAddNew(false)}
          formData={{
            name,
            email,
            address,
            contact,
            studentID,
            status,
            yearLevel,
          }}
          setFormData={{
            setName,
            setEmail,
            setAddress,
            setContact,
            setStudentID,
            setStatus,
            setYear,
          }}
        />
      )}

      {/* View Student Modal */}
      {viewStudent && (
        <ViewStudent
          student={viewStudent}
          closeAction={() => setViewStudent(null)}
        />
      )}

      <p className="text-sm text-slate-500 mt-2">
        Showing {filteredStudents.length} of {students.length} students
      </p>
    </div>
  );
}

// Reusable Student Form Component
const StudentForm = ({
  title,
  submitAction,
  closeAction,
  formData,
  setFormData,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="space-y-2">
        <label className="font-semibold">Name</label>
        <input
          className="w-full border p-2"
          value={formData.name}
          onChange={(e) => setFormData.setName(e.target.value)}
        />

        <label className="font-semibold">Email</label>
        <input
          className="w-full border p-2"
          value={formData.email}
          onChange={(e) => setFormData.setEmail(e.target.value)}
        />

        <label className="font-semibold">Address</label>
        <input
          className="w-full border p-2"
          value={formData.address}
          onChange={(e) => setFormData.setAddress(e.target.value)}
        />

        <label className="font-semibold">Contact</label>
        <input
          className="w-full border p-2"
          value={formData.contact}
          onChange={(e) => setFormData.setContact(e.target.value)}
        />

        <label className="font-semibold">Student ID</label>
        <input
          className="w-full border p-2"
          value={formData.studentID}
          onChange={(e) => setFormData.setStudentID(e.target.value)}
        />

        <label className="font-semibold">Status</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="Active"
              checked={formData.status === "Active"}
              onChange={(e) => setFormData.setStatus(e.target.value)}
            />
            Active
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="Not Active"
              checked={formData.status === "Not Active"}
              onChange={(e) => setFormData.setStatus(e.target.value)}
            />
            Not Active
          </label>
        </div>

        <label className="font-semibold">Year Level</label>
        <select
          className="border p-2 rounded-md w-full"
          value={formData.yearLevel}
          onChange={(e) => setFormData.setYear(e.target.value)}
        >
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={closeAction} className="px-3 py-1 bg-gray-300 rounded">
          Cancel
        </button>
        <button
          onClick={submitAction}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

// View Student Component
const ViewStudent = ({ student, closeAction }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
      <h2 className="text-lg font-bold">Student Details</h2>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">Name:</span> {student.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {student.email}
        </p>
        <p>
          <span className="font-semibold">Address:</span> {student.address}
        </p>
        <p>
          <span className="font-semibold">Contact:</span> {student.contact}
        </p>
        <p>
          <span className="font-semibold">Year Level:</span> {student.yearLevel}
        </p>
        <p>
          <span className="font-semibold">Student ID:</span> {student.studentID}
        </p>
        <p>
          <span className="font-semibold">Status:</span> {student.Status}
        </p>

        <div className="mt-4 flex justify-center">
          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500">
            <Barcode
              value={student.studentID}
              width={1}
              height={40}
              fontSize={10}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={closeAction} className="px-3 py-1 bg-gray-300 rounded">
          Close
        </button>
      </div>
    </div>
  </div>
);
