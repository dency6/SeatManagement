import { useState } from "react";
import AvailableSeats from "./AvailableSeats";
import loader from '../../Static/loader.gif'
const OpenSeatBookingForm = (props) => {
    const [isOpenCon, setIsOpenCon] = useState(true);
    const [isPending,setIsPending]=useState(false)
    const [date, setDate] = useState(props.date);
    const [fromTime, setFromTime] = useState(props.fromTime);
    const [toTime, setToTime] = useState(props.toTime);
    const [location, setLocation] = useState(props.location);
    const [user,setUser]=useState(props.user)
    const [seatId, setSeatId] = useState(null);
    const[seatname,setSeatName]=useState(null);
    const token = sessionStorage.getItem("accessToken");
   
    const handleSubmit = (e) => {
      e.preventDefault();
      setIsPending(true)
      setIsOpenCon(false)
      const bookingDetail = {
        locationId: location.id,
        userId: user.id,
        seatId: seatId,
        date: date,
        fromTime: fromTime,
        toTime: toTime,
        accoliteId: user.accoliteId,
      };
      
      fetch(`http://localhost:8081/api/booking/`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(bookingDetail),
      })
        .then((res) => {
          if (!res.ok) {
            throw Error("failed to book seat");
          }
          return res.json();
        })
        .then((data) => {
          AddNotification()
          fetch(`http://localhost:8081/api/request/seat/accept/${props.id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("cannot fetch the data");
        }
        props.setFlag(!props.flag)
        return res;
      })
      setIsPending(false)
      
        })
        .catch((error) => {
          setIsPending(false)
          console.log(error.message);
        });
    };
    const AddNotification=()=>{
      const notificationBody={
        email:user.email,
        message:"Your Request for Booking Seat in "+location.name+" on "+date+" between "+fromTime+"-"+toTime+" has been accepted. Your seat number is "+seatname+" ."
      }
      console.log(JSON.stringify(notificationBody))
      fetch(`http://localhost:8081/api/notification/`,{
        method:'POST',
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        body:JSON.stringify(notificationBody)
      }).then((res)=>{
        if(!res.ok){
          throw new Error(res.statusText)
        }
        return res.json()
      })
      .then((data)=>{
       console.log(data)
      })
    }
    return (
      <>
      {isPending && (
        <div className="popupContainer">
          <div className="popup-boxd" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <h2 style={{ color: "#0c3d4c" }}>
                Please wait while we process your request to book a seat.
              </h2>
            </div>
            <div className="loader">
              <img src={loader} className="loader-gif" alt="loader" />
            </div>
          </div>
        </div>
      )}
        {isOpenCon && (
          <div
            className="popupContainer"
            onClick={() => props.setOpenBookingForm(false)}
          >
            <div className="popup-boxd" onClick={(e) => e.stopPropagation()}>
              <div className="popupHeader">
                <h2>Book Seat</h2>
                <hr />
              </div>
              <div className="table-scroll">
                <form className="room-form" onSubmit={handleSubmit}>
                  <div className="location-item">
                    <label for="date">Date</label>
                    
                    <input
                      type="date"
                      id="date"
                      name="date"
                      class="form-control"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      style={{ height: "20px", width: "90%" }}
                      
                    />
                  </div>
  
                  <div className="location-item">
                    <label for="fromTime">From Time</label>
                    <input
                      type="time"
                      id="fromTime"
                      name="fromTime"
                      class="form-control"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                      style={{ height: "20px", width: "90%" }}
                      
                      step="3600"
                    />
                  </div>
                  <div className="location-item">
                    <label for="toTime">To Time</label>
                    <input
                      type="time"
                      id="toTime"
                      name="toTime"
                      class="form-control"
                      value={toTime}
                      onChange={(e) => setToTime(e.target.value)}
                      step="3600"
                      style={{ height: "20px", width: "90%" }}
                    />
                  </div>
                  
                  <div className="location-item">
                    <label for="location">Location</label>
                    <input
                      type="text"
                      id="toTime"
                      name="toTime"
                      class="form-control"
                      value={location.name}
                      readOnly
                      style={{ height: "20px", width: "90%" }}
                    />
                  </div>
                  
                  <div className="location-item">
                    
                      <div class="form-group">
                        <AvailableSeats setSeatName={setSeatName}seatId={seatId} setSeatId={setSeatId} date={date} fromTime={fromTime} toTime={toTime} locationId={location.id}/>
                      </div>
                  </div>
                  <button className="button-group" style={{padding:'10px', marginTop:'10px'}}>Submit</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </>
    );
}
 
export default OpenSeatBookingForm;