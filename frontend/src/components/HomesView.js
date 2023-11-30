import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthContext';
import Button from 'react-bootstrap/esm/Button';
import { NavLink } from 'react-router-dom';

function HomesView() {
  const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
  const [createHouseName, setCreateHouseName] = useState("");
  const [housesError, setHousesError] = useState(""); //houses from getAll
  const [housesLoading, setHousesLoading] = useState(false);
  const [houses, setHouses] = useState([]);
  const [createHouseLoading, setCreateHouseLoading] = useState(false);
  const [createHouseError, setCreateHouseError] = useState("");
  const [houseAdded, setHouseAdded] = useState(false);


  useEffect(() => {
    async function setHousesView() {
      setHousesLoading(true);
      setHousesError(false);
      const endpoint = `http://localhost:4000/houses/getAll`
      const userInfo = {
        userId: authUser.id
      }
      let setHousesResponse
      let setHousesData
      try {
        setHousesResponse = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(userInfo)
        });
        setHousesData = await setHousesResponse.json();

        if (setHousesData.error) {
          setHousesError(setHousesData.error);
          setHousesLoading(false);
          return;
        }
        console.log(setHousesData);
        setHouses(setHousesData);
        setHouseAdded(false);
        setHousesLoading(false);
      
      } catch (e) {
        console.log("Please make sure you are running MongoDB");
        setHousesLoading(false);
        setHousesError("Please make sure you are running MongoDB");
        return;
      }
    }

    setHousesView();
  }, [houseAdded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateHouseLoading(true);
    setCreateHouseError("");
    const endpoint = `http://localhost:4000/houses/create`
    const houseInfo = {
      userId: authUser.id,
      houseName: createHouseName
    }
    let createHouseResponse
    let createHouseData
    try {
        createHouseResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(houseInfo)
      });
      createHouseData = await createHouseResponse.json();

      if (createHouseData.error) {
        setCreateHouseError(createHouseData.error);
        setCreateHouseLoading(false);
        return;
      }
      console.log(createHouseData);
      setTimeout(() => {
        setHouseAdded(true);
        setCreateHouseLoading(false);
      }, 1000)

      
    } catch (e) {
      console.log("Please make sure you are running MongoDB");
      setCreateHouseLoading(false);
      setCreateHouseError("Please make sure you are running MongoDB");
      return;
    }
  }

  const handleHomeNameChange = (e) => {
    setCreateHouseName(e.target.value);
  }
  
  return (
    <div>
        My Homes
        <form>
          <label>Add your homes here!</label>
          <input value={createHouseName} onChange={handleHomeNameChange} placeholder='Home Name'/>
          <Button type="submit" onClick={handleSubmit} id="navButton" variant="custom">
            {createHouseLoading ? <div className="spinner-border text-light" role="status"/> : "Create House"}
          </Button>
        </form>

        <div>
          {housesError && <div className='errorText'>{housesError}</div>}
          {housesLoading && <div className="spinner-border text-light" role="status"/>}
          {houses && !housesLoading && houses.map((house) => (
            <Button id="navButton" variant="custom">
              <NavLink className="navLink" to={`/homes/${house._id}`}>{house.houseName}</NavLink>
            </Button> 
          ))}
        </div>
    </div>
  )
}

export default HomesView
