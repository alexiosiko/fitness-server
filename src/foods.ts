import { Request, Response, Router } from "express";
import { Collection } from "mongodb";
import { Day, Food, UserDataType } from "../types/user";
import { isSameDay, normalizeDateString } from "../lib/Day";
const express = require("express");
const router: Router = express.Router();

router.put('/delete', async (req: Request, res: Response) => {
	try {
		const collection: Collection = (req as any).db.collection('users');
		let { userId, food, selectedDate }  = req.body;

		const user = await collection.findOne({ userId: userId })

		if (!user)
			return res.status(500).send({ message: "User not found" });
		
		// Find if day exists in user
		let foundDay: Day | null = user.days.find((day: Day)  => isSameDay(day.date, selectedDate))

		if (!foundDay)
			return res.status(500).send("Couldn't find day");

		// Find the index of the food item to be deleted
		const foodIndex = foundDay.foods.findIndex((iteratedFood: Food) => iteratedFood.name === food.name && iteratedFood.calories === food.calories && iteratedFood.protein === food.protein)
		
		if (foodIndex === -1)
		  return res.status(404).send({ message: "Food item not found" });
	
		// Remove the food item
		foundDay.foods.splice(foodIndex, 1);
	
		// Update the user in the database
		await collection.updateOne({ userId }, { $set: { days: user.days } });
	
		res.status(200).send({ message: "Food item deleted successfully" });
	} catch (error) {
		console.error("Error adding action:", error);
		res.status(500).send({ message: "Internal server error" });
	}
})
router.put('/insert', async (req: Request, res: Response) => {
		try {
		const collection: Collection = (req as any).db.collection('users');
		let { userId, food, selectedDate }  = req.body;
		selectedDate = normalizeDateString(selectedDate);
		// Retrieve user data
		const user: UserDataType | null = await collection.findOne({ userId }) as UserDataType | null;
		
		if (!user)
			return res.status(404).send({ message: "User not found" });
		

		// Find if day exists in user
		let foundDay = user.days.find(day => {
			return isSameDay(day.date, selectedDate);
		})
		if (!foundDay) {
			// If day doesnt not exists in array,
			// create day and add action to array
			const newDay: Day = {
				foods: [food],
				exercises: [],
				date: selectedDate
			}

			// Add to user
			user.days.push(newDay);
		} else {
			// If the day is found, add the food to the day's foods
			foundDay.foods.push(food);
        }
		// Update user
		const result = await collection.updateOne(
            { userId },
            { $set: { days: user.days } }
        );
		res.status(200).send({ message: "Action added successfully" });
	} catch (error) {
		console.error("Error adding action:", error);
		res.status(500).send({ message: "Internal server error" });
	}
});
router.put('/update', async (req: Request, res: Response) => {
	try {
		const collection: Collection = (req as any).db.collection('users');
		const { food, userId, selectedDate, foodIndex } = req.body;

		const user: UserDataType | null = await collection.findOne({ userId: userId })  as UserDataType | null;
		if (!user) {
			return res.status(404).send({ message: "User not found" });
		}

		// Find the day in the days that matches the target date
		const foundDay = user.days.find(day => {
			return isSameDay(day.date, selectedDate);
		});


		if (!foundDay) 
			return res.status(404).send({ message: "Date not found in user's days" });
		

		// Update the action at the specified index
		foundDay.foods[foodIndex] = food;

		// Save the updated user document back to the database
		await collection.updateOne(
			{ userId: userId },
			{ $set: { days: user.days } }
		);

		return res.send({ message: "Action updated successfully" });
	} catch (e) {
		return res.send({ message: "Error updating action"}).status(500);
	}
	
})

module.exports = router;