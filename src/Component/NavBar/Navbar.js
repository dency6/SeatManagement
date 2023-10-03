import { Link } from "react-router-dom";
import accLogo from "../../Static/newlogo.png";
import { CgChevronDoubleDownO } from "react-icons/cg";
import { MdOutlineLocalLibrary } from "react-icons/md";
import Bell from "../../Static/bell.png"
import NotiBell from "../../Static/notifications.png";
import Notification from "./Notification";

import { useState } from "react";

const Navbar = () => {
  const[flag,setFlag]=useState(false)
  const [activeTab, setActiveTab] = useState("");

  const role = sessionStorage.getItem("userRole");
  const userName =
    sessionStorage.getItem("userFirstName") +
    " " +
    sessionStorage.getItem("userLastName");

  return (
    <>
      <nav className="navbar">
        <div className="navbar-wrapper">
          <ul
            className="inner-navbar"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <li className="navbar-header-logo">
              <img src={accLogo} alt="" className="acc-logo" />
            </li>
            <li className="nav-item">
              <Link
                to="/"
                onClick={() => setActiveTab("home")}
                className={activeTab === "home" ? "active-tab" : ""}
              >
                <span className="span-text">
                  <MdOutlineLocalLibrary /> Seat Booking Application{" "}
                </span>
              </Link>
            </li>
            {role && role === "ADMIN" && (
              <>
                <li className="nav-item">
                  <Link to="/location" className="nav-link">
                    <span className="span-logo"></span>
                    <span className="span-text">Location</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin" className="nav-link">
                    <span className="span-logo"></span>
                    <span className="span-text">Admin</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/attendance" className="nav-link">
                    <span className="span-logo"></span>
                    <span className="span-text">Attendance</span>
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <div className="nav-link">
                <div className="dropdown">
                  <div className="dropbtn">
                    
                    <span className="span-text">
                      {flag && <img src={NotiBell} alt="bell" style={{height:'30px'}}/>}
                      {!flag && <img src={Bell} alt="bell" style={{height:'30px'}}/>}
                      </span>
                    <div className="dropdown-content">
                      <Notification setFlag={setFlag} />
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <div className="dropdown">
                <div className="dropbtn">
                  <span className="span-text">
                    {userName} <CgChevronDoubleDownO />
                  </span>
                </div>
                <div className="dropdown-content">
                  <Link to="/profile">Profile</Link>
                  <Link to="/logout">Logout</Link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
