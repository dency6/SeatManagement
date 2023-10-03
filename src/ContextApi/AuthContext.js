import React, { useState } from "react"
const AuthContext=React.createContext();
export const Auth=(props)=>{
    const [isAuthenticated,setIsAuthenticated]=useState(false);
    const [userid,setUserid]=useState("");
    const [accoliteId,setAccoliteId]=useState("");
    const [firstname,setFirstname]=useState("");
    const [lastname,setLastname]=useState("");
    const [usermail,setUsermail]=useState("");
    const [userrole,setUserrole]=useState("");
    const [accessToken,setAccessToken]=useState([]);
    const [token,setToken]=useState("");
    const updateuserid=(e)=>setUserid(e);
    const updatefirstname=(e)=>setFirstname(e);
    const updatelastname=(e)=>setLastname(e)
    const updateAccoliteId=(e)=>setAccoliteId(e)
    const updateusermail=(e)=>setUsermail(e);
    const updateuserrole=(e)=>setUserrole(e);
    const updateaccessToken=(e)=>setAccessToken(e);
    const updatetoken=(e)=>setToken(e);
    const handleLogin=()=>{
            setIsAuthenticated(true);
    }
    const handleLogout=()=>{
        setIsAuthenticated(false);
        setUserid("");
        setAccoliteId("");
        setFirstname("");
        setLastname("");
        setUsermail("");
        setUserrole("");
        setAccessToken("");
        setToken("");
    }
    return (
        <AuthContext.Provider
        value={{
          isAuthenticated,
          firstname,
          lastname,
          accoliteId,
          userid,
          usermail,
          userrole,
          accessToken,
          token,
          setToken,
          handleLogout,
          handleLogin,
          updateuserid,
          updatefirstname,
          updatelastname,
          updateAccoliteId,
          updateusermail,
          updateuserrole,
          updateaccessToken,
          updatetoken,
          setUserrole
        }}
      >
        {props.children}
      </AuthContext.Provider>
    );
}
export default AuthContext;
