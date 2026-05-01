const Problem = require("../../Model/problem")
const submitProblem = require("../../Model/subimission")
const { getLanguageById, submitBatch, submitToken } = require("../../utils/problemUtility")

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
        const problem=await Problem.findById(problemId)
        if (!problem) {
            return res.status(404).json({
                success:false,
                message:"Problem not found",
                data:problem
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
                success:false,
                message:"Something went wrong"
            })
        }
        if (!req.user.problemSolved.includes(problemId)) {
           req.user.problemSolved.push(problemId)
           await req.user.save();  
        }

        return res.status(201).json({
            success:true,
            message:"code submit Successfully"
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = codeSubmission;


