const express=require("express")
const videoSolutionRouter=express.Router()
const {getDigitalSignature,saveMetaData,deleteVideo,updateVideo,getProblemsWithVideos}=require("../controller/problems/videoSolution")
const adminMiddleware=require("../middleware/adminMiddleware")

videoSolutionRouter.get('/create/:problemId',adminMiddleware,getDigitalSignature)
videoSolutionRouter.post('/save-video',adminMiddleware,saveMetaData)
videoSolutionRouter.delete('/delete-video/:videoId',adminMiddleware,deleteVideo)
videoSolutionRouter.patch('/update-video/:problemId',adminMiddleware,updateVideo)
videoSolutionRouter.get("/",adminMiddleware,getProblemsWithVideos)

module.exports=videoSolutionRouter;