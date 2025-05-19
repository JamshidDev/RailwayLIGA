
import express from "express"
const router = express.Router();
import {appController} from "../controllers/index.js"


router.post("/store", appController.upload,appController.uploadStore)

router.use(appController.uploadMiddleware)

export const appRouter = router