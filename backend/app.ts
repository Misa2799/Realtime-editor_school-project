import express, { Request, Response } from 'express';
import morgan from 'morgan';

export const app = express();

// middleware
app.use(express.json());
app.use(morgan("dev"));

// routes
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.all("*", (req: Request, res: Response) => {
    res.status(404).send({ error: `Not Found Route - ${req.method} ${req.path}` });
});
