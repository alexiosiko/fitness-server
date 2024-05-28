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
const mongodb_1 = require("mongodb");
const express = require("express");
const app = express();
const cors = require('cors');
const userRoutes = require('./users');
const actionRoutes = require('./actions');
const openaiRoutes = require('./openai');
const foods = require('./foods');
const exersizes = require('./exercises');
require('dotenv').config();
app.use(cors());
app.use(express.json());
// MongoDB connection
const connectionString = process.env.MONGODB_URI || null;
const dbName = process.env.DB_NAME || null;
if (connectionString === null)
    console.error("Missing MONGODB_URI");
if (dbName === null)
    console.error("Missing DB_NAME");
let db = undefined;
function connectToMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (db !== undefined)
            return db;
        console.log("Connecting to db...");
        const client = new mongodb_1.MongoClient(connectionString);
        try {
            yield client.connect();
            console.log("Connected to MongoDB");
            db = client.db(process.env.DB_NAME);
        }
        catch (error) {
            console.error("Error connecting to MongoDB:", error);
            process.exit(1);
        }
        return db;
    });
}
// Middleware to make MongoDB connection available in request object
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.db = yield connectToMongoDB();
    next();
}));
app.use('/users', userRoutes);
app.use('/users/actions', actionRoutes);
app.use('/openai', openaiRoutes);
app.use('/users/foods', foods);
app.use('/users/exercises', exersizes);
app.get("/", (req, res) => res.send({ message: "Express on Vercel" }));
// asd
app.listen(3001, () => console.log("Server ready on port 3001."));
module.exports = app;
