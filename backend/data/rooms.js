const mongoCollections = require('../config/mongoCollections');
const houses = mongoCollections.houses;
const rooms = mongoCollections.rooms;
const { ObjectId } = require('mongodb');
const validation = require('../validation');


const createRoom = async (houseId, roomName) => {
    try {
        // check if userId exists
        houseId = houseId
    } catch (e) {
        throw e
    }
    try {
        //check user house name for validation
        roomName = roomName
    } catch (e) {
        throw e
    }
    const roomsDataCollection = await rooms();
    let roomsNameDuplication = await roomsDataCollection.findOne({ "houseId": houseId, "roomName": roomName });
    if (roomsNameDuplication !== null) throw 'Room name already exists';
    let newRoom = {
        houseId: houseId,
        roomName: roomName,
        furnitureList: {}
    };
    const newInsertInformation = await roomsDataCollection.insertOne(newRoom);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    const insertedHouseId = newInsertInformation.insertedId;
    const housesDataCollection = await houses();
    const updateResult = await housesDataCollection.updateOne(
        { _id: new ObjectId(houseId) },
        { $addToSet: { roomsId: insertedHouseId.toString() } }
    );
    if (updateResult.modifiedCount === 0) throw new Error('Failed to update house with the new room');
    return getAllRooms(houseId)
}
const getRoom = async (roomId) => {
    const roomsDataCollection = await rooms();
    const objectId = new ObjectId(roomId);
    let oneRoom
    try {
        oneRoom = await roomsDataCollection.findOne({ _id: objectId });
    } catch (e) {
        throw e
    }
    if (oneRoom === null) throw 'No Room found';
    return oneRoom
}
const getAllRooms = async (houseId) => {
    const roomsDataCollection = await rooms();
    const allRooms = await roomsDataCollection
        .find({ houseId: houseId })
        .toArray();
    if (allRooms.length === 0) return [];
    return allRooms
}
const deleteRoom = async (houseId, roomId) => {
    const roomsDataCollection = await rooms();
    const housesDataCollection = await houses();
    const Obj_roomId = new ObjectId(roomId);
    const Obj_houseId = new ObjectId(houseId);
    const Room = await roomsDataCollection
        .deleteOne({ _id: Obj_roomId, "houseId": houseId });
    if (Room.deletedCount === 0) throw `Could not delete Room`;
    const house = await housesDataCollection.updateOne(
        { _id: Obj_houseId },
        { $pull: { roomsId: roomId } }
    );
    if (house.modifiedCount === 0) {
        throw `Could not delete from rooms's houseID array`;
    }
    return getAllRooms(houseId);
}
const changeRoomName = async (roomId, oldRoomName, newRoomName) => {
    // Check if new HouseName is similar to oldHouseName
    if (newRoomName === oldRoomName) throw "New house name should be different from the old one.";
    // Find house by houseId and oldHouseName
    const roomsDataCollection = await rooms();
    const objectId = new ObjectId(roomId);
    // Update the house name
    const updatedRoom = await roomsDataCollection.findOneAndUpdate(
        { _id: objectId, roomName: oldRoomName },
        { $set: { roomName: newRoomName } },
        { returnOriginal: false }
    );
    return getRoom(roomId)
};

const addFurnitureToRoom = async (roomId, furnitureName, items) => {
    const objectId = new ObjectId(roomId);
    const roomsDataCollection = await rooms();
    let room
    try {
        room = await getRoom(roomId);
    } catch (e) {
        throw e
    }
    if (room.furnitureList && room.furnitureList[furnitureName]) throw 'Furniture with the same name already exists';

    const itemsArray = items.split(',').map(item => item.trim());

    const updateQuery = {
        $set: { [`furnitureList.${furnitureName}`]: itemsArray }
    };
    const updateResult = await roomsDataCollection.updateOne(
        { _id: objectId },
        updateQuery
    );
    if (updateResult.modifiedCount === 0) throw 'Failed to update room with the new furniture';
    return await getRoom(roomId);
};
const changeNameOfFurnitureInRoom = async (roomId, furnitureNewName, furnitureOldName) => {
    const roomsDataCollection = await rooms();
    const objectId = new ObjectId(roomId);
    const room = await getRoom(roomId);
    if (!room.furnitureList || !room.furnitureList[furnitureOldName]) throw 'Furniture to rename does not exist in the room'
    if (room.furnitureList[furnitureNewName]) throw 'Furniture with the new name already exists'
    const updatedFurnitureList = { ...room.furnitureList };
    updatedFurnitureList[furnitureNewName] = updatedFurnitureList[furnitureOldName];
    delete updatedFurnitureList[furnitureOldName];
    const updateQuery = {
        $set: { furnitureList: updatedFurnitureList }
    };
    const updateResult = await roomsDataCollection.updateOne(
        { _id: objectId },
        updateQuery
    );
    if (updateResult.modifiedCount === 0) throw 'Failed to change furniture name in the room'
    return getRoom(roomId);
};
const deleteFurnitureFromRoom = async (roomId, furnitureName) => {
    const roomsDataCollection = await rooms();
    const objectId = new ObjectId(roomId);
    const room = await getRoom(roomId);
    if (!room.furnitureList || !room.furnitureList[furnitureName]) throw 'Furniture to delete does not exist in the room'
    const updatedFurnitureList = { ...room.furnitureList };
    delete updatedFurnitureList[furnitureName];
    const updateQuery = {
        $set: { furnitureList: updatedFurnitureList }
    };
    const updateResult = await roomsDataCollection.updateOne(
        { _id: objectId },
        updateQuery
    );
    if (updateResult.modifiedCount === 0) throw 'Failed to delete furniture from the room'
    return getRoom(roomId);
};



const addItemsToFurniture = async (roomId, furnitureName, itemName) => {
    const roomsDataCollection = await rooms();
    const objectId = new ObjectId(roomId);
    const room = await getRoom(roomId);

    if (!room.furnitureList || !room.furnitureList[furnitureName]) throw 'Furniture does not exist in the room';
    const updatedFurniture = { ...room.furnitureList };
    if (!Array.isArray(updatedFurniture[furnitureName])) {
        updatedFurniture[furnitureName] = [];
    }
    updatedFurniture[furnitureName].push(itemName);
    const updateQuery = {
        $set: { [`furnitureList.${furnitureName}`]: updatedFurniture[furnitureName] }
    };
    const updateResult = await roomsDataCollection.updateOne(
        { _id: objectId },
        updateQuery
    );
    if (updateResult.modifiedCount === 0) throw 'Failed to add item to the furniture';


    return getRoom(roomId);
};
const changeNameOfItemInFurniture = async (roomId, furnitureName, itemNewName, itemOldName) => {
    const roomsDataCollection = await rooms();
    const objectId = new ObjectId(roomId);
    const room = await getRoom(roomId);
    if (!room.furnitureList || !room.furnitureList[furnitureName]) throw 'Furniture does not exist in the room'
    const furniture = room.furnitureList[furnitureName];
    let itemUpdated = false;
    const updatedFurniture = furniture.map(item => {
        if (!itemUpdated && item === itemOldName) {
            itemUpdated = true;
            return itemNewName;
        }
        return item;
    });
    const updateQuery = {
        $set: { [`furnitureList.${furnitureName}`]: updatedFurniture }
    };
    const updateResult = await roomsDataCollection.updateOne(
        { _id: objectId },
        updateQuery
    );
    if (updateResult.modifiedCount === 0) throw 'Failed to change item name in the furniture'
    return getRoom(roomId);
};
const deleteItemFromFurniture = async (roomId, furnitureName, itemName) => {
    const roomsDataCollection = await rooms();
    const objectId = new ObjectId(roomId);
    const room = await getRoom(roomId);
    if (!room.furnitureList || !room.furnitureList[furnitureName]) throw 'Furniture does not exist in the room';
    const furniture = room.furnitureList[furnitureName];
    let itemDeleted = false;
    const updatedFurniture = furniture.filter(item => {
        if (!itemDeleted && item === itemName) {
            itemDeleted = true;
            return false;
        }
        return true;
    });
    const updateQuery = {
        $set: { [`furnitureList.${furnitureName}`]: updatedFurniture }
    };
    const updateResult = await roomsDataCollection.updateOne(
        { _id: objectId },
        updateQuery
    );
    if (updateResult.modifiedCount === 0) throw 'Failed to delete item from the furniture';
    return getRoom(roomId);
};


module.exports = {
    createRoom,
    getRoom,
    getAllRooms,
    deleteRoom,
    changeRoomName,

    addFurnitureToRoom,
    changeNameOfFurnitureInRoom,
    deleteFurnitureFromRoom,

    addItemsToFurniture,
    changeNameOfItemInFurniture,
    deleteItemFromFurniture
}
