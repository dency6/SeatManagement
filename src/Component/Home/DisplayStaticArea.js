import { useState, useEffect } from "react";
import boardRoom from "../../Static/boardroom.png";
import Entry from "../../Static/Entry.png";
import Exit from "../../Static/exit.png";
import Pantry from "../../Static/pantry.png"
import washRoom from "../../Static/washRoom.png"
import EmergencyExit from "../../Static/emergency-exit.png";
import Store from "../../Static/warehouse.png";



const DisplayStaticArea = ({ location, row, col, dir }) => {
  const [area, setArea] = useState(null);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("accessToken");
  const [name, setName] = useState(null);
 

  useEffect(() => {
    fetch(
      `http://localhost:8081/api/locationStaticArea/position?location=${location.id}&row=${row}&column=${col}&dir=${dir}`,
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
       
        setArea(data);
        setName(data.seatName);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);
  return (
    <>
      {area && area.isAvailable === 1 && area.d===dir && (
        <div className="display-area" >
          {area.areaName==="Entry" && <><img src={Entry} alt="entry" /></>  }
          {area.areaName==="Exit" && <img src={Exit} alt="exit" /> }
          {area.areaName==="WashRoom" && <img src={washRoom} alt="entry" /> }
          {area.areaName==="Pantry" && <img src={Pantry} alt="entry" /> }
          {area.areaName==="Room" && <img src={boardRoom} alt="entry" /> }
          {area.areaName==="Store" && <img src={Store} alt="entry" /> }
          {area.areaName==="EExit" && <img src={EmergencyExit} alt="entry" /> }
            
          
        </div>
      )}
      {area && area.isAvailable === 0  && area.d===0 && (
        <div
          className="display-static-area"
          style={{
            color: "black",
          }}
        >
          {area.areaName}
        </div>
      )}
      
      
    </>
  );
};

export default DisplayStaticArea;
