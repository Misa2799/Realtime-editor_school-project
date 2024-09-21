import { Request, Response } from "express";
import { get as getFromModel } from "../models/user";

export const getUser = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await getFromModel(email);

    if (!user) {
        res.status(404).send("User not found");
        return
    }
    res.status(200).send(user);
}