import { useEffect, useState } from "react";

const PendingRequest = ({rFlag, setRFlag, ...props}) => {
  const [isOpenCon, setIsOpenCon] = useState(false);
  const [acceptedRequest, setAcceptedRequest] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const[roomBookingid,setRoomBookingId]=useState(null)
  useEffect(() => {
    const header = "Bearer " + sessionStorage.getItem("accessToken");
    const email = sessionStorage.getItem("email");
    fetch(`http://localhost:8081/api/requestBooking/byUser/${email}`, {
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
        setAcceptedRequest(data);
        setIsPending(false);
      })
      .catch((err) => {
        setIsPending(false);
      });
  }, [rFlag]);
  const handlePopup=(id)=>{
    setIsOpenCon(true)
    setRoomBookingId(id)
  }
  const handleDelete=(id)=>{
    const header = "Bearer " + sessionStorage.getItem("accessToken");
    fetch(
      `http://localhost:8081/api/requestBooking/request/${id}/value/false`,
      {
        method: "PUT",
        headers: {
          Authorization: header,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw Error("cannot be deleted");
        }
        return res;
      })
      .then((e) => {
        props.setRFlag((prevState) => !prevState);
        setIsOpenCon(false);
        console.log("booking canceled successfully");
      })
  }
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }
  return (
    <>
      {!isPending && acceptedRequest.length > 0 && (
       <table className="header-booking">
       <tbody className="header-booking">
          {acceptedRequest.map((request) => (
            <tr key={request.id} className="header-booking">
              <td>{formatDate(request.date)}</td>
              <td>{request.fromTime.substring(0,5)} -{request.toTime.substring(0,5)}</td>
              <td>{request.capacity}</td>
              <td>{request.roomType}</td>
              <td>
                <button
                  className="button-group"
                  value={request.id}
                  onClick={() => handlePopup(request.id)}
                >
                  x
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      )}
      {isOpenCon && (
        <div className="popupContainer" onClick={() => setIsOpenCon(false)}>
          <div className="popup-boxd" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <h2>Are you sure to cancel this request?</h2>
            </div>
            <div className="buttonsContainer">
              <button
                type="submit"
                className="submit-btn"
                onClick={() => {
                  handleDelete(roomBookingid);
                  setIsOpenCon(false);
                }}
              >
                Yes
              </button>
              <button
                type="reset"
                className="cancel-btn"
                onClick={() => setIsOpenCon(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PendingRequest;
