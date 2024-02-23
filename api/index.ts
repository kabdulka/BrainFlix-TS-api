import express, {Application, Request, Response} from 'express';
const cors = require("cors");
const app: Application = express();
const videoRoutes = require("../routes/videos")
// import videoRoutes from "../routes/videos";
require("dotenv").config();
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

/*
 * Middleware
 * CORS: allows sharing data with apps on others servers, cross origin
 * express.json(): allows access to incoming data posted to the server as part of the bady (req.body)
 */
app.use(express.static('public'));
app.use(cors({origin: CORS_ORIGIN}))
app.use(express.json())
app.use("/videos", videoRoutes)

app.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT}!`);
})