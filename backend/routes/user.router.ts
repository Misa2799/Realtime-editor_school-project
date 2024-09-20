import { Router } from "express";
import { getUser } from "../controllers/user.controller";

export const router = Router();

router.get("/", getUser);