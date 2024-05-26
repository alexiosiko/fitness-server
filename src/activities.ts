import { Request, Response, Router } from "express";
import { Collection } from "mongodb";
import { Day, UserDataType, UserDataTypeWithout_id } from './../types/user'
import { isSameDay, normalizeDateString as normalizeDate } from "../lib/Day";
const express = require("express");
const router: Router = express.Router();

router.put('/', async (req: Request, res: Response) => {
	try {
		const collection: Collection = (req as any).db.collection('users');
		let { userId, activity, selectedDate }  = req.body;
		selectedDate = normalizeDate(selectedDate);
		// Retrieve user data
		const user: UserDataType | null = await collection.findOne({ userId }) as UserDataType | null;
		
		if (!user) {
			return res.status(404).send({ message: "User not found" });
		}

		// Find if day exists in user
		let foundDay = user.days.find(day => {
			return isSameDay(day.date, selectedDate);
		})
		if (!foundDay) {
			// If day doesnt not exists in array,
			// create day and add activity to array
			const newDay: Day = {
				activities: [activity],
				date: selectedDate
			}

			// Add to user
			user.days.push(newDay);
		} else {
			// If the day is found, add the activity to the day's activities
			foundDay.activities.push(activity);
        }
		// Update user
		const result = await collection.updateOne(
            { userId },
            { $set: { days: user.days } }
        );
		res.status(200).send({ message: "Activity added successfully" });
	} catch (error) {
		console.error("Error adding activity:", error);
		res.status(500).send({ message: "Internal server error" });
	}
});


router.post('/delete', async (req: Request, res: Response) => {
	try {
		let { userId, activity, selectedDate } = req.body;
		const collection: Collection = (req as any).db.collection('users');

		// Normalize the date to 'YYYY-MM-DD'
		if (!selectedDate) 
			return res.status(404).send({ message: "SelectedDate not found" });
		
		selectedDate = normalizeDate(selectedDate);

		// Find the user
		const user = await collection.findOne({ userId }) as UserDataType | null;
		if (!user) 
			return res.status(404).send({ message: "User not found" });

		if (!activity) 
			return res.status(500).send({ message: "Activity is empty"});

		// Find the specific day in the user's days
		const foundDay = user.days.find(day => isSameDay(day.date, selectedDate));

		if (!foundDay)  
			return res.status(404).send({ message: "Day not found. Wtf?" });

		// Find the activity in the day's activities
		const foundActivityIndex = foundDay.activities.findIndex(
			(iteratedActivity) => iteratedActivity.name === activity.name && iteratedActivity.calories === activity.calories
		);
		if (foundActivityIndex === -1)
			return res.status(404).send({ message: "Activity not found" });

		// Remove the activity from the day's activities
		foundDay.activities.splice(foundActivityIndex, 1);

		// Update the user document in the database
		await collection.updateOne(
			{ userId },
			{ $set: { days: user.days } }
		);
		res.status(200).send({ message: "Activity deleted successfully" });
	} catch (e: any) {
		res.status(500).send({ message: e.message });
	}
});
router.put('/update', async (req: Request, res: Response) => {
	try {
		const collection: Collection = (req as any).db.collection('users');
		const { activity, userId, selectedDate, activityIndex } = req.body;

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
		

		// Update the activity at the specified index
		foundDay.activities[activityIndex] = activity;

		// Save the updated user document back to the database
		await collection.updateOne(
			{ userId: userId },
			{ $set: { days: user.days } }
		);

		return res.send({ message: "Activity updated successfully" });
	} catch (e) {
		return res.send({ message: "Error updating activity"}).status(500);
	}
	
})


export function getTodayDate() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return today;
}


module.exports = router;
