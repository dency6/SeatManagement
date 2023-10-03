import React, { useState, useEffect } from "react";
import FileSaver from "file-saver";

function AdminStats() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState(null);
  const [roomType, setRoomType] = useState("seat");
  const [location, setLocation] = useState(0);
  const [locationVal, setLocationVal] = useState("all locations")
  const [locations, setLocations] = useState(null);
  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };
  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };
  const handleRoomTypeChange = (event) => {
    setRoomType(event.target.value);
  };
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };
  useEffect(
    (e) => {
      fetch("http://localhost:8081/api/location/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          setLocations(data);
        })
        .catch((error) => {
          setError(error.message);
        });
    },
    []
  );
  const handleDownloadPdf = () => {
    const header = "Bearer " + sessionStorage.getItem("accessToken");
    // const locationId = sessionStorage.getItem("userLocationId");
    fetch(
      `http://localhost:8081/api/pdf/bookings/dateWise/${fromDate}/${toDate}/${location}/${roomType}`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: header,
        },
      }
    )
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        // Use FileSaver.js to save the blob as a file
        FileSaver.saveAs(
          blob,
          `Bookings between ${fromDate} and ${toDate} at ${locationVal} for ${roomType}.pdf`
        );
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error);
      });
  };
  return (
    <>
      <div className="stat">
        <br />

        <label htmlFor="fromDate">From Date:</label>

        <input
          type="date"
          id="fromDate"
          value={fromDate}
          onChange={handleFromDateChange}
          style={{width:'90%'}}
        />

        <label htmlFor="toDate">To Date:</label>
        <input
          type="date"
          id="toDate"
          value={toDate}
          onChange={handleToDateChange}
          style={{width:'90%'}}
        />
        

        <label htmlFor="roomType">Select Type:</label>
        <select id="roomType" value={roomType} onChange={handleRoomTypeChange}>
          <option value="seat">Seat</option>
          <option value="board room">Board Room</option>
          <option value="conference room">Conference Room</option>
        </select> 
        

        <label htmlFor="location">Location:</label>
        <select id="location" value={location} onChange={handleLocationChange}>
          <option value="0">All</option>
          {locations && locations.map((location)=>{return(<option value={location.id}>{location.name}</option>)})}
        </select>
        
    <div style={{padding:'10px'}}><button className="button-group" style={{padding:'10px'}} onClick={handleDownloadPdf}>
          Download PDF
        </button></div>
        
      </div>
    </>
  );
}

export default AdminStats;
