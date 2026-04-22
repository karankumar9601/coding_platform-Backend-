
const express=require("express")
const problemRouter=express.Router();
const adminmiddleware=require("../middleware/adminMiddleware")
const {createProblem,updateProblem,deleteProblem,getSingleProblem,getAllProblem,solvedProblem}=require("../controller/problems/problem")

//admin work
problemRouter.post("/create-problem",adminmiddleware,createProblem)
problemRouter.patch("/:id",adminmiddleware,updateProblem)
problemRouter.delete("/:id",adminmiddleware,deleteProblem)

//user and admin both work
problemRouter.get("/:id",getSingleProblem)
problemRouter.get("/",getAllProblem)
problemRouter.get("/user",solvedProblem)

module.exports=problemRouter;