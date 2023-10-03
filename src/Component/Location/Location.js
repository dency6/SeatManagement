import LocationForm from "./LocationForm";
import LocationLayout from "./LocationLayout";
import LocationList from "./LocationList";
import { useState, useEffect } from "react";
import AddConference from "./AddConference";

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);
  const [conferences, setConferences] = useState([]);
  const [isPending, setIsPending] = useState(null);
  const [flag, setFlag] = useState(true);
  const token = sessionStorage.getItem("accessToken");
  const [openAddLocPopup,setAddLocPopup]=useState(false)
  const [name,setName]=useState("")

  
  useEffect((e) => {
    fetch("http://localhost:8081/api/location/", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleLocationChange = (event) => {
    const locationId = parseInt(event.target.value);
    const selectedLocation = locations.find(
      (location) => location.id === locationId
    );
    setFlag(!flag);
    setSelectedLocation(selectedLocation);
  };

  const addLocation = (event) => {
    event.preventDefault();
    const name = prompt("Enter location name:");
    if (!name) return;
    const location = { name };
    setIsPending(true);
    fetch("http://localhost:8081/api/location/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(location),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setIsPending(false);
        setLocations([...locations, data]);
        setSelectedLocation(data);
      })
      .catch((error) => {
        setIsPending(false);
        setError(error.message);
      });
  };

  return (
    <>
    <div className="container">
      <div className="container-content">
        <div className="row-card" style={{ padding: "5px" }}>
          <div className="locationList">
            <form className="loc-select-form">
              <div className="loc">
                <select
                  name="select"
                  id="select"
                  value={selectedLocation?.id || ""}
                  onChange={handleLocationChange}
                >
                  <option value="">Select a location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button
                  className="button-group"
                  onClick={addLocation}
                  disabled={isPending}
                >
                  Add New Location
                </button>
              </div>
            </form>
          </div>
          {selectedLocation && <LocationLayout location={selectedLocation} flag={flag} />}{" "}
        </div>
      </div>
      {/* {openAddLocPopup && (
        <div
          className="popupContainer"
          onClick={() => setAddLocPopup(false)}
        >
          <div className="popup-boxd" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <h2>Enter Location name</h2>
            </div>
            <div>
              <form onSubmit={addLocation}>
                <input type="text" name="location" value={name} onChange={(e)=>setName(e.target.value)} required/>
                <button className="button-group"> Add New Location</button>
              </form>
                
              
            </div>
          </div>
        </div>
      )} */}
      /</div>
    </>
  );
};

export default Location;
