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
        itemsList = req.body.itemsList
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
        let room;
        try {
            room = await roomsData.createRoom(houseId, roomName, itemsList)
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
        let room;
        try {
            room = await roomsData.getRoom(roomId)
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
        let rooms = [];
        try {
            rooms = await roomsData.getAllRooms(houseId)
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
        let room;
        try {
            room = await roomsData.deleteRoom(houseId, roomId);
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
        let updatedRoom;
        try {
            updatedRoom = await roomsData.changeRoomName(roomId, oldRoomName, newRoomName);
            res.status(200).json({ updatedRoom });
        } catch (e) {
            res.status(400).json({ error: e });
        }
    });

module.exports = router