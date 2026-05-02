const express=require("express")
const submitRouter=express.Router()
const {codeSubmission,solvedProblemByUser}=require("../controller/problems/submitProblem")
const authMiddleware=require("../middleware/authMiddleware")

submitRouter.post('/submit/:id',authMiddleware,codeSubmission);
submitRouter.get("/solvedProblemByUser",authMiddleware,solvedProblemByUser);

module.exports=submitRouter;