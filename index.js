const cookieParser = require("cookie-parser");
const express = require("express")
const app = express();
require('dotenv').config();
app.use(express.json())
app.use(cookieParser())

//config file 
const main = require("./src/config/db")
const redisClient=require("./src/config/redishConfig")

//Router file
const userRoute=require("./src/Routes/userAuthRoutes");
const problemRouter=require("./src/Routes/problemRoute")

//start URL
app.use('/api',userRoute)
app.use('/problem',problemRouter)


const initialConnection = async () => {
   await Promise.all([main(),redisClient.connect()]);
    console.log("DB connect");
    app.listen(process.env.PORT, () => {
        console.log("server started");

    })
}

initialConnection();
