import logo from "../../Static/logo.jpg";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import book from "../../Static/book.jpg";
const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    /* global google */
    const onGoogleScriptLoad = () => {
      google.accounts.id.initialize({
        client_id:
          "946965422673-l41tegruelb9vqb1q6iqrpaf0ha7vnvh.apps.googleusercontent.com",
        callback: handleLoginApi,
      });
      google.accounts.id.renderButton(document.getElementById("LoginButton"), {
        theme: "outline",
        size: "large",
        type: "standard",
      });
    };
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = onGoogleScriptLoad;
    document.body.appendChild(script);
  }, []);

  const handleLoginApi = (response) => {
    console.log(response.credential);
    fetch(`http://localhost:8081/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: response.credential }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.message);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.length !== 0) {
          sessionStorage.setItem("email", data.email);
          sessionStorage.setItem("accessToken", data.accessToken);
          console.log("accessToken", data.accessToken);
          sessionStorage.setItem("userId", data.id);
          sessionStorage.setItem("userFirstName", data.firstName);
          sessionStorage.setItem("userLastName", data.lastName);
          sessionStorage.setItem("userRole", data.role);
          sessionStorage.setItem("accoliteId", data.accoliteId);
        }
        if (data.location !== null) {
          sessionStorage.setItem("userLocationId", data.location.id);
          sessionStorage.setItem("userLocation", JSON.stringify(data.location));
        }
        if (data.location === null) {
          sessionStorage.setItem("userLocation", null);
          navigate("/profile", true);
        } else {
          navigate("/", true);
        }
      })
      .catch((error) => {
        setError(error.message);
        console.log(error.message);
      });
  };

  return (
    <>
      <div className="container-login">
        <div className="header">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="login-button">
            <div id="LoginButton"></div>
          </div>
        </div>
        <div className="girlbook">
          <div>
            <h1>BMS</h1>
            <h3>Book seats now!</h3>
          </div>
          <div>
            <img className="book" src={book} alt="book" />
          </div>
        </div>
        {/* <span style={{fontSize:'10px',color:'black'}}>Devloped by Aman,Dency,Viswateza,Nireeksha</span> */}
      </div>
    </>
  );
};

export default Login;
