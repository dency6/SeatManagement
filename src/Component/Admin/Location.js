import { useState,useEffect } from "react";

const Location = (props) => {
    const [location, setLocation] = useState(null)
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(true);
    useEffect(() => {
      const header = "Bearer " + sessionStorage.getItem("accessToken");
      fetch(`http://localhost:8081/api/location/`, {
        headers: {
          "Content-type": "application/json",
          Authorization: header,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          setLocation(data);
          setIsPending(false);
        })
        .catch((error) => {
          setError(error);
        });
    }, []);
    
    return (
      <>
        {error && <span>{error}</span>}
        <select
          className="drop-select"
          name="select"
          style={{width:'90%'}}
          id="select"
          value={props.locationId}
            onChange={(e) => props.setLocationId(e.target.value)}
        >
          <option value="none" selected disabled hidden>
            Select a Location
          </option>
          {isPending && <span>Loading Location</span>}
          {location &&
            location.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
        </select>
      </>
    );
  };
  
 
export default Location;