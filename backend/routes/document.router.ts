import { Router } from "express";
import { post, update } from "../controllers/document.controller";

export const router = Router();

router.post("/", post);
router.put("/", update);
