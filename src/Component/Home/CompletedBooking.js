import { useEffect, useState } from "react";
const CompletedBooking = (props) => {
  const [isOpenCon, setIsOpenCon] = useState(false);
  const [upcomingBooking, setupcomingBooking] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [message, setMessage] = useState("");
  const [bookId, setBookId] = useState(null);
  const [flag, setFlag] = useState(false);
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
        console.log(upcomingBooking);
        setIsPending(false);
      })
      .catch((err) => {
        setIsPending(false);
      });
  }, [flag]);

  const handlePopup = (e) => {
    setBookId(e);
    setIsOpenCon(true);
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
                  if (booking.date < currentDate) {
                    return (
                      <tr key={booking.id} className="header-booking">
                        <td>{formatDate(booking.date)}</td>
                        <td>{booking.seat.name}</td>
                        <td>{booking.fromTime}</td>
                        <td>{booking.toTime}</td>
                      </tr>
                    );
                  } else {
                    return null;
                  }
                })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default CompletedBooking;
