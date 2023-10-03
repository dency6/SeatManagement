import { useState, useEffect } from "react";
import { LocalDate } from "@js-joda/core";
import loader from "../../Static/loader.gif";
const CurrentDayBooking = () => {
  const [allBooking, setAllAbooking] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [isOpenCon, setIsOpenCon] = useState(false);
  const [bookId, setBookId] = useState(null);
  const [message, setMessage] = useState("");
  const [flag, setFlag] = useState(false);
  const locationId = sessionStorage.getItem("userLocationId");
  const token = "Bearer " + sessionStorage.getItem("accessToken");
  const handlePopup = (e) => {
    setBookId(e);
    setIsOpenCon(true);
  };
  useEffect(() => {
    fetch(`http://localhost:8081/api/booking/location?location=${locationId}`, {
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("connot fetch the data");
        }
        return res.json();
      })
      .then((data) => {
        setAllAbooking(data);
        setIsPending(false);
      });
  }, [flag]);
  const handleDelete = (bookId) => {
    setIsOpenCon(false);
    setIsPending(true);

    fetch(
      `http://localhost:8081/api/booking/setActiveStatus/admin/${bookId}/value/false`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: token,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw Error("unable to fetch");
        }
        return res;
      })
      .then((data) => {
        setFlag(!flag);
        setIsPending(false);
      });
  };

  return (
    <>
      <tbody>
        {allBooking &&
          allBooking
            .filter((booking) =>
              LocalDate.parse(booking.date).equals(LocalDate.now())
            ) // filter bookings for current date
            .map((booking) => {
              return (
                <tr className="user-row">
                  <td>{booking.seat.name}</td>
                  <td style={{ fontSize: "small" }}>
                    {booking.fromTime.substring(0, 5)} -{" "}
                    {booking.toTime.substring(0, 5)}
                  </td>
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
            })}
      </tbody>
      {isPending && (
        <div className="popupContainer">
          <div className="popup-boxd" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <h2 style={{ color: "#0c3d4c" }}>
                Please wait while we process your request to cancel the booking.
              </h2>
            </div>
            <div className="loader">
              <img src={loader} className="loader-gif" alt="loader" />
            </div>
          </div>
        </div>
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
                onClick={() => handleDelete(bookId)}
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

export default CurrentDayBooking;
