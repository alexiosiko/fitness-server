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
const Day_1 = require("../lib/Day");
const express = require("express");
const router = express.Router();
router.put('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = req.db.collection('users');
        let { userId, exercise, selectedDate } = req.body;
        const user = yield collection.findOne({ userId: userId });
        if (!user)
            return res.status(500).send({ message: "User not found" });
        // Find if day exists in user
        let foundDay = user.days.find((day) => (0, Day_1.isSameDay)(day.date, selectedDate));
        if (!foundDay)
            return res.status(500).send("Couldn't find day");
        // Find the index of the food item to be deleted
        const exerciseIndex = foundDay.exercises.findIndex((iteratedExercise) => iteratedExercise.name === exercise.name && iteratedExercise.calories === exercise.calories && iteratedExercise.timeInMinutes === exercise.timeInMinutes);
        if (exerciseIndex === -1)
            return res.status(404).send({ message: "Food item not found" });
        // Remove the food item
        foundDay.exercises.splice(exerciseIndex, 1);
        // Update the user in the database
        yield collection.updateOne({ userId }, { $set: { days: user.days } });
        res.status(200).send({ message: "Food item deleted successfully" });
    }
    catch (error) {
        console.error("Error adding action:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}));
router.put('/insert', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = req.db.collection('users');
        let { userId, exercise, selectedDate } = req.body;
        console.log(req.body);
        selectedDate = (0, Day_1.normalizeDateString)(selectedDate);
        // Retrieve user data
        const user = yield collection.findOne({ userId });
        if (!user)
            return res.status(404).send({ message: "User not found" });
        // Find if day exists in user
        let foundDay = user.days.find(day => (0, Day_1.isSameDay)(day.date, selectedDate));
        if (!foundDay) {
            // If day doesnt not exists in array,
            // create day and add action to array
            const newDay = {
                exercises: [exercise],
                foods: [],
                date: selectedDate
            };
            // Add to user
            user.days.push(newDay);
        }
        else {
            // If the day is found, add the food to the day's foods
            foundDay.exercises.push(exercise);
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
router.put('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = req.db.collection('users');
        const { exercise, userId, selectedDate, exerciseIndex } = req.body;
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
        // Update the action at the specified index
        foundDay.exercises[exerciseIndex] = exercise;
        // Save the updated user document back to the database
        yield collection.updateOne({ userId: userId }, { $set: { days: user.days } });
        return res.send({ message: "Action updated successfully" });
    }
    catch (e) {
        return res.send({ message: "Error updating action" }).status(500);
    }
}));
module.exports = router;
