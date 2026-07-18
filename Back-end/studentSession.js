let currentStudent = {
  name: "Unknown",
  studentID: "",
};

export function setStudent(name, studentID) {
  currentStudent = {
    name,
    studentID,
  };

  console.log("SESSION STUDENT:", currentStudent);
}

export function getStudent() {
  return currentStudent;
}
