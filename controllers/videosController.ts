import express, {Application, Request, Response} from 'express';
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


// read data from JSON a files
const readVideos = (): videoType[] => {
    const videosFile = fs.readFileSync("./data/videos2.json")
    const videosData: videoType[] = JSON.parse(videosFile)
    return videosData;
}

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

function writeVideos(file: string, data: videoType[], callback: (err: Error) => express.Response<any, Record<string, any>> | undefined) {
  // fs.writeFile takes 3 args, 1: the file to write, 2: data to write, 3: a callback function
  fs.writeFileSync(file, JSON.stringify(data), callback);
}

// get a condensed version of the videos
const getVideos = (req: Request, res: Response): void => {
    // console.log(typeof res.send(["string"]))
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

const postVideo = (req: Request, res: Response) => {
    const body = req.body
    const videos: videoType[] = readVideos()
    // console.log(body)

    // require both inputs from the client
    if (body.title === "" || body.description === "") {
        res.status(404).send("title and/or description are not provided")
        return;
    }

    const newVideo: videoType = {
        id: uuidv4(),
        title: body.title,
        channel: "channel1",
        description: body.description,
        timestamp: Date.now(),
        image: "http://localhost:9000/images/Upload-video-preview.jpg",
        comments: [
          
        ],
        video: "https://project-2-api.herokuapp.com/stream",
        likes: "1",
        views: "1",
        duration: "4:30"
    };

    videos.push(newVideo);

    // method 1:
    // writeVideos(videos);

        // method 2:
    // write back to the JSON file, save the new video
      writeVideos(
        "./data/videos2.json",
        videos, // data to write to file
        (err: Error) => {
          if (err) {
            return res.send("error writing file");
          }
          res.status(201).send("New video sucessfully posted");
        }
      );


    res.status(201).send(videos)
}


module.exports = {
    getVideos,
    getSingleVideo,
    postVideo
}

