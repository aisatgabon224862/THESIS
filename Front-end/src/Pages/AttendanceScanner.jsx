import React from "react";
import FaceScan from "../Security/FaceScan";
import Scanner from "../Security/Scanner";

const AttendanceScanner = () => {
  return (
    <div>
      <FaceScan />
      <div>
        <Scanner />
      </div>
    </div>
  );
};

export default AttendanceScanner;
