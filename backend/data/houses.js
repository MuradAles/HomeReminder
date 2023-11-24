const mongoCollections = require('../config/mongoCollections');
const houses = mongoCollections.houses;
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const validation = require('../validation');


const createHouse = async (userId, houseName) => {
    try {
        // check if userId exists
        userId = userId
    } catch (e) {
        throw e
    }
    try {
        //check user house name for validation
        houseName = houseName
    } catch (e) {
        throw e
    }
    const housesDataCollection = await houses();
    let houseNameDuplication = await housesDataCollection.findOne({ "userId": userId, "houseName": houseName });
    if (houseNameDuplication !== null) throw 'House Name already exists';
    let newHouse = {
        userId: userId,
        houseName: houseName,
        roomsId: []
    };
    const newInsertInformation = await housesDataCollection.insertOne(newHouse);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    const insertedHouseId = newInsertInformation.insertedId;
    const usersDataCollection = await users();
    const updateResult = await usersDataCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { housesID: insertedHouseId.toString() } }
    );
    if (updateResult.modifiedCount === 0) throw new Error('Failed to update user with the new house');
    return {
        newHouse
    };
}
const getHouse = async (houseId) => {
    const housesDataCollection = await houses();
    const objectId = new ObjectId(houseId);
    const oneHouse = await housesDataCollection.findOne({ _id: objectId });
    if (oneHouse === null) throw 'No House found';
    return oneHouse
}
const getAllHouses = async (userId) => {
    const housesDataCollection = await houses();
    const allHouses = await housesDataCollection
        .find({ userId: userId })
        .toArray();
    if (allHouses.length === 0) return [];
    return allHouses
}
const deleteHouse = async (userId, houseId) => {
    const usersDataCollection = await users();
    const housesDataCollection = await houses();
    const Obj_userId = new ObjectId(userId);
    const Obj_houseId = new ObjectId(houseId);
    const House = await housesDataCollection
        .deleteOne({ _id: Obj_houseId, "userId": userId });
    if (House.deletedCount === 0) throw `Could not delete House`;
    const user = await usersDataCollection.updateOne(
        { _id: Obj_userId },
        { $pull: { housesID: houseId } }
    );
    if (user.modifiedCount === 0) {
        throw `Could not delete from user's houseID array`;
    }
    return getAllHouses(userId);
}
const changeHouseName = async (houseId, oldHouseName, newHouseName) => {
    // Check if new HouseName is similar to oldHouseName
    if (newHouseName === oldHouseName) throw "New house name should be different from the old one.";
    // Find house by houseId and oldHouseName
    const housesDataCollection = await houses();
    const objectId = new ObjectId(houseId);
    // Update the house name
    const updatedHouse = await housesDataCollection.findOneAndUpdate(
        { _id: objectId, houseName: oldHouseName },
        { $set: { houseName: newHouseName } },
        { returnOriginal: false }
    );
    return getHouse(houseId)
};


module.exports = { createHouse, getHouse, getAllHouses, deleteHouse, changeHouseName }
