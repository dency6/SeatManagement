import React, { useState, useEffect } from "react";
import "./Profile.css";
import { Chart } from "react-google-charts";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

export const options = {
  title: "Bookings",
  pieHole: 0.4,
  is3D: false,
};

export function Stats() {
  const [user, setUser] = sessionStorage.getItem("userId");
  const [value, setValue] = useState(0);
  const [type, setType] = useState("monthly");
  const [heading, setHeading] = useState("");
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(
      `http://localhost:8081/api/booking/attendance/stats?user=${user}&type=${type}&value=${value}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setApiData(data);
        setHeading(data.heading);
      })
      .catch((error) => {
        console.log(error.message);
        setError(error.message);
      });
  }, [value, type]);

  return (
    <div id="chartContainer">
      <div>
        <select
          onChange={(e) => {
            setType(e.target.value);
            setValue(0);
          }}
        >
          <option value={"monthly"} selected>
            Monthly
          </option>
          <option value={"yearly"}>Yearly</option>
        </select>
        <MdArrowLeft size={"20px"} onClick={() => setValue(value - 1)} />
        {heading}
        <MdArrowRight size={"20px"} onClick={() => setValue(value + 1)} />
      </div>
      {apiData && (
        <>
          {apiData.bookedAndAbsent === 0 && apiData.bookedAndPresent === 0 && (
            <>
              <br />
              No bookings were made.
              <br />
            </>
          )}
          <Chart
            chartType="PieChart"
            width="100%"
            height="400px"
            data={[
              ["Bookings", "No. of days"],
              ["Booked and not attended", apiData.bookedAndPresent],
              ["Booked and attended", apiData.bookedAndAbsent],
            ]}
            options={options}
          />
        </>
      )}
    </div>
  );
}
