import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import Button from "react-bootstrap/esm/Button";
import { NavLink, useParams } from "react-router-dom";
import RoomDetails from "./RoomDetails";

function HomeView({ match }) {
  const { authUser } = useAuth();
  const [roomsError, setRoomsError] = useState("");
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [createRoomName, setCreateRoomName] = useState("");
  const [createRoomLoading, setCreateRoomLoading] = useState(false);
  const [createRoomError, setCreateRoomError] = useState("");
  const [roomAdded, setRoomAdded] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const { houseId } = useParams();

  useEffect(() => {
    async function setRoomsView() {
      setRoomsLoading(true);
      setRoomsError("");
      const endpoint = `http://localhost:4000/rooms/getAll`;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ houseId }),
        });

        const data = await response.json();

        if (data.error) {
          setRoomsError(data.error);
          setRoomsLoading(false);
          return;
        }

        setRooms(data);
        setRoomAdded(false);
        setRoomsLoading(false);
      } catch (error) {
        console.log("Error fetching rooms", error);
        setRoomsLoading(false);
        setRoomsError("Error fetching rooms");
      }
    }

    setRoomsView();
  }, [roomAdded, houseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateRoomLoading(true);
    setCreateRoomError("");

    const endpoint = "http://localhost:4000/rooms/create";
    const roomInfo = {
      houseId: houseId,
      roomName: createRoomName,
      furnitureList: {},
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomInfo),
      });

      const data = await response.json();

      if (data.error) {
        setCreateRoomError(data.error);
        setCreateRoomLoading(false);
        return;
      }

      console.log(data);
      setTimeout(() => {
        setRoomAdded(true);
        setCreateRoomLoading(false);
      }, 1000);
    } catch (error) {
      console.log("Error creating room:", error);
      setCreateRoomLoading(false);
      setCreateRoomError("Error creating room");
    }
  };

  const handleAddRoom = (e) => {
    setCreateRoomName(e.target.value);
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div>
      <h2>HouseName</h2>
      <form>
        <label>Add your rooms here</label>
        <input value={createRoomName} onChange={handleAddRoom} />
        <Button type="submit" onClick={handleSubmit}>
          {createRoomLoading ? (
            <div className="spinner-border text-light" role="status" />
          ) : (
            "Create Room"
          )}
        </Button>
      </form>

      <div>
        {roomsError && <div className="errorText">{roomsError}</div>}
        {roomsLoading && (
          <div className="spinner-border text-light" role="status" />
        )}
        {rooms &&
          !roomsLoading &&
          rooms.map((room) => (
            <div key={room._id}>
              <Button key={room._id} onClick={() => handleRoomClick(room)}>
                {/* <NavLink className="navLink" to={`/rooms/${room._id}`}> */}
                {room.roomName}
                {/* </NavLink> */}
              </Button>
            </div>
          ))}

        {selectedRoom && (
          <RoomDetails
            selectedRoom={selectedRoom}
            updateSelectedRoom={setSelectedRoom}
          />
        )}
      </div>
    </div>
  );
}

export default HomeView;
