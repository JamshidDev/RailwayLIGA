import express from "express"
const router = express.Router();
import { tournamentController } from "../controllers/index.js"

router.post("/store", tournamentController.store);
router.get("/", tournamentController.index);
router.put("/update/:id", tournamentController.update);
router.delete("/delete/:id", tournamentController.remove);

export  const  tournamentRouter = router