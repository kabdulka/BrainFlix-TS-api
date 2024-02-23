"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const app = (0, express_1.default)();
const videoRoutes = require("./routes/videos");
require("dotenv").config();
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
/*
 * Middleware
 * CORS: allows sharing data with apps on others servers, cross origin
 * express.json(): allows access to incoming data posted to the server as part of the bady (req.body)
 */
app.use(express_1.default.static('public'));
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express_1.default.json());
app.use("/videos", videoRoutes);
app.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT}!`);
});
