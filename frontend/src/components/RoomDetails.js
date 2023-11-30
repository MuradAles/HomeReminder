import React from "react";
import { useEffect } from "react";

function RoomDetails({ selectedRoom }) {
  //   useEffect(() => {
  //     console.log(
  //       "RoomDetails useEffect triggered with selectedRoom:",
  //       selectedRoom
  //     );
  //   }, [selectedRoom]);

  //   if (!selectedRoom) {
  //     return <div>Please select a room.</div>;
  //   }

  return (
    <div key={selectedRoom._id}>
      <h3>Room: {selectedRoom.roomName}</h3>
      <h4>Items:</h4>
      {selectedRoom.itemsList ? (
        <ul>
          {selectedRoom.itemsList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <div> No items available</div>
      )}
    </div>
  );
}

export default RoomDetails;
