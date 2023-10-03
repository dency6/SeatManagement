import { useEffect, useState } from "react";
import OpenSeatBookingForm from "./OpenSeatBookingForm.js";
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
  const locationId = sessionStorage.getItem("userLocationId");
  useEffect(() => {
    fetch(`http://localhost:8081/api/request/seat/location/${locationId}`, {
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
  }, [flag, props.flag]);

  const handlePopup = (e) => {
    fetch(`http://localhost:8081/api/request/seat/id/${e}`, {
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
        setIsOpenCon(true);
        setIsPending(false);
      });
  };

  const handleReject = (id) => {
    fetch(`http://localhost:8081/api/request/seat/cancel/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
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
      email:requestById.user.email,
      message:"Your Request for Booking seat in "+requestById.location.name+" on "+requestById.date+" between "+requestById.fromTime+"-"+requestById.toTime+" has been rejected."
    }
    console.log(JSON.stringify(notificationBody))
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
    }).then((data)=>{
     console.log(data)
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
        {/* {isPending && <div>Loading....</div>} */}
        {requests &&
          requests.map((req) => {
            return (
              <tr className="user-row">
                <td style={{ fontSize: "15px", textAlign: "left" }}>
                  {req.user.email.substring(0, 35)}
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
      {openBookingForm && (
        <OpenSeatBookingForm
          setOpenBookingForm={setOpenBookingForm}
          id={requestById.id}
          user={requestById.user}
          date={requestById.date}
          fromTime={requestById.fromTime}
          toTime={requestById.toTime}
          location={requestById.location}
          accepted={accepted}
          flag={props.flag}
          setFlag={props.setFlag}
        />
      )}
      {isOpenCon && (
        <div className="popupContainer" onClick={() => setIsOpenCon(false)}>
          <div className="popup-boxd" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <span className="email">
                <span style={{ color: "black" }}>Requested by: </span>
                {requestById.user.email}
              </span>
              <hr />
            </div>
            {isPending && <span><img src={loader} alt="loader" /></span>}
            {!isPending && (
              <div className="request-info">
                
                <div className="request-details">
                  <form>
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
                    <label for="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      class="form-control"
                      value={requestById.location.name}
                      required
                      step="3600"
                      style={{ height: "20px", width: "90%" }}
                    />

                    <textarea
                      className="form-control"
                      placeholder="Please provide your role along with purpose"
                      value={requestById.description}
                      style={{
                        width: "90%",
                        marginTop: "10px",
                        height: "60px",
                      }}
                    />
                  </form>
                </div>
              </div>
            )}

            <div className="buttonsContainer">
              <button
                type="submit"
                className="submit-btn"
                onClick={() => handleAccept()}
              >
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
