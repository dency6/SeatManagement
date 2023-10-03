import { useState, useRef } from "react";
import { excelToJson } from "./ExcelToJson";

const LocationForm = (props) => {
  const [name, setName] = useState(null);
  const [seatingCapacity, setSeatingCapacity] = useState(null);
  const [address, setAddress] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState("");
  const fileInput = useRef(null);

  const convertToBase64 = (e) => {
    console.log(e.target.files);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log(reader.result);
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  const token = "Bearer " + sessionStorage.getItem("accessToken");

  const handleSubmit = (e) => {
    e.preventDefault();
    const location = { name, seatingCapacity, address, image };
    console.log(location);
    setIsPending(true);
    fetch("http://localhost:8081/api/location/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: token,
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
        props.setflag(!props.flag);
      })
      .catch((error) => {
        setIsPending(false);
        setError(error.message);
      });
  };
  const filePathset = (e) => {
    console.log(e.target.files[0].name);
  };

  return (
    <div className="row-card">
      <div className="row-card-title">
        <h2>Add New Location</h2>
      </div>
      <div className="row-card-body">
        <div className="location-container">
          <form className="location-form" onSubmit={handleSubmit}>
            <div className="location-item">
              <label for="location">Location</label>
              <input
                type="text"
                id="location"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                required
              />
            </div>
            <div className="location-item">
              <label for="location">Seating Capacity</label>
              <input
                type="number"
                id="seatingcapacity"
                value={seatingCapacity}
                onChange={(e) => {
                  setSeatingCapacity(e.target.value);
                }}
                required
              />
            </div>
            <div className="location-item">
              <label for="location">Excel Sheet for Seats</label>
              <div id="excel-sheet">
                <input
                  type="file"
                  id="file"
                  ref={fileInput}
                  name="file"
                  onChange={filePathset}
                />
                <button onClick={() => excelToJson(fileInput.current.files[0])}>
                  Fetch Seats
                </button>
              </div>
            </div>
            <div className="location-item">
              <label for="image">Layout</label>
              <input
                accept="image/"
                type="file"
                onChange={(e) => convertToBase64(e)}
                required
              />
            </div>

            <div className="location-item">
              {!isPending && (
                <button className="button-group">Add Location</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
