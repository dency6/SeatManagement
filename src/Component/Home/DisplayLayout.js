import { useState, useEffect } from "react";
import DisplaySeat from "./DisplaySeat";
import loader from "../../Static/loader.gif";
import seat from "../../Static/seats.png";
import DisplayStaticArea from "./DisplayStaticArea";

const DisplayLayout = ({
  location,
  seatAvailability,
  seats,
  date,
  fromTime,
  toTime,
  flag,
  setFlag,
}) => {
  const [b, setB] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("accessToken");
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const accId = sessionStorage.getItem("accoliteId");

  const handleBooking = () => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const ndate = `${year}-${month}-${day}`;
    const bookingDetail = {
      locationId: location.id,
      userId: userId,
      seatId: selected,
      date: ndate,
      fromTime: fromTime,
      toTime: toTime,
      accoliteId: accId,
    };
    setIsPending(true);
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
        setSelected(null);
        setMessage(null);
        return res.json();
      })
      .then((data) => {
        setStatus(data.isSuccessful);
        setMessage(data.message);
        setIsPending(false);
        setFlag(!flag);
        setB(!b);
        window.location.reload();
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  const staticArea1 = [];
  const staticArea_1 = [];
  for (let i = 1; i <= 1; i++) {
    const sCols1 = [];
    const sCols_1 = [];
    for (let j = 1; j <= location.cs; j++) {
      sCols1.push(
        <td>
          {
            <DisplayStaticArea
              location={location}
              row={i}
              col={j}
              dir={1}
            ></DisplayStaticArea>
          }
        </td>
      );
      sCols_1.push(
        <td>
          {
            <DisplayStaticArea
              location={location}
              row={i}
              col={j}
              dir={2}
            ></DisplayStaticArea>
          }
        </td>
      );
    }
    staticArea1.push(<tr>{sCols1}</tr>);
    staticArea_1.push(<tr>{sCols_1}</tr>);
  }
  const staticAreaC1 = [];
  const staticAreaC_1 = [];
  for (let i = 1; i <= location.rs; i++) {
    const sColsC1 = [];
    const sColsC_1 = [];
    for (let j = 1; j <= 1; j++) {
      sColsC1.push(
        <td>
          {
            <DisplayStaticArea
              location={location}
              row={i}
              col={j}
              dir={3}
            ></DisplayStaticArea>
          }
        </td>
      );
      sColsC_1.push(
        <td>
          {
            <DisplayStaticArea
              location={location}
              row={i}
              col={j}
              dir={4}
            ></DisplayStaticArea>
          }
        </td>
      );
    }
    staticAreaC1.push(<tr>{sColsC1}</tr>);
    staticAreaC_1.push(<tr>{sColsC_1}</tr>);
  }
  const rows = [];
  for (let i = 1; i <= location.rs; i++) {
    const cols = [];
    for (let j = 1; j <= location.cs; j++) {
      const id = location.id + "R" + i + "C" + j;
      cols.push(
        <td>
          {!seatAvailability && (
            <DisplaySeat
              location={location}
              row={i}
              col={j}
              status={false}
              selected={selected}
              b={b}
            ></DisplaySeat>
          )}
          {seatAvailability && seatAvailability.hasOwnProperty(id) && (
            <div
              onClick={() => {
                setMessage(null);
                setSelected(id);
              }}
            >
              <DisplaySeat
                location={location}
                row={i}
                col={j}
                status={true}
                selected={selected}
                b={b}
              ></DisplaySeat>
            </div>
          )}
          {seatAvailability && !seatAvailability.hasOwnProperty(id) && (
            <DisplaySeat
              location={location}
              row={i}
              col={j}
              status={false}
              selected={selected}
              b={b}
            ></DisplaySeat>
          )}
        </td>
      );
    }
    rows.push(<tr>{cols}</tr>);
  }

  return (
    <>
      {isPending && (
        <div className="popupContainer">
          <div className="popup-boxd" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <h2 style={{ color: "#0c3d4c" }}>
                Your reservation is being processed and will be confirmed
                shortly.{" "}
              </h2>
            </div>
            <div className="loader">
              <img src={seat} className="loader-gif" alt="loader" />
            </div>
            <div className="loader">
              <img src={loader} className="loader-gif" alt="loader" />
            </div>
          </div>
        </div>
      )}
      <div className="header">
        <h4 style={{fontVariant:'small-caps'}}>{location.name}</h4>
        <h5>
          Available Seats :{" "}
          {seatAvailability ? Object.keys(seatAvailability).length : 0}/
          {location.seatingCapacity}
        </h5> */}
        {message && status === 0 && <h3 style={{ color: "red" }}>{message}</h3>}
        {message && status === 1 && (
          <h3 style={{ color: "green" }}>{message}</h3>
        )}
        {selected && (
          <button
            className="button-group"
            style={{marginTop:'10px'}}
            onClick={() => {
              handleBooking();
            }}
          >
            Book Seat
          </button>
        )}
      </div>
      <div className="loc-layout-tables">
        <table className="staticLocTable">{staticArea1}</table>
        <div style={{ display: "flex" }}>
          <table>{staticAreaC1}</table>
          <table className="locationTable">{rows}</table>
          <table>{staticAreaC_1}</table>
        </div>
        <table className="staticLocTable">{staticArea_1}</table>
      </div>
    </>
  );
};

export default DisplayLayout;
