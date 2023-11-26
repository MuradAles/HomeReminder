const mongoCollections = require('../config/mongoCollections');
const houses = mongoCollections.houses;
const rooms = mongoCollections.rooms;
const { ObjectId } = require('mongodb');
const validation = require('../validation');


const createRoom = async (houseId, roomName, stringOfItems) => {
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
    let listOfItems
    try {
        listOfItems = stringOfItems
            .split(', ')
            .map(item => item.trim());
    } catch (e) {

    }
    const roomsDataCollection = await rooms();
    let roomsNameDuplication = await roomsDataCollection.findOne({ "houseId": houseId, "roomName": roomName });
    if (roomsNameDuplication !== null) throw 'Room name already exists';
    let newRoom = {
        houseId: houseId,
        roomName: roomName,
        itemsList: listOfItems
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
    const oneRoom = await roomsDataCollection.findOne({ _id: objectId });
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
const addItemToRoom = async () => {

}
const deleteItemFromRoom = async () => {
}
const changeNameOfItem = async () => {
}

module.exports = { createRoom, getRoom, getAllRooms, deleteRoom, changeRoomName }
