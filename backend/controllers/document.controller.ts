import { Request, Response } from "express";
import { updateDoc } from "../models/document";

const post = async (req: Request, res: Response) => {
  const loggedinId = req.query.loggedinId;

  if (!loggedinId) {
    res.status(401).send("No User");
    return;
  }

  const { authorId, name, newName } = req.body;

  if (authorId !== loggedinId) {
    res.status(401).send("Unauthorized");
    return;
  }

  await updateDoc(authorId, name, newName);

  res.status(201).send("Document created");
};
