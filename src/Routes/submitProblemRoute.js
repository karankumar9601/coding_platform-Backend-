const express=require("express")
const submitRouter=express.Router()
const codeSubmission=require("../controller/problems/submitProblem")
const authMiddleware=require("../middleware/authMiddleware")

submitRouter.post('/submit/:id',authMiddleware,codeSubmission);

module.exports=submitRouter;