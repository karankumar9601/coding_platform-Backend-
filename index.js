const cookieParser = require("cookie-parser");
const express = require("express")
const app = express();
require('dotenv').config();
const cors=require("cors")
app.use(express.json())
app.use(cookieParser())

//config file 
const main = require("./src/config/db")
const redisClient=require("./src/config/redishConfig")

//Router file
const userRoute=require("./src/Routes/userAuthRoutes");
const problemRouter=require("./src/Routes/problemRoute")
const submitRouter=require("./src/Routes/submitProblemRoute")

//cors issue resolve
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
//start URL
app.use('/api',userRoute)
app.use('/problem',problemRouter)
app.use('/user',submitRouter)


const initialConnection = async () => {
   await Promise.all([main(),redisClient.connect()]);
    console.log("DB connect");
    app.listen(process.env.PORT, () => {
        console.log("server started");

    })
}

initialConnection();
