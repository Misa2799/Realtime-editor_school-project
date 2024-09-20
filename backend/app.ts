import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import express, { Request, Response } from "express";
import morgan from "morgan";
import connectDB from "./db/connect";
import { authMiddleware } from "./middleware/authMiddleware";
import { router as documentRouter } from "./routes/document.router";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";


export const app = express();

//Socket io
export const server = createServer(app);
const io = new Server(server, { 
    cors: { 
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
    } 
});

io.on("connection", (socket) => {
    console.log("new user connected", socket.id);
	
	socket.on("send-changes", (delta) => {
        console.log("new text:", delta);
		socket.broadcast.emit("send-changes",delta);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

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
app.use(express.json());
app.use(morgan("dev"));
app.use(ClerkExpressWithAuth());
app.use(cors());

// routes
// this hello route is just a test route
app.get("/hello", authMiddleware, (req: Request, res: Response) => {
	res.send("Hello World");
});
app.use("/document", documentRouter);

app.all("*", (req: Request, res: Response) => {
	res.status(404).send({ error: `Not Found Route - ${req.method} ${req.path}` });
});
