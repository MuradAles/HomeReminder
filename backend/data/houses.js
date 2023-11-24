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

    const insertedHouseId = newInsertInformation.insertedId; // Get the inserted house ID

    const usersDataCollection = await users();
    const updateResult = await usersDataCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { housesID: insertedHouseId.toString() } }
    );

    if (updateResult.modifiedCount === 0) {
        throw new Error('Failed to update user with the new house');
    }

    return {
        newHouse
    };
}
const getHouse = async (houseId) => {
}
const changeHouseName = async (userId, houseId, oldHouseName, newHouseName) => {
    try {
        //check user id
        userId = userId
    } catch (e) {
        throw e
    }
    try {
        //check house id
        houseId = houseId
    } catch (e) {
        throw e
    }
    try {
        //check new House Name
        newHouseName = newHouseName
    } catch (e) {
        throw e
    }
    //check if new HouseName not similar to oldHouseName
    if (newHouseName === oldHouseName) throw "House Name already exists"
    //find house by userId and houseId

    //check if newHouseName different from OldHouseName

    //return userId with HouseId and newHouseId
}
const deleteHouse = async (userId, houseId) => { }

module.exports = { createHouse, changeHouseName }
