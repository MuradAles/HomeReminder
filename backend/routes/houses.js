const express = require('express');
const router = express.Router();
const data = require('../data');
const housesData = data.houses;
const validation = require('../validation');


router
    .route('/create')
    .post(async (req, res) => {
        userId = req.body._id
        houseName = req.body.houseName
        // check validaiton
        try {
            userId = userId
        } catch (e) {
            res.status(400).json({ error2: e });
            return;
        }
        try {
            houseName = houseName
        } catch (e) {
            res.status(400).json({ error2: e });
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
            res.status(400).json({ error3: e });
            return;
        }
    })
router
    .route('/change')
    .put(async (req, res) => {
        return
    })
router
    .route('/delete')
    .delete(async (req, res) => {
        return
    })

module.exports = router