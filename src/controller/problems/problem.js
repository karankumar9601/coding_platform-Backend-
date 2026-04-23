const Problem = require("../../Model/problem")
const { getLanguageById, submitBatch, submitToken } = require("../../utils/problemUtility")

const createProblem = async (req, res) => {
    try {
        const { title, description, difficulty, tag, visibleTestCase, invisibleTestCase, referenceSolution, startCode, problemCreator } = req.body;

        // VALIDATION

        if (!Array.isArray(visibleTestCase) || visibleTestCase.length === 0) {
            return res.status(400).json({
                success: false,
                message: "visibleTestCase must be a non-empty array"
            });
        }

        if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
            return res.status(400).json({
                success: false,
                message: "referenceSolution must be a non-empty array"
            });
        }

        // Optional: validate each test case has input/output
        for (const tc of visibleTestCase) {
            if (!tc.input || !tc.output) {
                return res.status(400).json({
                    success: false,
                    message: "Each test case must have 'input' and 'output'"
                });
            }
        }

        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language);
            if (!languageId) {
                return res.status(404).json({
                    success: false,
                    message: `Language ID not found for language: ${language}`
                });
            }

            // Build submissions for Judge0
            const submissions = visibleTestCase.map((testcase) => ({
                source_code: completeCode,
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

            // Verify each test case passes
            for (let i = 0; i < testResult.length; i++) {
                const test = testResult[i];
                if (!test) {
                    return res.status(400).json({
                        success: false,
                        message: `Judge0 result missing at index ${i}`
                    });
                }

                const statusId = test.status_id ?? test.status?.id;
                if (statusId !== 3) {
                    return res.status(400).json({
                        success: false,
                        message: test.stderr || test.compile_output || test.stdout || "Judge0 error",
                        details: test
                    });
                }
            }
        }

        // Save problem to database
        const userProblem = await Problem.create({
            ...req.body,
            problemCreator: req.result._id
        });

        if (!userProblem) {
            return res.status(400).json({
                success: false,
                message: "Failed to save problem in database"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Problem saved successfully",
            data: userProblem
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, difficulty, tag, visibleTestCase, invisibleTestCase, referenceSolution, startCode, problemCreator } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID is missing"
            })
        }
        const isAvailableProblem = await Problem.findById(id)
        if (!isAvailableProblem) {
            return res.status(404).json({
                success: false,
                message: "Problem not Found"
            })
        }

        if (!Array.isArray(visibleTestCase) || visibleTestCase.length === 0) {
            return res.status(400).json({
                success: false,
                message: "visibleTestCase must be a non-empty array"
            });
        }

        if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
            return res.status(400).json({
                success: false,
                message: "referenceSolution must be a non-empty array"
            });
        }

        // Optional: validate each test case has input/output
        for (const tc of visibleTestCase) {
            if (!tc.input || !tc.output) {
                return res.status(400).json({
                    success: false,
                    message: "Each test case must have 'input' and 'output'"
                });
            }
        }

        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language);
            if (!languageId) {
                return res.status(404).json({
                    success: false,
                    message: `Language ID not found for language: ${language}`
                });
            }

            // Build submissions for Judge0
            const submissions = visibleTestCase.map((testcase) => ({
                source_code: completeCode,
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

            // Verify each test case passes
            for (let i = 0; i < testResult.length; i++) {
                const test = testResult[i];
                if (!test) {
                    return res.status(400).json({
                        success: false,
                        message: `Judge0 result missing at index ${i}`
                    });
                }

                const statusId = test.status_id ?? test.status?.id;
                if (statusId !== 3) {
                    return res.status(400).json({
                        success: false,
                        message: test.stderr || test.compile_output || test.stdout || "Judge0 error",
                        details: test
                    });
                }
            }
        }
        const updatedProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, returnDocument: 'after' })
        if (!updateProblem) {
            return res.status(400).json({
                success: false,
                message: "updates item not return"
            })
        }
        return res.status(200).json({
            success: true,
            message: "all field updated successfully",
            data: updatedProblem
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID is missing"
            })
        }
        const deletedProblem = await Problem.findByIdAndDelete(id)
        if (!deletedProblem) {
            return res.status(404).json({
                success: false,
                message: "Problem not Found"
            })
        }
        return res.status(204).json({
            success: true,
            message: "successfully deleted Problem",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getSingleProblem = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID is missing"
            })
        }
        const getProblem = await Problem.findById(id);
        if (!getProblem) {
            return res.status(404).json({
                success: false,
                message: "Problem not Found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Problem fetch Successfully",
            data: getProblem
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllProblem = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query

        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: "page and limit must be positive numbers"
            });
        }
        const skip = (page - 1) * limit;
        const problem = await Problem.find().skip(skip).limit(limit)
        if (problem.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Problem not Found"
            })
        }
        const totalData = await Problem.countDocuments();
        if (totalData == 0) {
            return res.status(404).json({
                success: false,
                message: "data not count"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Problem Fetch Successfully",
            page,
            limit,
            totalData,
            totalPage: Math.ceil(totalData / limit),
            data: problem
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const solvedProblem = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const filterProblem = async (req, res) => {
    try {
        let { tag, page = 1, limit = 5 } = req.query
        page = parseInt(page)
        limit = parseInt(limit)
        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: "page and limit must be positive numbers"
            });
        }
        if(!tag){
           return res.status(400).json({
            success:false,
            message:"Invalid Input"
           })
        }
        const skip=(page-1)*limit;
        let filter={};
        if(tag){
            filter.tag=tag;
        }
        const filterdata=await Problem.find(filter).skip(skip).limit(limit)
        if (filterdata.length==0) {
            return res.status(404).json({
                success:false,
                message:"Problem not Found"
            })
        }
        const totalfilterdata=await Problem.countDocuments(filter)
        if (totalfilterdata==0) {
            return res.status(400).json({
                success:false,
                message:"Something went wrong"
            })
        }
        return res.status(200).json({
            success:true,
            message:"All data fetch successfully",
            data:filterdata,
            totalfilterdata,
            totalPage:Math.ceil(totalfilterdata/limit),
            page,
            limit
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
module.exports = { createProblem, updateProblem, deleteProblem, getSingleProblem, getAllProblem, solvedProblem, filterProblem }