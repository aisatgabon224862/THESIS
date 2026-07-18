let activeStudent = {
  student: "",
  studentID: "",
};

export function setActiveStudent(data) {
  activeStudent = data;
}

export function getActiveStudent() {
  return activeStudent;
}
