import React, { useState } from "react";
import { useEffect } from "react";
import FurnitureDetails from "./FurnitureDetails";
import Button from "react-bootstrap/esm/Button";

function RoomDetails({ selectedRoom, updateSelectedRoom }) {
  const [newFurnitureName, setNewFurnitureName] = useState("");
  const [newFurnitureItem, setNewFurnitureItem] = useState("");
  const [createFurnitureError, setCreateFurnitureError] = useState("");
  const [createFurnitureLoading, setCreateFurnitureLoading] = useState(false);
  const [furnitureAdded, setFurnitureAdded] = useState(false);
  const [furnitureList, setFurnitureList] = useState([]);
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/rooms/get`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId: selectedRoom._id }),
        });
        const data = await response.json();
        setRoomData(data);
        setFurnitureList(data?.furnitureList || []);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [selectedRoom, roomData]);

  const handleAddFurniture = async (e) => {
    e.preventDefault();
    if (newFurnitureName && newFurnitureItem) {
      const updatedFurnitureList = { ...selectedRoom.furnitureList };

      updatedFurnitureList[newFurnitureName] = newFurnitureItem;

      updateSelectedRoom((prevSelectedRoom) => ({
        ...prevSelectedRoom,
        furnitureList: updatedFurnitureList,
      }));

      setNewFurnitureName("");
      setNewFurnitureItem("");
    } else {
      console.log("check if both furniture inputs are filled");
      return;
    }

    const endpoint = `http://localhost:4000/rooms/addFurnitureToRoom`;
    const furnitureInfo = {
      roomId: selectedRoom._id,
      furnitureName: newFurnitureName,
      itemName: newFurnitureItem,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(furnitureInfo),
      });

      const data = await response.json();
      console.log(data);

      if (data.error) {
        setCreateFurnitureError(data.error);
        setCreateFurnitureLoading(false);
        return;
      }

      setTimeout(() => {
        setFurnitureAdded(true);
        setCreateFurnitureLoading(false);
      }, 1000);
    } catch (error) {
      console.log("Error creating furniture:", error);
      setCreateFurnitureLoading(false);
      setCreateFurnitureError("Error creating furniture");
    }
  };

  const handleDeleteFurniture = async (furnitureName) => {
    const updatedFurnitureList = { ...selectedRoom.furnitureList };
    delete updatedFurnitureList[furnitureName];

    updateSelectedRoom((prevSelectedRoom) => ({
      ...prevSelectedRoom,
      furnitureList: updatedFurnitureList,
    }));

    const endpoint = `http://localhost:4000/rooms/deleteFurnitureFromRoom`;
    const furnitureInfo = {
      roomId: selectedRoom._id,
      furnitureName: furnitureName,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(furnitureInfo),
      });

      const data = await response.json();
      console.log(data);

      if (data.error) {
        // Handle error if necessary
        console.error("Error deleting furniture:", data.error);
      }
    } catch (error) {
      console.error("Error deleting furniture:", error);
    }
  };

  return (
    <div
      key={selectedRoom._id}
      style={{ marginTop: "8px", alignItems: "center", textAlign: "center" }}
    >
      <h3 style={{ fontSize: "40px", textAlign: "center" }}>
        {selectedRoom.roomName}
      </h3>

      {roomData && roomData.furnitureList ? (
        <ul>
          {Object.entries(roomData.furnitureList).map(
            ([furnitureName, furnitureItem], index) => (
              <FurnitureDetails
                key={index}
                furnitureName={furnitureName}
                furnitureItem={furnitureItem}
                onDelete={handleDeleteFurniture}
              />
            )
          )}
        </ul>
      ) : (
        <div> No furniture available</div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddFurniture();
        }}
      >
        <div
          style={{
            borderTop: "1px solid #ccc",
            marginTop: "16px",
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
          }}
        >
          <label style={{ marginLeft: "20px", fontSize: "18px" }}>
            {" "}
            Name of Furniture:
            <input
              type="text"
              placeholder="enter furniture name here"
              value={newFurnitureName}
              onChange={(e) => setNewFurnitureName(e.target.value)}
              style={{
                borderRadius: "20px",
                padding: "4px",
                width: "60%",
                border: "2px solid #4973C2",
                marginBottom: "20px",
                marginTop: "20px",
                marginBottom: "20px",
                marginLeft: "12px",
              }}
            />
          </label>

          <label style={{ marginLeft: "20px", fontSize: "18px" }}>
            {" "}
            List of things:
            <input
              type="text"
              placeholder="enter list here, separated by comma (e.g. condiments, utensils, napkins)"
              value={newFurnitureItem}
              onChange={(e) => setNewFurnitureItem(e.target.value)}
              style={{
                borderRadius: "20px",
                padding: "4px",
                width: "70%",
                border: "2px solid #4973C2",
                marginBottom: "20px",
                marginLeft: "12px",
              }}
            />
          </label>
        </div>
        <Button
          type="submit"
          onClick={handleAddFurniture}
          style={{
            width: "15%",
            borderRadius: "20px",
            padding: "6px",
            marginBottom: "16px",
            backgroundColor: "#4973C2",
            fontWeight: "bold",
          }}
        >
          Add Furniture
        </Button>
      </form>
    </div>
  );
}

export default RoomDetails;
