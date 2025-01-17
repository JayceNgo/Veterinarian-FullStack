import express from "express";
import { MessageController } from "../controllers/index.js";

const router = express.Router();

router.get("/owners", MessageController.findOwnerDiscussions);
router.get("/veterinarians", MessageController.findVeterinarianDiscussions);

router.get("/find/:id", MessageController.findMessage);
router.post("/", MessageController.createMessage);
router.put("/update/:id", MessageController.updateMessage);
router.delete("/delete/:id", MessageController.deleteMessage);

export default router;
