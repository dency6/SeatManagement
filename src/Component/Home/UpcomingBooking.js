import { useEffect, useState } from "react";
import loader from '../../Static/loader.gif'
const UpcomingBooking = (props) => {
  const [isOpenCon, setIsOpenCon] = useState(false);
  const [upcomingBooking, setupcomingBooking] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const [bookId, setBookId] = useState(null);
  const yearMonthDay = new Date();
  const currentDate = yearMonthDay.toISOString().substr(0, 10);

  useEffect(() => {
    const header = "Bearer " + sessionStorage.getItem("accessToken");
    const userId = sessionStorage.getItem("userId");
    fetch(`http://localhost:8081/api/booking/user/?user=${userId}`, {
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
        setupcomingBooking(data);
      })
      .catch((err) => {
        setIsPending(false);
      });
  }, [props.flag]);

  const handlePopup = (e) => {
    setBookId(e);
    setIsOpenCon(true);
  };
  const handleDelete = (bookId) => {
    const header = "Bearer " + sessionStorage.getItem("accessToken");
    setIsPending(true)
    fetch(
      `http://localhost:8081/api/booking/setActiveStatus/user/${bookId}/value/false`,
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
        return res.json();
      })
      .then((e) => {
        props.setFlag((prevState) => !prevState);
        setIsPending(false)
        setIsOpenCon(false);
        setMessage("booking canceled successfully");
      })
      .catch((err) => {
        setIsPending(false)
        setMessage(err.message);
      });
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }
  return (
    <>
    {isPending && (
        <div className="popupContainer" >
          <div className="popup-boxd" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <h2 style={{color:'#0c3d4c'}}>Please wait while we process your request to cancel the booking.</h2>
            </div>
            <div className="loader">
            <img src={loader} className="loader-gif" alt="loader" />
            </div>
            
          </div>
        </div>
      )}
      {upcomingBooking && (
        <table className="header-booking">
          <tbody className="header-booking">
            {isPending && <span>Loading.</span>}
            {upcomingBooking &&
              upcomingBooking
                .sort((a, b) => {
                  const [yearA, monthA, dayA] = a.date.split("-");
                  const bookingDateA = new Date(yearA, monthA - 1, dayA);
                  const [yearB, monthB, dayB] = b.date.split("-");
                  const bookingDateB = new Date(yearB, monthB - 1, dayB);
                  return bookingDateA - bookingDateB;
                })
                .map((booking) => {
                  if (booking.date >= currentDate) {
                    return (
                      <tr key={booking.id} className="header-booking">
                        <td>{formatDate(booking.date)}</td>
                        <td>{booking.seat.name}</td>
                        <td>{booking.fromTime}</td>
                        <td>{booking.toTime}</td>
                        <td>
                          <button
                            className="button-group"
                            value={booking.id}
                            onClick={() => handlePopup(booking.id)}
                          >
                            x
                          </button>
                        </td>
                      </tr>
                    );
                  } else {
                    return null;
                  }
                })}
          </tbody>
        </table>
      )}
      {isOpenCon && (
        <div className="popupContainer" onClick={() => setIsOpenCon(false)}>
          <div className="popup-boxd" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <h2>Are you sure to cancel this booking?</h2>
            </div>
            <div className="buttonsContainer">
              <button
                type="submit"
                className="submit-btn"
                onClick={() => {
                  handleDelete(bookId);
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

export default UpcomingBooking;
