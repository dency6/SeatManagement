import { useEffect, useState } from "react";
import BaseUrl from "../Api/Baseurl";
const Notification = ({setFlag}) => {
    const email=sessionStorage.getItem("email")
        const token=sessionStorage.getItem("accessToken")
    const[notification,setNotification]=useState([])
    const[f,setF]=useState(true)
    const markRead=(id)=>{
        fetch(`http://localhost:8081/api/notification/markAsRead/${id}`,{
            method:"PUT",
            headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + token,
              },
        }).then((res)=>{
            if(!res.ok){
                throw new Error(res.statusText);
            }
            return res;
        }).then((data)=>{
            setF(!f)
        })
        
    }
    useEffect(()=>{
        
        fetch(`http://localhost:8081/api/notification/pending/email/${email}`,{
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + token,
            },
          })
          .then((res)=>{
            if(!res.ok){
                throw new Error(res.statusText);
            }
            return res.json();
          }).then((data)=>{
            if(data.length!==0){

                setFlag(true)
            }
            setNotification(data)
          })
    },[f])
    
    return ( <>
    <div className="notification-cards">
        {
            notification && notification.map((n)=>
            
            <div className="notification-card" key={n.id} onClick={()=>{markRead(n.id)}}><p>{n.message}</p></div>
            )
        }
                       
                        
                      </div></> );
}
 
export default Notification;