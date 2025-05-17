import express from "express"
const router = express.Router();
import { teamController } from "../controllers/index.js"

router.post("/store", teamController.store);
router.get("/", teamController.index);
router.put("/update/:id", teamController.update);
router.delete("/delete/:id", teamController.remove);

export  const  teamRouter = router