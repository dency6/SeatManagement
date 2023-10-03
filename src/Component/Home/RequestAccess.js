import React, { useState } from "react";
import loader from '../../Static/loader.gif';


function RequestAccess({ onClose, ...props }) {
  const[isPending,setIsPending]=useState(false)
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [roomType, setRoomType] = useState("any Available");
  const [capacity, setCapacity] = useState(0);
  const email = sessionStorage.getItem("email");
  const token = "Bearer " + sessionStorage.getItem("accessToken");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      email,
      description,
      date,
      capacity,
      fromTime,
      toTime,
      roomType,
    };
   setIsPending(true)
    fetch("http://localhost:8081/api/requestBooking/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          setMessage("Your request has been sent successfully!");
          props.setRFlag(!props.rFlag);
          setTimeout(() => {
            onClose();
            setMessage("");
          }, 1500);
        } else {
          throw new Error("failed to send request");
        }
        setIsPending(false)
      })
      .catch((error) => {
        setIsPending(false)
        setDescription(error.Description);
      });
  };

  return (
    <>
    {isPending && (
        <div className="popupContainer">
          <div className="popup-boxd" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <h2 style={{ color: "#0c3d4c" }}>
                Please wait while we process your request to book a Room.
              </h2>
            </div>
            <div className="loader">
              <img src={loader} className="loader-gif" alt="loader" />
            </div>
          </div>
        </div>
      )}
      <div className="request-card">
        <h3>Request Board/Discussion Room</h3>
        <form onSubmit={handleSubmit}>
          <label for="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            class="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ height: "20px", width: "100%" }}
            required
          />
          <label for="fromTime">From Time</label>
          <input
            type="time"
            id="fromTime"
            name="fromTime"
            class="form-control"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            style={{ height: "20px", width: "100%" }}
            required
            step="3600"
          />
          <label for="toTime">To Time</label>
          <input
            type="time"
            id="toTime"
            name="toTime"
            class="form-control"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            step="3600"
            style={{ height: "19px", width: "100%" }}
            required
          />
          <label for="toTime">Capacity</label>
          <input
            type="number"
            id="toTime"
            name="toTime"
            class="form-control"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            style={{ height: "19px", width: "100%" }}
            required
          />
          <label for="RoomType">Room Type</label>
          <select
            className="drop-select"
            name="select"
            id="select"
            style={{ height: "28px", width: "100%" }}
            value={roomType}
            onChange={(e) => {
              setRoomType(e.target.value);
            }}
            required
          >
            <option value="" disabled>
              Select Room Type
            </option>
            <option value="Any Available">Any Available</option>
            <option value="Board Room">Board Room</option>
            <option value="Confrence Room">Confrence Room</option>
          </select>
          <label for="RoomType">Description</label>
          <textarea
            className="form-control"
            placeholder="Please provide your role along with purpose"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            style={{ width: "100%"}}
            required
          />
          <span className="request-card-center">
            <button type="submit">Request</button>
            &nbsp;&nbsp;
            <button onClick={onClose}>Close</button>
          </span>
        </form>
        {message && <span>{message}</span>}
      </div>
    </>
  );
}

export default RequestAccess;
