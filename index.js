const cookieParser = require("cookie-parser");
const express = require("express")
const app = express();
const cookoParser = require("cookie-parser")
require('dotenv').config();
app.use(express.json())
app.use(cookieParser)
const main = require("./src/config/db")


const initialConnection = async () => {
   await  main();
    console.log("DB connect");
    app.listen(process.env.PORT, () => {
        console.log("server started");

    })
}

initialConnection();
