const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const validation = require('../validation');
const bcrypt = require('bcryptjs');
const saltRounds = 6;

const createUser = async (name, email, password) => {
    try {
        name = name
    } catch (e) {
        throw e
    }
    try {
        email = validation.validateEmail(email)
    } catch (e) {
        throw e
    }
    try {
        password = validation.validatePassword(password)
    } catch (e) {
        throw e
    }
    password = await bcrypt.hash(password, saltRounds);
    const usersDataCollection = await users();
    let usernameDuplication = await usersDataCollection.findOne({ "email": email });
    if (usernameDuplication !== null) throw 'Email already exists';
    let newUser = {
        name: name,
        email: email,
        password: password,
        housesID: []
    };
    const newInsertInformation = await usersDataCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    return {
        name: name,
        email: email,
        housesID: []
    };
}

const checkUser = async (email, password) => {
    try {
        email = validation.validateEmail(email);
    } catch (e) {
        throw e
    }
    try {
        password = validation.validatePassword(password);
    } catch (e) {
        throw e
    }
    const usersDataCollection = await users();
    let userData = await usersDataCollection.findOne({ "email": email });
    if (userData === null) throw 'Either the email or password is invalid';
    let passwordCheck = await bcrypt.compare(password, userData.password);
    if (passwordCheck === false) throw 'Either the email or password is invalid';
    return { id: userData._id, email: userData.email }
}

module.exports = { createUser, checkUser }
