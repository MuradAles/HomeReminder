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
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    console.log("useEffect triggered");
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
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [selectedRoom, newFurnitureName]);

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
  return (
    <div key={selectedRoom._id}>
      <h3>Room: {selectedRoom.roomName}</h3>
      <input
        type="text"
        placeholder="Furniture Name"
        value={newFurnitureName}
        onChange={(e) => setNewFurnitureName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Furniture Items"
        value={newFurnitureItem}
        onChange={(e) => setNewFurnitureItem(e.target.value)}
      />
      <Button type="submit" onClick={handleAddFurniture}>
        Add Furniture
      </Button>
      <h4>Furnitures:</h4>
      {roomData && roomData.furnitureList ? (
        <ul>
          {Object.entries(roomData.furnitureList).map(
            ([furnitureName, furnitureItem], index) => (
              <FurnitureDetails
                key={index}
                furnitureName={furnitureName}
                furnitureItem={furnitureItem}
              />
            )
          )}
        </ul>
      ) : (
        <div> No furniture available</div>
      )}
    </div>
  );
}

export default RoomDetails;
