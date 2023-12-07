import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import Button from "react-bootstrap/esm/Button";
import { NavLink, useParams } from "react-router-dom";
import RoomDetails from "./RoomDetails";
import IconPlus from "../resources/IconPlus";
import IconTrash from "../resources/IconTrash";

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
  const [houseName, setHouseName] = useState("");

  const { homeId } = useParams();

  useEffect(() => {
    async function setRoomsView() {
      console.log("house1", homeId);
      setRoomsLoading(true);
      setRoomsError("");
      const endpoint = `http://localhost:4000/rooms/getAll`;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ houseId: homeId }),
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

      // fetch housename
      try {
        console.log("house", homeId);
        const houseResponse = await fetch(`http://localhost:4000/houses/get`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ houseId: homeId }),
        });

        const houseData = await houseResponse.json();
        console.log("housedata", houseData);

        if (houseData.error) {
          console.error("Error fetching house details", houseData.error);
          setRoomsLoading(false);
          setRoomsError("Error fetching house details");
          return;
        }
        setHouseName(houseData.houseName);
      } catch (error) {
        console.error("Error fetching house details", error);
        setRoomsLoading(false);
        setRoomsError("Error fetching house details");
      }
    }

    setRoomsView();
  }, [roomAdded, homeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateRoomLoading(true);
    setCreateRoomError("");

    const endpoint = "http://localhost:4000/rooms/create";
    const roomInfo = {
      houseId: homeId,
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
        setCreateRoomName("");
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

  const handleDeleteRoom = async (roomId) => {
    setCreateRoomLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/rooms/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          houseId: homeId,
          roomId: roomId,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setRoomsError(data.error);
        setCreateRoomLoading(false);
        return;
      }

      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
      setCreateRoomLoading(false);
    } catch (error) {
      console.error("Error deleting room:", error);
      setCreateRoomLoading(false);
      setRoomsError("Error deleting room");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div style={{ margin: 8, borderBottom: "1px solid #ccc" }}>
        <h2 style={{ fontSize: "48px", margin: 24, marginLeft: 30 }}>
          {houseName}
        </h2>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
        }}
      >
        <div
          style={{
            flex: 1,
            position: "relative",
            borderRight: "1px solid #ccc",
          }}
        >
          <form
            style={{ display: "flex", alignItems: "center", width: "100%" }}
          >
            <div
              style={{
                position: "relative",
                margin: "8px auto",
                maxWidth: "600px",
                width: "80%",
              }}
            >
              <input
                value={createRoomName}
                onChange={handleAddRoom}
                style={{
                  borderRadius: "24px",
                  padding: "8px",
                  width: "100%",
                  border: "2px solid #4973C2",
                }}
                placeholder="Add your rooms here"
              />
              <div
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={handleSubmit}
              >
                <button style={{ border: "none", background: "none" }}>
                  {createRoomLoading ? (
                    <div className="spinner-border text-light" role="status" />
                  ) : (
                    <IconPlus width={24} height={24} />
                  )}
                </button>
              </div>
            </div>
          </form>
          {roomsError && <div className="errorText">{roomsError}</div>}
          {roomsLoading && (
            <div className="spinner-border text-light" role="status" />
          )}
          {rooms &&
            !roomsLoading &&
            rooms.map((room) => (
              <div
                style={{
                  position: "relative",
                  margin: "8px auto",
                  maxWidth: "600px",
                  width: "80%",
                }}
                key={room._id}
              >
                <button
                  style={{
                    borderRadius: "24px",
                    padding: "8px",
                    width: "100%",
                    border: "2px solid #4973C2",
                    backgroundColor: "white",
                  }}
                  key={room._id}
                  onClick={() => handleRoomClick(room)}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#B8C8E8")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  {room.roomName}
                </button>
                <div
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDeleteRoom(room._id)}
                >
                  {createRoomLoading ? (
                    <div className="spinner-border text-light" role="status" />
                  ) : (
                    <IconTrash width={24} height={24} />
                  )}
                </div>
              </div>
            ))}
        </div>
        {selectedRoom && (
          <div style={{ flex: 3 }}>
            <RoomDetails
              selectedRoom={selectedRoom}
              updateSelectedRoom={setSelectedRoom}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeView;
