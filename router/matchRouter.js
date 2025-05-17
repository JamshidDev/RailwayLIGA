import express from "express"
const router = express.Router();
import { matchController } from "../controllers/index.js"

router.post("/store", matchController.store);
router.get("/", matchController.index);
router.put("/update/:id", matchController.update);
router.delete("/delete/:id", matchController.remove);

export  const  matchRouter = router