import React from "react";

function FurnitureDetails({ furnitureName, furnitureItem }) {
  return (
    <div>
      <li>
        {furnitureName} : {furnitureItem}
      </li>
    </div>
  );
}

export default FurnitureDetails;
