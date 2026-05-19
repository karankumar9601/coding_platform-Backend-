const express=require("express")
const AIChatbotRouter=express.Router();
const authMiddleWare=require("../middleware/authMiddleware")
const doubtSolver=require("../controller/AiChatBot/doubtSolver")

AIChatbotRouter.post('/chat',authMiddleWare,doubtSolver);

module.exports=AIChatbotRouter;
