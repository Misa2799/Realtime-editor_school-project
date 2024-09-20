import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import express, { Request, Response } from "express";
import morgan from "morgan";
import connectDB from "./db/connect";
import { authMiddleware } from "./middleware/authMiddleware";
import { router as documentRouter } from "./routes/document.router";
import { router as userRouter } from "./routes/user.router";
import cors from "cors";

export const app = express();

// connect to MongoDB
const startDB = async () => {
	try {
		await connectDB();
	} catch (err) {
		console.error(err);
	}
};

startDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(ClerkExpressWithAuth());

// routes
// this hello route is just a test route
app.get("/hello", authMiddleware, (req: Request, res: Response) => {
	res.send("Hello World");
});
app.use("/document", documentRouter);
app.use("/user", userRouter);

app.all("*", (req: Request, res: Response) => {
	res.status(404).send({ error: `Not Found Route - ${req.method} ${req.path}` });
});
