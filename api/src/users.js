"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
// router.post('/delete', async (req, res) => {
// 	const body = req.body;
// 	const userId = body.userId;
// 	console.log(`Deleting userId ${userId}...`);
// 	const result = await req.db.collection('users').deleteOne({ userId: userId})
// 	if (result.deletedCount === 0) {
//         res.send({ message: "User not found or already deleted" }).status(201);
// 		return;
// 	}
// 	res.send({ message: "User deleted :D" });
// })
router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const userId = body.data.id;
    if (userId == null)
        return res.status(422).send({ message: "Bad userId param" });
    const user = {
        userId: body.data.id,
        calendar: [{
                activities: [],
                date: new Date()
            }],
        dailyCalorieTarget: 2000,
    };
    const userExists = yield req.db.collection('users').findOne(user);
    if (userExists) {
        res.send({ message: "User already exists :D" });
        return;
    }
    const result = yield req.db.collection('users').insertOne(user);
    if (result.insertedCount === 0) {
        res.send({ message: "Couldn't create user :(" }).status(500);
        return;
    }
    res.send({ message: "Created user :D" });
}));
router.put('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const userId = body.userId;
    const params = body.params;
    const collection = yield req.db.collection('users');
    if (params == null) {
        return res.status(400).send({ message: "Params is null" });
    }
    const userExists = yield collection.findOne({ userId: userId });
    if (!userExists) {
        return res.status(404).send({ message: "User not found" });
    }
    // Update the user with the provided params
    const result = yield collection.updateOne({ userId: userId }, // Filter criteria
    { $set: params } // Updated data
    );
    if (result.modifiedCount === 0)
        return res.status(500).send({ message: "Found user, but nothing to update" });
    return res.send({ message: "User updated successfully" });
}));
router.put('/update-calorie-target', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, dailyCalorieTarget } = req.body;
    console.log(userId);
    if (!userId || !dailyCalorieTarget) {
        return res.status(400).send('userId and dailyCalorieTarget are required');
    }
    const collection = req.db.collection('users');
    try {
        const result = yield collection.updateOne({ userId: userId }, // assuming userId is the document identifier
        { $set: { dailyCalorieTarget: dailyCalorieTarget } });
        console.log(result);
        if (result.matchedCount === 0) {
            return res.status(404).send({ message: 'User not found' });
        }
        return res.status(200).send({ message: 'Daily Calorie Target updated successfully' });
    }
    catch (error) {
        console.error('Error updating dailyCalorieTarget:', error);
        return res.status(500).send('Internal Server Error');
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    console.log(`Getting user ${userId}`);
    const user = yield req.db.collection('users').findOne({ userId: userId });
    if (!user) {
        return res.send({ message: "Could not fetch user :(" }).status(500);
    }
    return res.send({ user: JSON.stringify(user) }); // Deep serialize
}));
module.exports = router;
