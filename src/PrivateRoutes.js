import { Outlet, Navigate } from "react-router-dom";

const checkToken = () => {
  let token = sessionStorage.getItem("accessToken");
  return token ? true : false;
};
const checkLocation=()=>{
  let location=sessionStorage.getItem("userLocation")
  if(location===null){
    return false
  }
  return true
}
const PrivateRoutes = () => {
  const hasLocation=checkLocation();
  console.log(hasLocation)
  const isAuthenticated = checkToken();
  if(!isAuthenticated){
    return <Navigate to="/login"/>;
  }
  else if(isAuthenticated && (hasLocation===false)){
    return <Navigate to="/profile"/>;

  }
  else{
    return <Outlet />;

  }
   
};

export default PrivateRoutes;
