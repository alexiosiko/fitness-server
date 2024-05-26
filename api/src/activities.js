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
exports.getTodayDate = void 0;
const Day_1 = require("../lib/Day");
const express = require("express");
const router = express.Router();
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = req.db.collection('users');
        let { userId, activity, selectedDate } = req.body;
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
            // create day and add activity to array
            const newDay = {
                activities: [activity],
                date: selectedDate
            };
            // Add to user
            user.days.push(newDay);
        }
        else {
            // If the day is found, add the activity to the day's activities
            foundDay.activities.push(activity);
        }
        // Update user
        const result = yield collection.updateOne({ userId }, { $set: { days: user.days } });
        res.status(200).send({ message: "Activity added successfully" });
    }
    catch (error) {
        console.error("Error adding activity:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}));
router.post('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userId, activity, selectedDate } = req.body;
        const collection = req.db.collection('users');
        // Normalize the date to 'YYYY-MM-DD'
        if (!selectedDate)
            return res.status(404).send({ message: "SelectedDate not found" });
        selectedDate = (0, Day_1.normalizeDateString)(selectedDate);
        // Find the user
        const user = yield collection.findOne({ userId });
        if (!user)
            return res.status(404).send({ message: "User not found" });
        if (!activity)
            return res.status(500).send({ message: "Activity is empty" });
        // Find the specific day in the user's days
        const foundDay = user.days.find(day => (0, Day_1.isSameDay)(day.date, selectedDate));
        if (!foundDay)
            return res.status(404).send({ message: "Day not found. Wtf?" });
        // Find the activity in the day's activities
        const foundActivityIndex = foundDay.activities.findIndex((iteratedActivity) => iteratedActivity.name === activity.name && iteratedActivity.calories === activity.calories);
        if (foundActivityIndex === -1)
            return res.status(404).send({ message: "Activity not found" });
        // Remove the activity from the day's activities
        foundDay.activities.splice(foundActivityIndex, 1);
        // Update the user document in the database
        yield collection.updateOne({ userId }, { $set: { days: user.days } });
        res.status(200).send({ message: "Activity deleted successfully" });
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
}));
router.put('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = req.db.collection('users');
        const { activity, userId, selectedDate, activityIndex } = req.body;
        const user = yield collection.findOne({ userId: userId });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        // Find the day in the days that matches the target date
        const foundDay = user.days.find(day => {
            return (0, Day_1.isSameDay)(day.date, selectedDate);
        });
        if (!foundDay)
            return res.status(404).send({ message: "Date not found in user's days" });
        // Update the activity at the specified index
        foundDay.activities[activityIndex] = activity;
        // Save the updated user document back to the database
        yield collection.updateOne({ userId: userId }, { $set: { days: user.days } });
        return res.send({ message: "Activity updated successfully" });
    }
    catch (e) {
        return res.send({ message: "Error updating activity" }).status(500);
    }
}));
function getTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}
exports.getTodayDate = getTodayDate;
module.exports = router;
