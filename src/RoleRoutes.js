import { Outlet, Navigate } from "react-router-dom";
const checkAdmin = () => {
  let role = sessionStorage.getItem("userRole");
  console.log(role);
  if (role === "ADMIN") {
    return true;
  } else {
    return false;
  }
};
const RoleRoutes = () => {
  const isAdmin = checkAdmin();
  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default RoleRoutes;
