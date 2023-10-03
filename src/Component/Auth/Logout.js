import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Logout = () => {
    const navigate=useNavigate();
    useEffect(()=>{
        sessionStorage.clear();
    navigate("/",true)
    })
    return ( <>
    Logged Out
    </> );
}
 
export default Logout;