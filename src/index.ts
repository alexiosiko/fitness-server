import { Response } from "express";
import { Db, MongoClient } from "mongodb";

const express = require("express");
const app = express();
const cors = require('cors');
const userRoutes = require('./users')
const activityRoutes = require('./activities')
require('dotenv').config();

app.use(cors())
app.use(express.json());

// MongoDB connection
const connectionString = process.env.MONGODB_URI || null;
const dbName = process.env.DB_NAME || null;
if (connectionString === null)
	console.error("Missing MONGODB_URI")
if (dbName === null)
	console.error("Missing DB_NAME")
let db: Db | undefined = undefined;


async function connectToMongoDB() {
	if (db !== undefined)
		return db;
	const client: MongoClient = new MongoClient(connectionString as string);
	try {
	  await client.connect();
	  console.log("Connected to MongoDB");
	  db = client.db(process.env.DB_NAME);
	} catch (error) {
	  console.error("Error connecting to MongoDB:", error);
	  process.exit(1);
	}
	return db;
}
  
// Middleware to make MongoDB connection available in request object
app.use(async (req: Request, res: Response, next: any) => {
	(req as any).db = await connectToMongoDB();
	next();
});

app.use('/users', userRoutes);
app.use('/users/activities', activityRoutes);
app.get("/", (req: Request, res: Response) => res.send({ message: "Express on Vercel"}));
// asd
app.listen(3001, () => console.log("Server ready on port 3001."));

module.exports = app;