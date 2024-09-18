import { Router } from "express";
import { post } from "../controllers/document.controller";

export const router = Router();

router.post("/document", post);
