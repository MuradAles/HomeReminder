const express = require('express');
const router = express.Router();
const data = require('../data');
const roomsData = data.rooms
const validation = require('../validation');


router
    .route('/create')
    .post(async (req, res) => {
        houseId = req.body.houseId
        roomName = req.body.roomName
        // check validaiton
        try {
            houseId = houseId
        } catch (e) {
            res.status(400).json({ error2: e });
            return;
        }
        try {
            roomName = roomName
        } catch (e) {
            res.status(400).json({ error2: e });
            return;
        }
        //create house 
        try {
            const room = await roomsData.createRoom(houseId, roomName)
            res.status(200).json({
                room
            })
        } catch (e) {
            res.status(400).json({ error3: e });
            return;
        }
    })

router
    .route('/get')
    .post(async (req, res) => {
        const roomId = req.body.roomId
        try {
            const room = await roomsData.getRoom(roomId)
            res.status(200).json(room);
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }
    })

router
    .route('/getAll')
    .post(async (req, res) => {
        const houseId = req.body.houseId
        try {
            const rooms = await roomsData.getAllRooms(houseId)
            res.status(200).json(rooms);
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }
    })

router
    .route('/delete')
    .post(async (req, res) => {
        const houseId = req.body.houseId
        const roomId = req.body.roomId
        try {
            const room = await roomsData.deleteRoom(houseId, roomId);
            res.status(200).json({ deleteRoom: room });
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }
    })

router
    .route('/change')
    .post(async (req, res) => {
        const { roomId, oldRoomName, newRoomName } = req.body;
        try {
            const updatedRoom = await roomsData.changeRoomName(roomId, oldRoomName, newRoomName);
            res.status(200).json({ updatedRoom });
        } catch (e) {
            res.status(400).json({ error: e });
        }
    });

router
    .route('/addFurnitureToRoom')
    .post(async (req, res) => {
        const { roomId, furnitureName, itemName } = req.body
        try {
            const newFurniture = await roomsData.addFurnitureToRoom(roomId, furnitureName, itemName)
            res.status(200).json({ newFurniture });
        } catch (e) {
            res.status(400).json({ error: e });
        }
    });

router
    .route('/deleteFurnitureFromRoom')
    .post(async (req, res) => {
        const { roomId, furnitureName } = req.body
        try {
            const deleteFurniture = await roomsData.deleteFurnitureFromRoom(roomId, furnitureName)
            res.status(200).json({ deleteFurniture });
        } catch (e) {
            res.status(400).json({ error: e });
        }
    });

router
    .route('/changeNameOfFurniture')
    .post(async (req, res) => {
        const { roomId, furnitureNewName, furnitureOldName } = req.body
        try {
            const changeFurniture = await roomsData.changeNameOfFurnitureInRoom(roomId, furnitureNewName, furnitureOldName)
            res.status(200).json({ changeFurniture });
        } catch (e) {
            res.status(400).json({ error: e });
        }
    });


router
    .route('/addItemToFurniture')
    .post(async (req, res) => {
        const { roomId, furnitureName, itemName } = req.body
        try {
            const addItem = await roomsData.addItemsToFurniture(roomId, furnitureName, itemName)
            res.status(200).json({ addItem });
        } catch (e) {
            res.status(400).json({ error: e });
        }
    });
router
    .route('/changeNameOfItemInFurniture')
    .post(async (req, res) => {
        const { roomId, furnitureName, itemNewName, itemOldName } = req.body
        try {
            const changeFurniture = await roomsData.changeNameOfItemInFurniture(roomId, furnitureName, itemNewName, itemOldName)
            res.status(200).json({ changeFurniture });
        } catch (e) {
            res.status(400).json({ error: e });
        }
    });
router
    .route('/deleteItemFromFurniture')
    .post(async (req, res) => {
        const { roomId, furnitureName, itemName } = req.body
        try {
            const deleteFurniture = await roomsData.deleteItemFromFurniture(roomId, furnitureName, itemName)
            res.status(200).json({ deleteFurniture });
        } catch (e) {
            res.status(400).json({ error: e });
        }
    });

module.exports = router