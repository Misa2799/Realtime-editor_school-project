import { Router } from "express";
import { post, get, update, clear } from "../controllers/document.controller";

export const router = Router();

router.post("/", post);
router.get("/", get);
router.put("/", update);
router.delete("/", clear);
