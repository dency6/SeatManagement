import { useEffect, useState } from "react";

const Room = ({locationId,date,fromTime,toTime,setRoomId,roomId}) => {
    const[availableRoom,setAvailableRoom]=useState(null)
    useEffect(() => {
      if (locationId && date && fromTime && toTime ) {
        const header = "Bearer " + sessionStorage.getItem("accessToken");
        fetch(
          `http://localhost:8081/api/bookRoom/available/locationDateTime?location=${locationId}&date=${date}&fromTime=${fromTime}&toTime=${toTime}`,
          {
            headers: {
              Authorization: header,
            },
          }
        )
          .then((res) => {
            if (!res.ok) {
              throw Error("filed to load the available seats");
            }
            return res.json();
          })
          .then((data) => {
            setAvailableRoom(data);
          })
      }
    }, [date, locationId,fromTime,toTime]);

    return ( <>
    <select
          className="drop-select"
          name="select"
          id="select"
          value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{width:'90%'}}
        >
        <option selected disabled hidden>
            Select a Room
          </option>
        
          {availableRoom &&
            availableRoom.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
        </select>
    </> );
}
 
export default Room;