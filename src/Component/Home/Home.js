import { useState, useEffect } from "react";
import UpcomingBooking from "./UpcomingBooking";
import CompletedBooking from "./CompletedBooking";
import RequestAccess from "./RequestAccess";
import DisplayLayout from "./DisplayLayout";
import AcceptedRequest from "./AcceptedRequest";
import PendingRequest from "./PendingRequest";
import RequestAccessSeat from "./RequestAccessSeat";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const Home = () => {
  // const [countall, setCountAll] = useState(0);
  // const [countAvailable, setCountAvailable] = useState(0);
  const [date, setDate] = useState(null);
  const [fromTime, setFromTime] = useState("09:30");
  const [toTime, setToTime] = useState("17:30");
  const [message, setMessage] = useState("");
  const [openBooking, setOpenBooking] = useState(true);
  const [openRequest, setOpenRequest] = useState(true);
  const header = "Bearer " + sessionStorage.getItem("accessToken");
  const [flag, setFlag] = useState(true);
  const [rFlag, setRFlag] = useState(true);
  const locationId = sessionStorage.getItem("userLocationId");
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [seats, setSeats] = useState(null);
  const [seatAvailability, setSeatAvailability] = useState(null);
  const token = sessionStorage.getItem("accessToken");
  const [disabledDates, setDisabledDates] = useState([]);

  useEffect(()=>{
    const header = "Bearer " + sessionStorage.getItem("accessToken");
    const email = sessionStorage.getItem("email");
    fetch(`http://localhost:8081/api/booking/activeDates/user/${email}`, {
      headers: {
        Authorization: header,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("Response not received");
        }
        return res.json();
      })
      .then((data) => {
        setDisabledDates(data);
      })
  }, []);
  useEffect(
    (e) => {
      if(date!==null){
        const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const ndate = `${year}-${month}-${day}`;
      fetch(
        `http://localhost:8081/api/booking/available/locationDateTime?date=${ndate}&fromTime=${fromTime}&toTime=${toTime}&location=${locationId}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
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
          setSeatAvailability(data);
        
        })
        .catch((error) => {
          setError(error.message);
        });}
    },
    [date, fromTime, toTime]
  );

  useEffect(
    (e) => {
      fetch(`http://localhost:8081/api/location/${locationId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          setLocation(data);
        })
        .catch((error) => {
          setError(error.message);
        });
    },
    [flag]
  );

  useEffect((e) => {
    fetch(`http://localhost:8081/api/seat/location/${locationId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setSeats(data);
       
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  function handleAccessClick(e) {
    if(e==="1"){
      setShowModal1(true);
    }
    else if(e==="2"){
      setShowModal2(true)
    }
  }
  const isDayDisabled = (date) => {
    const currentDate = new Date(); // Get the current date
  currentDate.setHours(0, 0, 0, 0);
    const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const ndate = `${year}-${month}-${day}`;
    // const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();

    return (disabledDates.includes(ndate) || dayOfWeek === 0 || dayOfWeek === 6 || date < currentDate);
  };
  const handleDateChange = (date) => {
    setDate(date);
    console.log(date)
  };
  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };
  return (
    <>
      <div className="container">
        <div className="container-content">
          <div className="row">
            <div className="row-card" style={{ gridRow: "1 / 2" }}>
              <div className="row-card-title">
                <span className="btn-group">
                  <button
                    onClick={() => {
                      setOpenBooking(true);
                    }}
                    style={{ 
                      textDecoration: openBooking ? 'underline':'none',
                      color: openBooking ? '#0c3d4c':'black',
                      fontSize:openBooking ? '14px':'13px'
                      }}
                  >
                    <h3>Upcoming Booking</h3>
                  </button>
                  <button
                    onClick={() => {
                      setOpenBooking(false);
                    }}
                    style={{ 
                      textDecoration: !openBooking ? 'underline':'none',
                      color: !openBooking ? '#0c3d4c':'black',
                      fontSize:!openBooking ? '14px':'13px'
                      }}
                  >
                    <h3>Completed Booking</h3>
                  </button>
                </span>
              </div>
              <div className="row-card-body">
                <table className="header-booking">
                  <tr>
                    <th>Date</th>
                    <th>Seat Name</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    {openBooking && <th>Cancel</th>}
                  </tr>
                </table>
                <div className="table-scroll-1">
                  {openBooking && (
                    <UpcomingBooking flag={flag} setFlag={setFlag} />
                  )}
                  {!openBooking && (
                    <CompletedBooking flag={flag} setFlag={setFlag} />
                  )}
                </div>
              </div>
            </div>
            <div
              className="row-card"
              style={{ gridRow: "2 / 3", height: "190px" }}
            >
              <div className="row-card-title">
                <span className="btn-group">
                  <button
                    onClick={() => {
                      setOpenRequest(true);
                    }}
                    style={{ 
                      textDecoration: openRequest ? 'underline':'none',
                      color: openRequest ? '#0c3d4c':'black',
                      fontSize:openRequest ? '14px':'13px'
                      }}
                  >
                    <h3>Room Bookings</h3>
                  </button>
                  <button
                    onClick={() => {
                      setOpenRequest(false);
                    }}
                    style={{ 
                      textDecoration: !openRequest ? 'underline':'none',
                      color: !openRequest ? '#0c3d4c':'black',
                      fontSize:!openRequest ? '14px':'13px'
                      }}
                  >
                    <h3>Requests</h3>
                  </button>
                </span>
              </div>
              <div className="row-card-body">
                <table className="header-booking">
                  {openRequest && (
                    <tr>
                      <th>Date</th>
                      <th>Room Type</th>
                      <th>Room Number</th>
                      <th>Time</th>
                    </tr>
                  )}
                  {!openRequest && (
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Capacity</th>
                      <th>Room Type</th>
                      <th>Cancel</th>
                    </tr>
                  )}
                </table>

                <div className="table-scroll-2">
                  {openRequest && (
                    <AcceptedRequest rFlag={rFlag} setRFlag={setRFlag} />
                  )}
                  {!openRequest && (
                    <PendingRequest rFlag={rFlag} setRFlag={setRFlag} />
                  )}
                </div>
              </div>
            </div>
            <div
              className="row-card"
              style={{ gridRow: "1 / 3", height: "530px" }}
            >
              <div
                className="row-card-title"
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexDirection: "row",
                }}
              >
                <div>
                  <h4 style={{fontVariant:'small-caps'}}>Book Seats</h4>
                </div>
                <div>
                  <select name="" id="" className="drop-select" onChange={(e)=>handleAccessClick(e.target.value)}>
                  <option value="" disabled selected>Requests</option>
                    <option value="1">Seats</option>
                    <option value="2" >Board/Diccussion Room</option>
                  </select>
                  {/* <button className="access" onClick={handleAccessClick}>
                    Request Board/Discussion Room
                  </button>
                  <button className="access" onClick={handleAccessClick}>
                    Request seats
                  </button> */}
                </div>
                
              </div>

              {showModal2 && (
                <RequestAccess
                  setShowModal={setShowModal2}
                  onClose={() => setShowModal2(false)}
                  rFlag={rFlag}
                  setRFlag={setRFlag}
                />
              )}
              {showModal1 && (
                <RequestAccessSeat
                  setShowModal={setShowModal1}
                  onClose={() => setShowModal1(false)}
                  rFlag={rFlag}
                  setRFlag={setRFlag}
                />
              )}
              <div className="card-body">
                <div className="cards-body-col">
                  <div className="form-container">
                    <span>{message}</span>
                    <form className="modal-form">
                      <div className="form-item">
                      <DatePicker
                      className="date-picker"
          selected={date}
          onChange={handleDateChange}
          filterDate={(date) => !isDayDisabled(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="dd/mm/yyyy"
          value={date ? formatDate(date) : ''}
        />
                        {/* <input
                          type="date"
                          name="date"
                          id="date1"
                          value={date}
                          onChange={(e) => {
                            setDate(e.target.value);
                          }}
                          
                          min={new Date().toISOString().split("T")[0]} // Set minimum date to today
                        /> */}
                        
                      </div>
                      <div class="form-item">
                        <input
                          type="time"
                          id="time"
                          name="time"
                          class="form-control"
                          value={fromTime}
                          onChange={(e) => {
                            setFromTime(e.target.value);
                          }}
                          required
                          step="3600"
                        />
                      </div>
                      <div class="form-item">
                        <input
                          type="time"
                          id="time"
                          name="time"
                          class="form-control"
                          value={toTime}
                          onChange={(e) => {
                            setToTime(e.target.value);
                          }}
                          required
                          step="3600"
                        />
                      </div>
                    </form>
                  </div>
                </div>
                {location && seats && (
                  <DisplayLayout
                    location={location}
                    seats={seats}
                    seatAvailability={seatAvailability}
                    date={date}
                    fromTime={fromTime}
                    toTime={toTime}
                    flag={flag}
                    setFlag={setFlag}
                  ></DisplayLayout>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Home;
