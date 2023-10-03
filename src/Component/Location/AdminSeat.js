import { useState, useEffect } from "react";
import {
  MdEdit,
  MdDelete,
  MdAdd,
  MdOutlineArrowDownward,
  MdOutlineArrowUpward,
} from "react-icons/md";
import { BsSaveFill } from "react-icons/bs";

import AddSeatPopUp from "./AddSeatPopUp";

const AdminSeat = ({ location, row, col, refresh }) => {
  const [seat, setSeat] = useState(null);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("accessToken");
  const [name, setName] = useState(null);
  const [editName, setEditName] = useState("");
  const [addPopUp, setAddPopUp] = useState(false);
  const [editPopUp, setEditPopUp] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    fetch(
      `http://localhost:8081/api/seat/position?location=${location.id}&row=${row}&column=${col}`,
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
        setSeat(data);
        setName(data.seatName);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [flag, refresh]);

  const handleAdd = () => {
    
    const seata = {
      row: row,
      col: col,
      locationId: location.id,
      name: name,
      dir: 1,
    };
    
    fetch(`http://localhost:8081/api/seat/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(seata),
      
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setAddPopUp(false);
        setSeat(seata);
        setFlag(!flag);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleDelete = () => {
    fetch(`http://localhost:8081/api/seat/${seat.seatId}/${false}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(seat),
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

  const handleEdit = (e) => {
    const seatb = {
      row: row,
      col: col,
      locationId: location.id,
      name: editName,
      dir: seat.seatDirection,
    };
    fetch(`http://localhost:8081/api/seat/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(seatb),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setEditPopUp(false);
        setSeat(seatb);
        setFlag(!flag);
      })
      .catch((error) => {
       
        setError(error.message);
      });
  };

  const handleChangeDirection = () => {
    fetch(`http://localhost:8081/api/seat/changeDirection/${seat.seatId}`, {
      method: "PUT",
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
        setFlag(!flag);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <>
      <>
        {seat && seat.isAvailable !== 0 && (
          <div className="seatDiv">
            <div>
              {seat.seatDirection === 0 && (
                <MdOutlineArrowUpward
                  size={"20px"}
                  onClick={() => handleChangeDirection()}
                />
              )}
              {seat.seatDirection === 1 && (
                <MdOutlineArrowDownward
                  size={"20px"}
                  onClick={() => handleChangeDirection()}
                />
              )}
              <MdEdit
                size={"20px"}
                onClick={() => {
                  setEditPopUp(true);
                  setEditName(name);
                }}
              />
              <MdDelete size={"20px"} onClick={() => setDeletePopUp(true)} />
            </div>
            <p>{name}</p>
          </div>
        )}
        {seat && seat.isAvailable === 0 && (
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

        {addPopUp && (
          <div className="popup">
            <h3>Add new Seat</h3>
            <table>
              <tr>
                <td>Seat Name: </td>
                <td>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
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
      </>
    </>
  );
};

export default AdminSeat;
