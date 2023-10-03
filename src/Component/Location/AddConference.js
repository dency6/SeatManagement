import React, { useState } from "react";
import "./location.css";
function AddConference({ }) {
  const [roomName, setRoomName] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");

  return (
    <div className="conference">
      <form>
        <label>
          Room Name:
        </label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        <label>
          Seating Capacity:
        </label>
          <input
            type="number"
            value={seatingCapacity}
            onChange={(e) => setSeatingCapacity(e.target.value)}
          />
          <button type="submit">Add Room</button>
          <button type="button">Cancel</button>
      </form>
    </div>
  );
}

export default AddConference;
