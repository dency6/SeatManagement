import { useState, useEffect } from "react";

const AvailableSeats = ({ date, fromTime, toTime, locationId, ...props }) => {
  const [seats, setSeats] = useState([]);
  const token = sessionStorage.getItem("accessToken");
  useEffect(
    
    (e) => {
       
      fetch(
        `http://localhost:8081/api/booking/dropdown/locationDateTime?date=${date}&fromTime=${fromTime}&toTime=${toTime}&location=${locationId}`,
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
          setSeats(data);
        });
    },
    [date, fromTime, toTime]
  );
  return (
    <>
      <label for="RoomType">Seats</label>
      <select
        name=""
        id=""
        style={{ height: "30px", width: "90%" }}
        value={props.seatId}
        onChange={(e) => props.setSeatId(e.target.value)}
      >
        {seats &&
          seats.map((seat) => {
            return <option value={seat.id} key={seat.name} onSelect={(e)=>props.setSeatName(e.target.key)}>{seat.name}</option>;
          })}
      </select>
    </>
  );
};

export default AvailableSeats;
