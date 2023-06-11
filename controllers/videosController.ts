import express, {Application, Request, Response, response} from 'express';
const fs = require("fs"); // file system module, used to read/write data on the server
const { v4: uuidv4 } = require("uuid"); // Unique ID Generator

require("dotenv").config(); // load variables from .env file
const PORT = process.env.PORT || 6000; // Set server port from .env file
const SERVER_URL = process.env.SERVER_URL;
const app: Application = express();
app.use(express.json())

// Types
interface CommentType {
    id: string
    name: string
    comment: string
    likes: string
    timestamp: number
}

interface videoType {
    id: string
    title: string
    channel: string
    image: string
    description: string
    views: string
    likes: string
    duration: string
    video: string
    timestamp: number
    comments: CommentType[]
}

// single video with subset of data of the larger video
interface strippedVideoType {
    id: string
    title: string
    channel: string
    image: string
}


const readVideos = (): videoType[] => {
    const videosFile = fs.readFileSync("./data/videos.json")
    const videosData: videoType[] = JSON.parse(videosFile)
    return videosData;
}

// get a condensed version of the videos
// router.get("/", (req: Request, res: Response) => {

const getVideos = (req: Request, res: Response): void => {
    const videoData: videoType[] = readVideos();

     const strippedVidData: strippedVideoType[] = videoData.map((video: videoType) => 
    {
        return {
            id: video.id,
            title: video.title,
            channel: video.channel,
            image: video.image
        }
    })
    // console.log(strippedVidData)
    res.status(200).json(strippedVidData);
}

const getSingleVideo = (req: Request, res: Response) => {
    console.log(req.params.id)

    // get the id from the request
    const videoId: string = req.params.id;
    // retrieve all videos
    const videos: videoType[] = readVideos();

    // find video using the retrieved id
    const videoFound: videoType | undefined = videos.find((video) => video.id === videoId)

    if (videoFound) {
        res.status(200).json(videoFound)
    } else {
        res.status(404).send("Video not found")
    }
}

module.exports = {
    getVideos,
    getSingleVideo
}

// router.get("/:id", (res: Response, req: Request) => {
//     console.log(req.params.id)
// })