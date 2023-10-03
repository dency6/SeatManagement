import { useState, useEffect } from "react";
import {
  MdEdit,
  MdDelete,
  MdAdd,
  MdOutlineArrowDownward,
  MdOutlineArrowUpward,
} from "react-icons/md";
const Entrance = ({ location, row, col, dir, refresh }) => {
  const [staticArea, setStaticArea] = useState(null);
  const [sArea, setSArea] = useState(null);
  const token = sessionStorage.getItem("accessToken");
  const [name, setName] = useState("");
  const [editName, setEditName] = useState("");
  const [addPopUp, setAddPopUp] = useState(false);
  const [error, setError] = useState(null);
  const [flag, setFlag] = useState(true);

    const [editPopUp, setEditPopUp] = useState(false);
    const [deletePopUp, setDeletePopUp] = useState(false);
  useEffect(() => {
    fetch(
      `http://localhost:8081/api/locationStaticArea/position?location=${location.id}&row=${row}&column=${col}&dir=${dir}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setStaticArea(data);
        setName(data.areaName);
      })
      .catch((error) => {
        setError(error.message);
      });
      console.log(staticArea)
  }, [flag, refresh]);

  const handleEdit = (e) => {
    const areaB = {
      row: row,
      col: col,
      d:dir,
      locationId: location.id,
      name: editName,
    };
    fetch(`http://localhost:8081/api/locationStaticArea/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(areaB),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data)
        setEditPopUp(false);
        setSArea(areaB);
        setFlag(!flag);
      })
      .catch((error) => {
       
        setError(error.message);
      });
  };
  const handleAdd = () => {
    const area = {
      row: row,
      col: col,
      d:dir,
      locationId: location.id,
      name: name,
    };

    fetch(`http://localhost:8081/api/locationStaticArea/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(area),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setAddPopUp(false);
        setSArea(area);
        setFlag(!flag);
      });
  };
  const handleDelete = () => {
    fetch(`http://localhost:8081/api/locationStaticArea/${staticArea.areaId}/${false}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(staticArea),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setDeletePopUp(false);
        setFlag(!flag);
      })
      .catch((error) => {
       
        setError(error.message);
      });
  };
  return (
    <>
      {dir===1 && staticArea && staticArea.isAvailable !== 0  && staticArea.d===1 &&  (
        <div className="seatDiv">
          <div>
            <MdEdit size={"20px"} onClick={() => {
                  setEditPopUp(true);
                  setEditName(name);
                }} />
            <MdDelete size={"20px"}  onClick={() => setDeletePopUp(true)}/>
          </div>
          <small>{name}</small>
        </div>
      )}
      {dir===1 && staticArea && staticArea.isAvailable === 0 && staticArea.d===0 && (
        <>
          <div className="seatDiv">
            <div className="addBtn">
              <MdAdd
                size={"20px"}
                onClick={() => {
                  setAddPopUp(true);
                }}
              />
            </div>
          </div>
        </>
      )}
      {dir===2 && staticArea && staticArea.isAvailable !== 0 && staticArea.d===2 &&  (
        <div className="seatDiv">
          <div>
            <MdEdit size={"20px"} onClick={() => {
                  setEditPopUp(true);
                  setEditName(name);
                }} />
            <MdDelete size={"20px"}  onClick={() => setDeletePopUp(true)}/>
          </div>
          <small>{name}</small>
        </div>
      )}
      {dir===2 && staticArea && staticArea.isAvailable === 0 && staticArea.d===0 && (
        <>
          <div className="seatDiv">
            <div className="addBtn">
              <MdAdd
                size={"20px"}
                onClick={() => {
                  setAddPopUp(true);
                }}
              />
            </div>
          </div>
        </>
      )}
      {dir===3 && staticArea && staticArea.isAvailable !== 0 && staticArea.d===3 &&  (
        <div className="seatDiv">
          <div>
            <MdEdit size={"20px"} onClick={() => {
                  setEditPopUp(true);
                  setEditName(name);
                }} />
            <MdDelete size={"20px"}  onClick={() => setDeletePopUp(true)}/>
          </div>
          <small>{name}</small>
        </div>
      )}
      {dir===3 && staticArea && staticArea.isAvailable === 0 && staticArea.d===0 && (
        <>
          <div className="seatDiv">
            <div className="addBtn">
              <MdAdd
                size={"20px"}
                onClick={() => {
                  setAddPopUp(true);
                }}
              />
            </div>
          </div>
        </>
      )}
      {dir===4 && staticArea && staticArea.isAvailable !== 0 && staticArea.d===4 &&  (
        <div className="seatDiv">
          <div>
            <MdEdit size={"20px"} onClick={() => {
                  setEditPopUp(true);
                  setEditName(name);
                }} />
            <MdDelete size={"20px"}  onClick={() => setDeletePopUp(true)}/>
          </div>
          <small>{name}</small>
        </div>
      )}
      {dir===4 && staticArea && staticArea.isAvailable === 0 && staticArea.d===0 && (
        <>
          <div className="seatDiv">
            <div className="addBtn">
              <MdAdd
                size={"20px"}
                onClick={() => {
                  setAddPopUp(true);
                }}
              />
            </div>
          </div>
        </>
      )}
      {deletePopUp && (
          <div className="popup">
            <h3>Are you sure you want to delete seat {name} ?</h3>
            <table>
              <tr>
              <td>
                  <button
                  className="button-group"
                    onClick={() => {
                      handleDelete();
                    }}
                  >
                    Yes
                  </button>
                </td>
                <td>
                  <button
                  className="button-group"
                    
                    onClick={() => {
                      setDeletePopUp(false);
                    }}
                  >
                    No
                  </button>
                </td>
                
              </tr>
            </table>
          </div>
        )}
      {addPopUp && (
        <div className="popup">
          <h3>Add Static Area</h3>
          <table>
            <tr>
              <td>Name: </td>
              <td>
              <select
                  name="select"
                  id="select"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                >
                  <option value="" disabled>Select an Area</option>
                  <option value={"Entry"}>
                      Entry
                    </option>
                    <option value={"WashRoom"}>
                      WashRoom
                    </option>
                    <option value={"Pantry"}>
                      Pantry
                    </option>
                    <option value={"Room"}>
                      Board/Confrence Room
                    </option>
                    <option value={"EExit"}>
                      Emergency Exit
                    </option>
                    <option value={"Store"}>
                      Store Room
                    </option>
                    <option value={"Exit"}>
                      Exit
                    </option>
                    </select>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  className="button-group"
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    setAddPopUp(false);
                  }}
                >
                  Cancel
                </button>
              </td>
              <td>
                <button
                  className="button-group"
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => handleAdd()}
                >
                  Add
                </button>
              </td>
            </tr>
          </table>
        </div>
      )}
      {editPopUp && (
          <div className="popup">
            <p>Edit Seat Name</p>
            <table style={{marginBottom:'20px'}}>
              <tr >
                <td >
                  New Name: </td>
                <td>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </td>
              </tr >
              <tr>
                <td>
                  <button
                  className="button-group"
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                    onClick={() => {
                      setEditPopUp(false);
                    }}
                  >
                    Cancel
                  </button>
                </td>
                <td>
                  <button
                  className="button-group"
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => {
                      handleEdit();
                    }}
                  >
                    Save
                  </button>
                </td>
              </tr>
            </table>
          </div>
        )}
    </>
  );
};

export default Entrance;
