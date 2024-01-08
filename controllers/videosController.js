"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs = require("fs"); // file system module, used to read/write data on the server
const { v4: uuidv4 } = require("uuid"); // Unique ID Generator
require("dotenv").config(); // load variables from .env file
// const multer = require('multer')
const multer_1 = __importDefault(require("multer"));
const PORT = process.env.PORT; // Set server port from .env file
const SERVER_URL = process.env.SERVER_URL;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// configure Multer
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
    // limits: { fieldSize: 10 * 1024 * 1024 },
});
const upload = (0, multer_1.default)({ storage: storage }).single('file');
// read data from JSON a files
const readVideos = () => {
    const videosFile = fs.readFileSync("./data/videos.json");
    const videosData = JSON.parse(videosFile);
    return videosData;
};
// Method 2 for posting
// const writeVideos = (data: videoType[]): void => {
//     const jsonString = JSON.stringify(data)
//     fs.writeFileSync("./data/videos2.json", jsonString, (err: Error) => {
//         if (err) {
//             console.log('Error writing file', err)
//         } else {
//             console.log('Successfully wrote file')
//         }
//     })
// }
function writeVideos(data) {
    fs.writeFile(`./data/videos.json`, JSON.stringify(data), (err) => {
        if (err) {
            console.log(err);
            return;
        }
        else {
            console.log("file written successfully");
        }
    });
}
// function writeVideos(file: string, data: videoType[], callback: (err: Error) => express.Response<any, Record<string, any>> | undefined) {
//   // fs.writeFile takes 3 args, 1: the file to write, 2: data to write, 3: a callback function
//   fs.writeFileSync(file, JSON.stringify(data), callback);
// }
// get a condensed version of the videos
const getVideos = (req, res) => {
    const videoData = readVideos();
    const strippedVidData = videoData.map((video) => {
        return {
            id: video.id,
            title: video.title,
            channel: video.channel,
            image: video.image
        };
    });
    if (!strippedVidData) {
        res.status(500).send("Couldn't retrieve videos");
    }
    res.status(200).json(strippedVidData);
};
const getSingleVideo = (req, res) => {
    // get the id from the request
    const videoId = req.params.id;
    // retrieve all videos
    const videos = readVideos();
    if (!videoId) {
        return res.status(400).send("video ID not provided");
    }
    // find video using the retrieved id
    const videoFound = videos.find((video) => video.id === videoId);
    if (videoFound) {
        res.status(200).json(videoFound);
    }
    else {
        res.status(500).send("Video not found");
    }
};
const postVideo = (req, res) => {
    const body = req.body;
    const videos = readVideos();
    // require both inputs from the client
    if (body.title === "" || body.description === "" || !req.file) {
        res.status(404).send("title and/or image and/or description are not provided");
        return;
    }
    const newVideo = {
        id: uuidv4(),
        title: body.title,
        channel: "channel1",
        description: body.description,
        timestamp: Date.now(),
        image: `http://localhost:5500/images/${req.file.filename}`,
        comments: [],
        video: "https://project-2-api.herokuapp.com/stream",
        likes: "1",
        views: "1",
        duration: "4:30"
    };
    videos.push(newVideo);
    // method 1:
    writeVideos(videos);
    // method 2:
    // write back to the JSON file, save the new video
    //   writeVideos(
    //     "./data/videos2.json",
    //     videos, // data to write to file
    //     (err: Error) => {
    //       if (err) {
    //         return res.send("error writing file");
    //       }
    //       res.status(201).send("New video sucessfully posted");
    //     }
    //   );
    res.status(201).send(videos);
};
const postComment = (req, res) => {
    const body = req.body;
    const videoId = req.params.id;
    // comment wasn't provided from the client
    if (!body.comment) {
        res.status(404).send("Comment is required");
        return;
    }
    // get all videos
    const videos = readVideos();
    // filter videos to obtain the one with the desired id from the params
    const selectedVideo = videos.find((video) => video.id === videoId);
    // create new comment to be posted
    const newComment = {
        id: uuidv4(),
        name: "Anonymous",
        comment: body.comment,
        likes: "0",
        timestamp: Date.now()
    };
    // add a new comment to the selected video
    selectedVideo === null || selectedVideo === void 0 ? void 0 : selectedVideo.comments.push(newComment);
    if (selectedVideo) {
        // write/save changes
        writeVideos(videos);
        res.status(201).send(selectedVideo);
    }
    else {
        res.status(500).send("cannot post video");
    }
};
const likeVideo = (req, res) => {
    const videoId = req.params.id;
    const videos = readVideos();
    const selectedVideo = videos.find(video => video.id === videoId);
    let videoLikesNum = Number(selectedVideo === null || selectedVideo === void 0 ? void 0 : selectedVideo.likes.replaceAll(",", ""));
    videoLikesNum++;
    const videoLikesStr = videoLikesNum.toLocaleString();
    if (selectedVideo != undefined) {
        selectedVideo.likes = videoLikesStr;
        writeVideos(videos);
        res.status(201).send(selectedVideo);
    }
    else {
        res.status(404).send("Error in liking Video");
        return;
    }
};
const deleteComment = (req, res) => {
    const videoId = req.params.videoId;
    const commentId = req.params.commentId;
    const videos = readVideos();
    const selectedVideo = videos.find(video => videoId === video.id);
    const allowedComments = selectedVideo === null || selectedVideo === void 0 ? void 0 : selectedVideo.comments.filter((comment) => comment.id !== commentId);
    if (selectedVideo != undefined && allowedComments != undefined) {
        selectedVideo.comments = allowedComments;
        writeVideos(videos);
        res.status(201).send("Comment deleted");
    }
    else {
        res.status(404).send("Video/comment not found");
    }
};
module.exports = {
    getVideos,
    getSingleVideo,
    postVideo,
    postComment,
    likeVideo,
    deleteComment,
    upload
};
