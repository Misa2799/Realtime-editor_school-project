import { Router } from "express";
import { clear, get, post, update, getById } from "../controllers/document.controller";

export const router = Router();

router.post("/", post);
router.get("/", get);
router.get("/:id", getById)
router.put("/", update);
router.delete("/", clear);
