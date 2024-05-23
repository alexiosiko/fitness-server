import { Request, Response } from "express";
import { Collection } from "mongodb";

const express = require("express");
const router = express.Router();

router.put('/', async (req: Request, res: Response) => {
	try {
		const collection = (req as any).db.collection('users');
		const { userId, activity } = req.body;

		const today = getTodayDate();
		const result = await collection.updateOne(
			{ userId: userId, 'calendar.date': today },
			{
				$push: { 'calendar.$.activities': activity }
			}
		);

		if (result.matchedCount === 0) {
			await collection.updateOne(
				{ userId: userId },
				{
					$push: {
						calendar: {
							date: today,
							activities: [activity]
						}
					}
				}
			);
		}

		res.send({ message: "Activity added successfully" });
	} catch (error) {
		console.	error("Error adding activity:", error);
		res.status(500).send({ message: "Internal server error" });
	}
})

router.put('/delete', async (req: Request, res: Response) => {
	try {
		const collection: Collection = (req as any).db.collection('users');
		
	} catch (e) {
		res.status(500).send({ message: "Error" });
	}

})
router.put('/update', async (req: Request, res: Response) => {
	try {
		const collection: Collection = (req as any).db.collection('users');
		const { activity, userId, date, index } = req.body;

		// Convert the provided date to only include year, month, and day (ignore time)
		const targetDate = new Date(date);
		targetDate.setHours(0, 0, 0, 0);

		const user = await collection.findOne({ userId: userId });
		if (!user) {
			return res.status(404).send({ message: "User not found" });
		}

		// Find the day in the calendar that matches the target date
		const dayIndex = user.calendar.findIndex((day: any) => {
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
		await collection.updateOne(
			{ userId: userId },
			{ $set: { calendar: user.calendar } }
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
