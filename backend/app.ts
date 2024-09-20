import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import cors from "cors";
import express, { Request, Response } from "express";
import { createServer } from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import connectDB from "./db/connect";
import { authMiddleware } from "./middleware/authMiddleware";
import { router as documentRouter } from "./routes/document.router";

export const app = express();

//Socket io
export const server = createServer(app);
const io = new Server(server, { 
    cors: { 
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"],
    } 
});

io.on("connection", (socket) => {
    console.log("new user connected", socket.id);

    socket.on("join-room", (documentId) => {
        console.log("joined room: ", documentId);
        socket.join(documentId);
    });
	
	socket.on("send-changes", (delta, id) => {
        console.log("new text:", delta);
        console.log("document id:", id);
		socket.broadcast.to(id).emit("send-changes",delta);
    });

    socket.on("send-selection-changes", (range, id) => {
        console.log("new selection:", range);
        console.log("document id:", id);
        socket.broadcast.to(id).emit("send-selection-changes", range);
    })

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
