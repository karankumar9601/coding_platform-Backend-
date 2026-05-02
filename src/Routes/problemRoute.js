
const express=require("express")
const problemRouter=express.Router();
const adminmiddleware=require("../middleware/adminMiddleware")
const authMiddleware=require("../middleware/authMiddleware")
const {createProblem,updateProblem,deleteProblem,getSingleProblem,getAllProblem,filterProblem}=require("../controller/problems/problem")

//admin work
problemRouter.post("/create-problem",adminmiddleware,createProblem)
problemRouter.put("/:id",adminmiddleware,updateProblem)
problemRouter.delete("/:id",adminmiddleware,deleteProblem)

//user and admin both work
problemRouter.get("/filterdata",authMiddleware,filterProblem)
problemRouter.get("/:id",authMiddleware,getSingleProblem)
problemRouter.get("/",authMiddleware,getAllProblem)


module.exports=problemRouter;