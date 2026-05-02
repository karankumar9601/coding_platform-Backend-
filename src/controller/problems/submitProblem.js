const Problem = require("../../Model/problem")
const submitProblem = require("../../Model/subimission")
const { getLanguageById, submitBatch, submitToken } = require("../../utils/problemUtility")
const User = require("../../Model/user")

const codeSubmission = async (req, res) => {
    try {
        const userId = req.user._id;
        const problemId = req.params.id
        const { code, language } = req.body
        if (!userId || !problemId || !code || !language) {
            return res.status(400).json({
                success: false,
                message: "some field missing"
            })
        }
        //fetch data from DB
        const problem = await Problem.findById(problemId)
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
                data: problem
            })
        }
        //store code in DB
        const submittedResult = await submitProblem.create({
            userId, problemId, code, language, status: 'pending', testCasePassed: 0,
            totalTestCase: problem.invisibleTestCase.length
        })

        //code submit to judge0
        const languageId = getLanguageById(language);
        if (!languageId) {
            return res.status(404).json({
                success: false,
                message: `Language ID not found for language: ${language}`
            });
        }
        const submissions = problem.invisibleTestCase.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));
        const submitResult = await submitBatch(submissions);
        if (!submitResult || !Array.isArray(submitResult)) {
            return res.status(400).json({
                success: false,
                message: "Judge0 batch submission failed"
            });
        }
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);
        if (!testResult || !Array.isArray(testResult)) {
            return res.status(400).json({
                success: false,
                message: "Failed to get results from Judge0"
            });
        }
        let testCasePassed = 0
        let status = 'accepted'
        let totalTestCase = 0
        let runtime = 0
        let memory = 0
        let errorMessage = null

        for (const test of testResult) {
            if (test.status_id == 3) {
                testCasePassed++
                runtime += Number(test.time || 0);
                memory = Math.max(memory, test.memory)
            } else if (test.status_id == 4) {
                status = 'error'
                errorMessage = test.stderr
            } else {
                status = 'wrong'
                errorMessage = test.stderr
            }
        }

        submittedResult.status = status;
        submittedResult.runtime = runtime
        submittedResult.memory = memory
        submittedResult.errorMessage = errorMessage
        submittedResult.testCasePassed = testCasePassed
        submittedResult.totalTestCase = totalTestCase
        const result = await submittedResult.save()
        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong"
            })
        }
        const alreadySolved = req.user.problemSolved.some(
            id => id.toString() === problemId.toString()
        );

        if (!alreadySolved) {
            req.user.problemSolved.push(problemId);
            await req.user.save();
        }

        return res.status(201).json({
            success: true,
            message: "code submit Successfully"
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const solvedProblemByUser = async (req, res) => {
    try {
        const userId = req.user._id;
        let { page = 1, limit = 5 } = req.query
        page = parseInt(page)
        limit = parseInt(limit)
        const skip = (page - 1) * limit
        const user = await User.findById(userId).populate({
            path: "problemSolved",
            select: "_id title status difficulty tag"
        }).skip(skip).limit(limit)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Problem not solved"
            })
        }
        return res.status(200).json({
            success: true,
            message: "All Solved Fetch",
            data: user,
            length: user.problemSolved.length
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const runcode = async (req, res) => {
    try {
        const userId = req.user._id;
        const problemId = req.params.id
        const { code, language } = req.body
        if (!userId || !problemId || !code || !language) {
            return res.status(400).json({
                success: false,
                message: "some field missing"
            })
        }
        //fetch Problem from DB
        const problem = await Problem.findById(problemId)
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            })
        }
        //code submit to judge0
        const languageId = getLanguageById(language);
        if (!languageId) {
            return res.status(404).json({
                success: false,
                message: `Language ID not found for language: ${language}`
            });
        }
        const submissions = problem.visibleTestCase.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));
        const submitResult = await submitBatch(submissions);
        if (!submitResult || !Array.isArray(submitResult)) {
            return res.status(400).json({
                success: false,
                message: "Judge0 batch submission failed"
            });
        }
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);
        if (!testResult || !Array.isArray(testResult)) {
            return res.status(400).json({
                success: false,
                message: "Failed to get results from Judge0"
            });
        }


        return res.status(200).json({
            success: true,
            message: "code run successfully",
            data:testResult
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const multiplesubmissionOfOneProblem=async(req,res)=>{
    try {
        const userId=req.user._id;
        const problemId=req.params.pid;
        const ans=await submitProblem.find({userId,problemId})
        if (ans.length===0) {
            return res.status(404).json({
                success:false,
                message:"problem not Solved"
            })
        }
        return res.status(200).json({
            success:true,
            message:"all problem fetch",
            data:ans
        })
    } catch (error) {
      res.status(500).json({
        success:false,
        message:error.message
      })  
    }
}

module.exports = { codeSubmission, solvedProblemByUser,runcode ,multiplesubmissionOfOneProblem};


