import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthContext';
import Button from 'react-bootstrap/esm/Button';
import { NavLink } from 'react-router-dom';
import IconPlus from '../resources/IconPlus';
import IconEdit from '../resources/IconEdit';
import IconTrash from '../resources/IconTrash';

function HomesView() {
  const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
  const [createHouseName, setCreateHouseName] = useState("");
  const [housesError, setHousesError] = useState(""); //houses from getAll
  const [housesLoading, setHousesLoading] = useState(false);
  const [houses, setHouses] = useState([]);
  const [createHouseLoading, setCreateHouseLoading] = useState(false);
  const [createHouseError, setCreateHouseError] = useState("");
  const [houseAdded, setHouseAdded] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState("");
  const [modelShow, setModelShow] = useState(false);
  const [newHomeName, setNewHomeName] = useState("");
  const [houseEdit, setHouseEdit] = useState("");
  const [oldHouseName, setOldHouseName] = useState("");
  let oldHomeName = ""
  let housedeletion = "";
  let houseToEdit = ""

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

  const handleHomeNameChange = async (e) => {
    setCreateHouseName(e.target.value);
  }

  const deleteHouse = async (e) => {
    setCreateHouseLoading(true);
    setCreateHouseError("");
    const endpoint = `http://localhost:4000/houses/delete`
    const houseInfo = {
      userId: authUser.id,
      houseId: housedeletion
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

  const editHouse = async (e) => {
    e.preventDefault();
    setCreateHouseLoading(true);
    setCreateHouseError("");
    const endpoint = `http://localhost:4000/houses/change`
    const houseInfo = {
      oldHouseName: oldHouseName,
      houseId: houseEdit,
      newHouseName: newHomeName
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

  const handleNewNameChange = (e) => {
    setNewHomeName(e.target.value);
  }
  
  return (
    <div className='housesViewWrapper'>
      <div className='housesViewComponents'>
        <h1>My Homes</h1>
      </div>
      <hr/>

      {!modelShow && <div className='housesViewComponentSpecial'>
        <form>
        <div className='buttonIn'>
          <label htmlFor='createHouseInput'/>
          <input id="createHouseInput" name="createHouseInput" value={createHouseName} onChange={handleHomeNameChange} placeholder='Add your homes here'/>
          
            <button aria-label="createHouse" type="submit" onClick={handleSubmit} >
              {createHouseLoading ? <div className="spinner-border text" role="status"/> : <IconPlus/>}
            </button>
          </div>
        </form>
      </div> }

      { modelShow && (
        <div className='housesViewComponentSpecial'>
          <form>
          <div className='buttonIn'>
            <label htmlFor='editHouseInput'/>
            <input id="editHouseInput" value={newHomeName} onChange={handleNewNameChange} placeholder='Enter new house name here'/>
            <button aria-label='editHouse' onClick={editHouse} >
              {createHouseLoading ? <div className="spinner-border text" role="status"/> : <IconEdit/>}
            </button>
          </div>
          <div className='exitEdit'>
            <Button variant='custom' onClick={() => setModelShow(false)}>Click here to exit editing</Button>
          </div>
          </form>
        </div>
      )}

      <div className='housesViewComponents'>
        {housesError && <div className='errorText'>{housesError}</div>}
        {housesLoading && <div className="spinner-border text" role="status"/>}
        {houses && !housesLoading && houses.map((house) => (
          <div key={house._id} className='housesViewHouses'>
            <button className='housesViewHousesButton'>
              <NavLink className="navLink2" to={`/homes/${house._id}`}>{house.houseName}</NavLink>
            </button> 
            <div>
              <button aria-label='editHouse' className='buttonStack1' onClick={() => {
                houseToEdit = house._id
                oldHomeName = house.houseName
                setModelShow(true)
                setHouseEdit(house._id)
                setOldHouseName(house.houseName)
                }}><IconEdit/></button>
              <button aria-label='deleteHouse' className='buttonStack2' onClick={() => {
                housedeletion = house._id
                deleteHouse()
              }}><IconTrash/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomesView
