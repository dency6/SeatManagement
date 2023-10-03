import { useEffect, useState } from "react";

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [isOpenCon, setIsOpenCon] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [flag, setFlag] = useState(false);
  const token = "Bearer " + sessionStorage.getItem("accessToken");
  const [role, setRole] = useState("");
  const handlePopup = (e) => {
    setUserEmail(e.email);
    setRole(e.role);
    setIsOpenCon(true);
  };

  useEffect(() => {
    setIsPending(true);
    fetch(`http://localhost:8081/api/user/`, {
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("connot fetch the data");
        }
        return res.json();
      })
      .then((data) => {
        setAllUsers(data);
        setIsPending(false);
      });
  }, [flag]);

  const handleUpdate = () => {
    fetch(`http://localhost:8081/api/user/role/${userEmail}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ value: role }),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("connot fetch the data");
        }
        return res;
      })
      .then((data) => {
        setFlag(!flag);
        setIsOpenCon(false);
      });
  };
  return (
    <>
      {allUsers &&
        allUsers.map((user) => {
          return (
            <tr
              className="user-row"
              style={{ textAlign: "left", marginRight: "2 0px" }}
            >
              <td style={{ width: "70%", fontSize: "15px" }}>
                {user.email?.substring(0, 45)}
              </td>
              <td style={{ textAlign: "center" }}>
                <button
                  className="button-group"
                  value={user}
                  onClick={() => handlePopup(user)}
                >
                  {user.role}
                </button>
              </td>
            </tr>
          );
        })}
      {isOpenCon && (
        <div className="popupContainer" onClick={() => setIsOpenCon(false)}>
          <div className="popup-boxd" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <h2>Change Role</h2>
            </div>
            <div>
              <div class="dropdown-role">
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
                >
                  <object value={role} aria-disabled>
                    {role}
                  </object>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
            <div className="buttonsContainer">
              <button
                type="submit"
                className="submit-btn"
                onClick={() => {
                  handleUpdate();
                }}
              >
                Submit
              </button>
              <button
                type="reset"
                className="cancel-btn"
                onClick={() => setIsOpenCon(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllUsers;
