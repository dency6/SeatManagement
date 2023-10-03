import { useEffect, useState } from "react";

const RoomBookings = (props) => {
    const token = "Bearer " + sessionStorage.getItem("accessToken");
    const email=sessionStorage.getItem("email");
    const [acceptedRequest, setAcceptedRequest] = useState(null);
    const[data,setData]=useState(null)
    const yearMonthDay = new Date();
  const currentDate = yearMonthDay.toISOString().substr(0, 10);
    useEffect(()=>{
        fetch(`http://localhost:8081/api/bookRoom/admin/${email}`, {
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
    }).then((res)=>{
        if(!res.ok){
            throw Error("failed")
        }
        return res.json()
    }).then((data)=>{
        setData(data)
        console.log(data)

    })
    },[acceptedRequest,props.flag])
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
        const year = date.getFullYear().toString();
        return `${day}-${month}-${year}`;
      }
    return ( <>
    {data && data.map((booking)=>{
        if(booking.date>=currentDate){
            return(
                <tr className="user-row" key={booking.id}  > 
                    <td style={{fontSize:'12px'}}>{booking.user.accoliteId}</td>
                    <td style={{fontSize:'12px'}}>{formatDate(booking.date)}</td>
                    <td style={{fontSize:'12px'}}>{booking.fromTime.substring(0,5)} - {booking.toTime.substring(0,5)}</td>
                    <td style={{fontSize:'10px'}} >{booking.room.roomType}</td>
                    <td style={{fontSize:'12px'}}>{booking.room.name}</td>
                </tr>
            )
        }
        
    })}
    </> );
}
 
export default RoomBookings;