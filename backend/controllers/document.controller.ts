import { Request, Response } from "express";
import { createDoc } from "../models/document";

export const post = async (req: Request, res: Response) => {
  // const loggedinId = req.query.loggedinId;

  // if (!loggedinId) {
  //   res.status(401).send("No User");
  //   return;
  // }

  const { authorId, name } = req.body;

  // if (authorId !== loggedinId) {
  //   res.status(401).send("Unauthorized");
  //   return;
  // }

  await createDoc(authorId, name);

  res.status(201).send("Document create");
};
