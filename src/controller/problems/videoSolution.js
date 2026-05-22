const Problem = require("../../Model/problem")
const videoSolution = require("../../Model/videoSolution")
const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const getDigitalSignature = async (req, res) => {
    try {
        const { problemId } = req.params
        const userId = req.result._id;
        const problem = await Problem.findById(problemId)
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "problem not Found"
            })
        }
        //generate unique public_ID for video
        const timestamp = Math.round(new Date().getTime() / 1000)
        const publicId = `leetcode-solution/${problemId}/${userId}_${timestamp}`

        //uploading parameters
        const uploadParams = {
            timestamp: timestamp,
            public_id: publicId
        }
        const signature = cloudinary.utils.api_sign_request(
            uploadParams, process.env.CLOUDINARY_API_SECRET
        )

        return res.status(201).json({
            success: true,
            signature,
            timestamp,
            public_id: publicId,
            api_key: process.env.CLOUDINARY_API_KEY,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const saveMetaData = async (req, res) => {
    try {
        const { problemId, cloudinaryPublicId, secureURL, duration } = req.body
        const userId = req.result._id
        const cloudinaryResource = await cloudinary.api.resource(
            cloudinaryPublicId,
            { resource_type: 'video' }
        )

        if (!cloudinaryResource) {
            return res.status(404).json({
                success: false,
                message: "video not found on cloudinary"
            })
        }
        //check video already exist or not for this user
        const existingVideo = await videoSolution.findOne({
            problemId, userId, cloudinaryPublicId
        })
        if (existingVideo) {
            return res.status(409).json({
                success: false,
                message: "video already exist"
            })
        }
        const thumbnailURL = cloudinary.url(cloudinaryResource.public_id, {
            resource_type: 'video',
            transformation: [
                { width: 400, height: 225, crop: 'fill' },
                { quality: 'auto' },
            ],
            format: 'mp4'
        })
        //create video solution record
        const videoSolutions = await videoSolution.create({
            problemId, userId, cloudinaryPublicId, secureURL, thumbnailURL,
            duration: cloudinaryResource.duration || duration
        })
        return res.status(201).json({
            success: true,
            message: "video uploaded successfully",
            id: videoSolutions._id,
            thumbnailURL: videoSolutions.thumbnailURL,
            duration: videoSolutions.duration,
            uploadedAt: videoSolutions.createdAt
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params
        const userId = req.result._id
        const video = await videoSolution.findByIdAndDelete(videoId)
        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Problem video not found"
            })
        }
        await cloudinary.uploader.destroy(video.cloudinaryPublicId, { resource_type: 'video' })
        return res.status(204).json({
            success: true,
            message: "video deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateVideo = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getProblemsWithVideos = async (req, res) => {
  try {
    const userId = req.result._id;
    const problems = await Problem.find().select(" _id title difficulty tag");
    const videos = await videoSolution.find({ userId });
    const videoMap = new Map();

    videos.forEach((video) => {
      videoMap.set(video.problemId.toString(), video);
    });

    const data = problems.map((problem) => {
      const video = videoMap.get(problem._id.toString());

      return {
        problemId: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
        tag: problem.tag,
        hasVideo: !!video,
        video: video
          ? {
              videoId: video._id,
              secureURL: video.secureURL,
              thumbnailURL: video.thumbnailURL,
              duration: video.duration,
              cloudinaryPublicId: video.cloudinaryPublicId,
            }
          : null,
      };
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getDigitalSignature, saveMetaData, deleteVideo, updateVideo,getProblemsWithVideos }