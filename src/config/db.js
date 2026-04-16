
const mongoose=require("mongoose")

const main= async()=>{
   await mongoose.connect(process.env.DB_CONNECTION_KEY) 
}
module.exports=main;