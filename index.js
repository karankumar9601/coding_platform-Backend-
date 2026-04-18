const cookieParser = require("cookie-parser");
const express = require("express")
const app = express();
const cookoParser = require("cookie-parser")
require('dotenv').config();
app.use(express.json())
app.use(cookieParser)
const main = require("./src/config/db")
const redisClient=require("./src/config/redishConfig")


const initialConnection = async () => {
   await Promise.all([main(),redisClient.connect()]);
    console.log("DB connect");
    app.listen(process.env.PORT, () => {
        console.log("server started");

    })
}

initialConnection();
