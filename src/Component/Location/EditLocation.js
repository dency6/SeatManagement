import { useEffect, useState } from "react";
const EditLocation = ({locations,...props}) => {
  const [locationData, setLocationData] = useState([]);
  const [name, setName] = useState(null);
  const [seatingCapacity, setSeatingCapacity] = useState(null);
  const [address, setAddress] = useState(null);
  const [layout, setLayout] = useState(null);
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("accessToken");
  const convertToBase64 = (e) => {
    console.log(e.target.files);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log(reader.result);
      setLayout(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };
  useEffect(() => {
    setIsPending(true);
    fetch(`http://localhost:8081/api/location/${props.location}`, {
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
        setLocationData(data);
        setIsPending(false);
        // window.location.reload();
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [locations]);
  useEffect(() => {
    if (locationData) {
      setName(locationData.name || null);
      setSeatingCapacity(locationData.seatingCapacity || null);
      setAddress(locationData.address || null);
      setLayout(locationData.image || null);
    }
  }, [locationData]);
  const handleEdit = (e) => {
    e.preventDefault();
    if (seatingCapacity >= locationData.seatingCapacity) {
      const newlocation = { name, seatingCapacity, address};
      console.log(newlocation)
      fetch(`http://localhost:8081/api/location/${props.location}`, {
        method: "PUT",
        headers: { "Content-type": "application/json",Authorization: "Bearer " + token, },
        body: JSON.stringify(newlocation),
      }).then(() => {
        props.setIsOpenEdit(false);
        // window.location.reload();
      });
    } else {
      setMessage("Cannot Decrease The Seat");
    }
  };
  return (
    <>
      {!isPending && (
        <div
          className="popupContainer"
          onClick={() => {
            props.setIsOpenEdit(false);
          }}
        >
          <div  id="pop-edit" className="popup-boxd" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <h2>Edit Location</h2>
              {message && <span>{message}</span>}
            </div>
            <div className="location-container">
              <form className="location-form-popup" style={{marginTop:'-80px',width:'100%'}}>
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
                  <label for="location">Addresss</label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
                </div>

                <div className="location-item">
                  <label for="image">Layout</label>
                  <input
                    accept="image/"
                    type="file"
                    onChange={(e) => convertToBase64(e)}
                  />
                  <br />
                </div>
                <div className="location-item">
                  {!isPending && (
                    <button className="button-group" onClick={handleEdit}>
                      Edit Location
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditLocation;
