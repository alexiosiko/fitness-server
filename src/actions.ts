import { Request, Response, Router } from "express";
import { Collection } from "mongodb";
import { Day, UserDataType, UserDataTypeWithout_id } from '../types/user'
import { isSameDay, normalizeDateString as normalizeDate } from "../lib/Day";
const express = require("express");
const router: Router = express.Router();




// router.post('/delete', async (req: Request, res: Response) => {
// 	try {
// 		let { userId, action, selectedDate } = req.body;
// 		const collection: Collection = (req as any).db.collection('users');

// 		// Normalize the date to 'YYYY-MM-DD'
// 		if (!selectedDate) 
// 			return res.status(404).send({ message: "SelectedDate not found" });
		
// 		selectedDate = normalizeDate(selectedDate);

// 		// Find the user
// 		const user = await collection.findOne({ userId }) as UserDataType | null;
// 		if (!user) 
// 			return res.status(404).send({ message: "User not found" });

// 		if (!action) 
// 			return res.status(500).send({ message: "action is empty"});

// 		// Find the specific day in the user's days
// 		const foundDay = user.days.find(day => isSameDay(day.date, selectedDate));

// 		if (!foundDay)  
// 			return res.status(404).send({ message: "Day not found. Wtf?" });

// 		// Find the action in the day's actions
// 		const foundActionIndex = foundDay.actions.findIndex(
// 			(iteratedAction) => iteratedAction.name === action.name && iteratedAction.calories === action.calories
// 		);
// 		if (foundActionIndex === -1)
// 			return res.status(404).send({ message: "action not found" });

// 		// Remove the action from the day's actions
// 		foundDay.actions.splice(foundActionIndex, 1);

// 		// Update the user document in the database
// 		await collection.updateOne(
// 			{ userId },
// 			{ $set: { days: user.days } }
// 		);
// 		res.status(200).send({ message: "Action deleted successfully" });
// 	} catch (e: any) {
// 		res.status(500).send({ message: e.message });
// 	}
// });
// router.put('/update', async (req: Request, res: Response) => {
// 	try {
// 		const collection: Collection = (req as any).db.collection('users');
// 		const { action, userId, selectedDate, actionIndex } = req.body;

// 		const user: UserDataType | null = await collection.findOne({ userId: userId })  as UserDataType | null;
// 		if (!user) {
// 			return res.status(404).send({ message: "User not found" });
// 		}

// 		// Find the day in the days that matches the target date
// 		const foundDay = user.days.find(day => {
// 			return isSameDay(day.date, selectedDate);
// 		});


// 		if (!foundDay) 
// 			return res.status(404).send({ message: "Date not found in user's days" });
		

// 		// Update the action at the specified index
// 		foundDay.actions[actionIndex] = action;

// 		// Save the updated user document back to the database
// 		await collection.updateOne(
// 			{ userId: userId },
// 			{ $set: { days: user.days } }
// 		);

// 		return res.send({ message: "Action updated successfully" });
// 	} catch (e) {
// 		return res.send({ message: "Error updating action"}).status(500);
// 	}
	
// })


// export function getTodayDate() {
// 	const today = new Date();
// 	today.setHours(0, 0, 0, 0);
// 	return today;
// }


module.exports = router;