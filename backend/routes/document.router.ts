import { Router } from "express";
import { post, get } from "../controllers/document.controller";

export const router = Router();

router.post("/", post);
router.get("/", get);