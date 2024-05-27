import { Collection, CollectionInfo } from 'mongodb';
import { UserDataTypeWithout_id } from '../types/user'
import { Request, Response } from 'express';

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

router.post('/create', async (req: Request, res: Response) => {
	const body = req.body;
	const userId = body.data.id;
	if (userId == null) 
		return res.status(422).send({ message: "Bad userId param"});
	
	const user: UserDataTypeWithout_id = {
		userId: body.data.id,
		days: [],
		dailyCalorieTarget: 2000,
	}
	const userExists = await (req as any).db.collection('users').findOne(user)
	if (userExists) {
		res.send({ message: "User already exists :D"})
		return;
	}
	const result = await (req as any).db.collection('users').insertOne(user);
	if (result.insertedCount === 0) {
		res.send({ message: "Couldn't create user :("}).status(500);
		return;
	}

	res.send({ message: "Created user :D"})
})
router.put('/update', async (req: Request, res: Response) => {
	const body = req.body;
	const userId = body.userId;
	const params = body.params;
	const collection: Collection = await (req as any).db.collection('users');
	if (params == null) {
		return res.status(400).send({ message: "Params is null" });
	}
	const userExists = await collection.findOne({ userId: userId });
	if (!userExists) {
		return res.status(404).send({ message: "User not found" });
	}

	// Update the user with the provided params
	const result = await collection.updateOne(
		{ userId: userId }, // Filter criteria
		{ $set: params } // Updated data
	);
	if (result.modifiedCount === 0) 
		return res.status(500).send({ message: "Found user, but nothing to update"});

	return res.send({ message: "User updated successfully" });
})
router.put('/update-calorie-target', async (req: Request, res: Response) => {
	try {
		const { userId, dailyCalorieTarget } = req.body;
		const collection: Collection = (req as any).db.collection('users');
		if (!userId || !dailyCalorieTarget) 
			return res.status(400).send('userId and dailyCalorieTarget are required');
		const result = await collection.updateOne(
		  { userId: userId },  // assuming userId is the document identifier
		  { $set: { dailyCalorieTarget: dailyCalorieTarget } }
		);
	
		if (result.matchedCount === 0) {
		  	return res.status(404).send({ message: 'User not found' });
		}
		return res.status(200).send({ message: 'Daily Calorie Target updated successfully' });
	  } catch (error) {
		console.error('Error updating dailyCalorieTarget:', error);
		return res.status(500).send('Internal Server Error');
	  }
})

router.post('/', async (req: Request, res: Response) => {
	const userId = req.body.userId;
	console.log(`Getting user ${userId}`);
	const user: UserDataTypeWithout_id = await (req as any).db.collection('users').findOne({ userId: userId })
	if (!user) {
        return res.send({ message: "Could not fetch user :(" }).status(500);
	}
	return res.send({ user: JSON.stringify(user) }); // Deep serialize
})


module.exports = router;
