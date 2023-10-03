import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "./Attendance.css";
import { AttendanceExcel } from "./AttendanceExcel";
import { use } from "@js-joda/core";
import { json } from "react-router-dom";
import Present from "./Present";
import Absent from "./Absent";
import DayWisePdf from "./DateWisePdf";

const Attendance = () => {
  const [date, setDate] = useState("");
  const [toggle, setToggel] = useState(true);
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  const handleFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          header: ["emp_Id", "name", "date", "in_Time", "out_Time"],
          range: 1, // ignore first row
        });
        setJsonData(json);
        setError(null);
      } catch (error) {
        setError("Failed to read file");
        setJsonData(null);
      }
    };
    reader.readAsBinaryString(file);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(JSON.stringify(jsonData, null, 2));
    fetch(`http://localhost:8081/api/booking/markAttendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify(jsonData, null, 2),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("Failed to mark attendance");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setMessage("Attendance recorded successfully");
        setJsonData(null);
        setError(null);
        console.log(data);
      })
      .catch((error) => {
        setError(error.message);
        setData(null);
        console.log(error.message);
      });
  };
  // useEffect(() => {
  //   const formattedDate = new Date().toLocaleDateString();
  //   setDate(formattedDate);
  // }, [date]);
  if (message) {
    setTimeout(() => {
      setMessage("");
    }, 2000);
  }
  return (
    <>
      <div className="container">
        <div className="container-content">
          <div className="row" >
            <div className="row-card" style={{height:'86vh'}}>
              <div className="row-card-title">
                <span className="btn-group">
                  <button
                    onClick={() => {
                      setToggel(true);
                    }}
                  >
                    <h3>Present</h3>
                  </button>
                  <button
                    onClick={() => {
                      setToggel(false);
                    }}
                  >
                    <h3>Absent</h3>
                  </button>
                </span>
                <hr />
                <form className="modal-form" style={{marginTop:"-10px"}}>
                  <div className="form-item">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                      }}
                    />
                  </div>
                  {date && (
                    <span>
                    <DayWisePdf date={date} />
                    </span>
                  )}
                </form>
              </div>
              <div className="row-card-body">
                <table className="header-booking" style={{ marginTop: "70px" }}>
                  <tr>
                    <th>Accolite Id</th>
                    <th>Seat Name</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                  </tr>
                </table>
                <div className="table-scroll">
                  {toggle && <Present date={date} />}
                  {!toggle && <Absent date={date} />}
                </div>
              </div>
            </div>
            <div className="row-card" style={{height:'86vh'}}>
              <div className="row-card-attendance">
                <div className="card-attandance">
                  <div className="row-card-title">
                    <h3>Upload Attendance from Biometrics</h3>

                    <hr />
                  </div>
                  <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-item">
                      <input type="file" onChange={handleFile} />
                    </div>
                    <button className="button-group">Mark Attendance</button>
                  </form>
                </div>
                <div className="card-attandance">
                  <div className="table-scroll">
                    {message && <span>{message}</span>}
                    {jsonData && (
                      <table className="header-booking">
                        <thead className="header-booking">
                          <tr>
                            {Object.keys(jsonData[0]).map((key) => (
                              <th key={key}>{key}</th>
                            ))}
                          </tr>
                        </thead>

                        <tbody
                          className="header-booking"
                          style={{ textAlign: "center" }}
                        >
                          {jsonData.map((data, index) => (
                            <tr key={index}>
                              {Object.values(data).map((value, index) => (
                                <td key={index}>{value}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attendance;
