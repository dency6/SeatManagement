import { useEffect, useState } from "react";
import OpenRoomBookingForm from "./RoomBookingForm";
import loader from '../../Static/loader.gif'
const Request = (props) => {
  const [requests, setRequest] = useState([]);
  const [requestById, setRequestById] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [isOpenCon, setIsOpenCon] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [acceptedRequest, setAcceptedRequest] = useState(null);
  const [flag, setFlag] = useState(false);
  const [openBookingForm, setOpenBookingForm] = useState(false);
  const token = "Bearer " + sessionStorage.getItem("accessToken");

  useEffect(() => {
    fetch("http://localhost:8081/api/requestBooking/", {
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("cannot fetch the data");
        }
        return res.json();
      })
      .then((data) => {
        setRequest(data);
      });
  }, [flag,props.flag]);

  const handlePopup = (e) => {
    setRequestId(e);
    
    fetch(`http://localhost:8081/api/requestBooking/${requestId}`, {
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("cannot fetch the data");
        }
        return res.json();
      })
      .then((data) => {
        setRequestById(data);
        console.log(data);
        setIsOpenCon(true);
        setIsPending(false);
      });
  };

  const handleReject = (id) => {
    fetch(`http://localhost:8081/api/requestBooking/request/${id}/value/false`, {
      method: 'PUT',
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ accepted: false }),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("cannot fetch the data");
        }
        return res;
      })
      .then(() => {
        setFlag(!flag);
        setIsOpenCon(false);
        RejectNotification()
      });
  };
  const RejectNotification=()=>{
    const notificationBody={
      email:requestById.email,
      message:"Your Request for Booking "+requestById.roomType+" for "+requestById.date+" between "+requestById.fromTime+"-"+requestById.toTime+" has been rejected."
    }
    fetch(`http://localhost:8081/api/notification/`,{
      method:'POST',
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
      body:JSON.stringify(notificationBody)
    }).then((res)=>{
      if(!res.ok){
        throw new Error(res.statusText)
      }
      return res.json()
    })
    .then((data)=>{
     
    })
  }
  const handleAccept = () => {
    setAccepted(true);
    setIsOpenCon(false);
    setOpenBookingForm(true);
  };
  

  return (
    <>
      <tbody>
        {isPending && <div><img src={loader} alt="loader" /></div>}
        {requests &&
          requests.map((req) => {
            return (
              <tr className="user-row">
                <td style={{ fontSize: "15px", textAlign: "left" }}>
                  {req.email.substring(0, 35)}
                </td>
                <td>
                  <button
                    className="button-group"
                    value={req.id}
                    onClick={() => handlePopup(req.id)}
                  >
                    view
                  </button>
                </td>
              </tr>
            );
          })}
      </tbody>
      {openBookingForm && <OpenRoomBookingForm setOpenBookingForm={setOpenBookingForm}  id={requestById.id} userEmail={requestById.email} date={requestById.date} fromTime={requestById.fromTime} toTime={requestById.toTime} roomType={requestId.roomType} acceptedRequest={acceptedRequest} flag={props.flag} setFlag={props.setFlag}/>}
      {isOpenCon && (
        <div className="popupContainer" onClick={() => setIsOpenCon(false)}>
          <div className="popup-boxd" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
            <span className="email" > <span style={{color:'black'}}>Requested by: </span>{requestById.email}</span>
                   <hr />
            </div>
            {/* {isPending && <span>Loading...</span>} */}
            {!isPending && (
              <div className="request-info">
                {requestById && (
                  <div className="request-details">
                    
                    <form >
        <label for="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          class="form-control"
          value={requestById.date}
          style={{ height: "20px", width: "90%" }}
          required
        />
        <label for="fromTime">From Time</label>
        <input
          type="time"
          id="fromTime"
          name="fromTime"
          class="form-control"
          value={requestById.fromTime}
         
          style={{ height: "20px", width: "90%" }}
          required
          step="3600"
        />
        <label for="toTime">To Time</label>
        <input
          type="time"
          id="toTime"
          name="toTime"
          class="form-control"
          value={requestById.toTime}
          required
          step="3600"
          style={{ height: "20px", width: "90%" }}
        />
        <label for="toTime">Capacity</label>
        <input
          type="number"
          id="toTime"
          name="toTime"
          class="form-control"
          value={requestById.capacity}
          required
          style={{ height: "20px", width: "90%" }}
        />
        <label for="RoomType">Room Type</label>
        <input
          type="text"
          id="toTime"
          name="toTime"
          class="form-control"
          value={requestById.roomType}
          required
          style={{ height: "20px", width: "90%" }}
        />
        
        <textarea
          className="form-control"
          placeholder="Please provide your role along with purpose"
          value={requestById.description}
          
          style={{  width: "90%" ,marginTop:'10px',height:'60px'}}
        />
        
      </form>
                  </div>
                )}
              </div>
            )}

            <div className="buttonsContainer">
              <button type="submit" className="submit-btn"
              onClick={() => handleAccept()}>
                Accept
              </button>
              <button
                type="reset"
                className="cancel-btn"
                onClick={() => handleReject(requestById.id)}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Request;
