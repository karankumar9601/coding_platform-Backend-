const express=require("express")
const submitRouter=express.Router()
const {codeSubmission,solvedProblemByUser,runcode}=require("../controller/problems/submitProblem")
const authMiddleware=require("../middleware/authMiddleware")

submitRouter.post('/submit/:id',authMiddleware,codeSubmission);
submitRouter.get("/solvedProblemByUser",authMiddleware,solvedProblemByUser);
submitRouter.post("/run/:id",authMiddleware,runcode)

module.exports=submitRouter;