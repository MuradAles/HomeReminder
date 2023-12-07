import React from "react";
import IconTrash from "../resources/IconTrash";

function FurnitureDetails({ furnitureName, furnitureItem, onDelete }) {
  return (
    <div
      style={{
        border: "2px solid #ddd",
        borderColor: "#4973C2",
        borderRadius: "16px",
        padding: "8px",
        marginBottom: "10px",
        width: "90%",
        backgroundColor: "#FAFAF5",
        textAlign: "left",
        margin: "20px auto",
        position: "relative",
      }}
    >
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginLeft: "5px" }}>
        {furnitureName}
      </h2>

      <ul>
        {furnitureItem.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <div
        style={{
          position: "absolute",
          right: "8px",
          top: "20px",
          transform: "translateY(-50%)",
          cursor: "pointer",
        }}
        onClick={() => onDelete(furnitureName)}
      >
        <IconTrash width={24} height={24} />
      </div>
    </div>
  );
}

export default FurnitureDetails;
