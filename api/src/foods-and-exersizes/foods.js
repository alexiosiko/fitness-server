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
const Day_1 = require("../../lib/Day");
const express = require("express");
const router = express.Router();
router.put('/insert', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = req.db.collection('users');
        let { userId, food, selectedDate } = req.body;
        selectedDate = (0, Day_1.normalizeDateString)(selectedDate);
        // Retrieve user data
        const user = yield collection.findOne({ userId });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        // Find if day exists in user
        let foundDay = user.days.find(day => {
            return (0, Day_1.isSameDay)(day.date, selectedDate);
        });
        if (!foundDay) {
            // If day doesnt not exists in array,
            // create day and add action to array
            const newDay = {
                foods: [food],
                exersizes: [],
                date: selectedDate
            };
            // Add to user
            user.days.push(newDay);
        }
        else {
            // If the day is found, add the food to the day's foods
            foundDay.foods.push(food);
        }
        // Update user
        const result = yield collection.updateOne({ userId }, { $set: { days: user.days } });
        res.status(200).send({ message: "Action added successfully" });
    }
    catch (error) {
        console.error("Error adding action:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}));
module.exports = router;
