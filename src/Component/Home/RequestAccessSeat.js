import { useState } from "react";
import GetLocation from "./GetLocation.js";
import loader from '../../Static/loader.gif'
const RequestAccessSeat = ({ onClose, ...props }) => {
  const[isPending,setIsPending]=useState(false)
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [locationId, setLocationId] = useState(null);
  const [lFlag, setLFlag] = useState(false);
  const email = sessionStorage.getItem("email");
  const token = "Bearer " + sessionStorage.getItem("accessToken");
  const [message, setMessage] = useState("");

  function handleSubmit() {
    const requestData = {
      email,
      date,
      fromTime,
      toTime,
      locationId,
      description,
    };
    setIsPending(true)
    fetch(`http://localhost:8081/api/request/seat/`, {
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
          }, 1000);
        } else {
          throw new Error("failed to send request");
        }
        setIsPending(false)
      })
      .catch((error) => {
        setDescription(error.Description);
        setIsPending(false)
      });
  }

  return (
    <>
     {isPending && (
        <div className="popupContainer">
          <div className="popup-boxd" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <h2 style={{ color: "#0c3d4c" }}>
                Please wait while we process your request to book seat.
              </h2>
            </div>
            <div className="loader">
              <img src={loader} className="loader-gif" alt="loader" />
            </div>
          </div>
        </div>
      )}
      <div className="request-card">
        <h3>Request Seat</h3>
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
            style={{ height: "20px", width: "100%" }}
            required
          />
          <label for="location">Location</label>
          <GetLocation
            flagBooking={lFlag}
            setFlagBooking={setLFlag}
            onLocationChange={setLocationId}
            locationId={locationId}
          />
          <label for="location">Description</label>
          <textarea
            className="form-control"
            placeholder="Please provide your role along with purpose"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            style={{ width: "100%" }}
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
};

export default RequestAccessSeat;
