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
const express = require("express");
const router = express.Router();
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = req.db.collection('users');
        const { userId, activity } = req.body;
        const today = getTodayDate();
        const result = yield collection.updateOne({ userId: userId, 'calendar.date': today }, {
            $push: { 'calendar.$.activities': activity }
        });
        if (result.matchedCount === 0) {
            yield collection.updateOne({ userId: userId }, {
                $push: {
                    calendar: {
                        date: today,
                        activities: [activity]
                    }
                }
            });
        }
        res.send({ message: "Activity added successfully" });
    }
    catch (error) {
        console.error("Error adding activity:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}));
router.put('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = req.db.collection('users');
    }
    catch (e) {
        res.status(500).send({ message: "Error" });
    }
}));
router.put('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = req.db.collection('users');
        const { activity, userId, date, index } = req.body;
        // Convert the provided date to only include year, month, and day (ignore time)
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        const user = yield collection.findOne({ userId: userId });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        // Find the day in the calendar that matches the target date
        const dayIndex = user.calendar.findIndex((day) => {
            const calendarDate = new Date(day.date);
            calendarDate.setHours(0, 0, 0, 0);
            return calendarDate.getTime() === targetDate.getTime();
        });
        if (dayIndex === -1) {
            return res.status(404).send({ message: "Date not found in user's calendar" });
        }
        // Update the activity at the specified index
        user.calendar[dayIndex].activities[index] = activity;
        // Save the updated user document back to the database
        yield collection.updateOne({ userId: userId }, { $set: { calendar: user.calendar } });
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
