import Login from "./Component/Auth/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import "./App.css";
import Navbar from "./Component/NavBar/Navbar";
import Home from "./Component/Home/Home";
import Location from "./Component/Location/Location";
import Logout from "./Component/Auth/Logout";
import Profile from "./Component/Profile/Profile";
import RoleRoutes from "./RoleRoutes";
import Admin from "./Component/Admin/Admin";
import Attendance from "./Component/Attendance/Attendance";
function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route
              element={
                <>
                  <Navbar />
                  <PrivateRoutes />
                </>
              }
            >
              <Route exact path="/" element={<Home />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route element={<RoleRoutes />}>
                <Route exact path="/location" element={<Location />} />
                <Route exact path="/admin" element={<Admin />} />
                <Route exact path="/attendance" element={<Attendance />} />
              </Route>
            </Route>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/logout" element={<Logout />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
