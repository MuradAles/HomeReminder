const express = require('express');
const router = express.Router();
const data = require('../data');
const housesData = data.houses;
const validation = require('../validation');


router
    .route('/create')
    .post(async (req, res) => {
        userId = req.body.userId
        houseName = req.body.houseName
        // check validaiton
        try {
            userId = userId
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }
        try {
            houseName = houseName
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }
        //create house 
        let house;
        try {
            house = await housesData.createHouse(userId, houseName)
            res.status(200).json({
                userId: userId,
                houseName: house.houseName,
                roomsId: house.roomsId
            })
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }
    })

router
    .route('/get')
    .post(async (req, res) => {
        const houseId = req.body.houseId
        let house;
        try {
            house = await housesData.getHouse(houseId)
            res.status(200).json(house);
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }
    })

router
    .route('/getAll')
    .post(async (req, res) => {
        const userId = req.body.userId
        let houses = [];
        try {
            houses = await housesData.getAllHouses(userId)
            res.status(200).json(houses);
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }
    })

router
    .route('/delete')
    .post(async (req, res) => {
        const userId = req.body.userId
        const houseId = req.body.houseId
        let houses = [];
        try {
            houses = await housesData.deleteHouse(userId, houseId);
            res.status(200).json({ deleteHouse: houses });
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }
    })

router
    .route('/change')
    .post(async (req, res) => {
        const houseId = req.body.houseId
        const oldHouseName = req.body.oldHouseName;
        const newHouseName = req.body.newHouseName;
        let updatedHouse;
        try {
            updatedHouse = await housesData.changeHouseName(houseId, oldHouseName, newHouseName);
            res.status(200).json({ updatedHouse });
        } catch (e) {
            res.status(400).json({ error: e });
        }
    });

module.exports = router