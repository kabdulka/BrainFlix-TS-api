import express from 'express';
// import {getVideos} from "../controllers/videosController";

const videosController = require("../controllers/videosController");

const {getVideos, getSingleVideo } = videosController;

const router = express.Router();

const fs = require("fs");

/*
 * GET collection of Videos
 */
router.get("/", getVideos);

/*
 * GET all details for a single video
 */
router.get("/:id", getSingleVideo);

module.exports = router;