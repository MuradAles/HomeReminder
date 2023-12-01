import React from "react";

function FurnitureDetails({ furnitureName, furnitureItem }) {
  return (
    <div>
      <li>
        {furnitureName}
        <ul>
          {furnitureItem.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </li>
    </div>
  );
}

export default FurnitureDetails;
