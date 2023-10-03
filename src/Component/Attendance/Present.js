import { useState,useEffect } from "react";

const Present = ({date}) => {
    const[data,setData]=useState(null);
    useEffect(() => {
        const header = "Bearer " + sessionStorage.getItem("accessToken");
        const userId = sessionStorage.getItem("userId");
        fetch(`http://localhost:8081/api/booking/date?date=${date}`, {
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
            setData(data);
            console.log(data)
          })
          
      }, [date]);
    return ( <>
         <table className="header-booking">
          <tbody className="header-booking">
            {data && data.map((attandance) => {
                  if (attandance.present === true) {
                    return (
                      <tr className="header-booking">
                        <td>{attandance.accoliteId}</td>
                        <td>{attandance.seat.name}</td>
                        <td>{attandance.fromTime}</td>
                        <td>{attandance.toTime}</td>
                      </tr>
                    );
                  } else {
                    return null;
                  }
                })}
          </tbody>
        </table>
    </> );
}
 
export default Present;