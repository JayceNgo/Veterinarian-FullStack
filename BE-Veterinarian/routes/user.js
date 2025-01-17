import express from "express";
import { UserController } from "../controllers/index.js";

const router = express.Router();

router.get("/find/:id", UserController.findUser);
router.post("/", UserController.createUser);
router.put("/update/:id", UserController.updateUser);

router.get("/users", UserController.findUsers);
router.get("/veterinarians", UserController.findVeterinarians);

router.delete("/delete/:id", UserController.deleteUser);
//router.get("/search-vet", UserController.searchVet);

export default router;
