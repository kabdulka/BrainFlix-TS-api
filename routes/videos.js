"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { upload } from '../controllers/videosController';
const videosController = require("../controllers/videosController");
const { getVideos, getSingleVideo, postVideo, postComment, likeVideo, deleteComment, upload } = videosController;
const router = express_1.default.Router();
/*
 * GET collection of Videos
 */
router.get("/", getVideos);
/*
 * POST a video
 */
router.post("/", upload, postVideo);
/*
 * GET all details for a single video
 */
router.get("/:id", getSingleVideo);
/*
 * POST a comment for a single video
 */
router.post("/:id/comments", postComment);
/*
 * PUT (edit/increment) likes for a video
 */
router.put("/:id/likes", likeVideo);
/*
 * DELETE a comment for a given video
 */
router.delete("/:videoId/comments/:commentId", deleteComment);
module.exports = router;
