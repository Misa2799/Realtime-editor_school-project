import { Request, Response } from "express";
import { createDoc, getDocs } from "../models/document";

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

export const get = async (req: Request, res: Response) => {
  // FIXME: uncomment this line after merging the PR that implemented auth with Clerk
  // const { loggedinId } = req.loggedInUserId;
  const loggedinId = "1";

  if (!loggedinId) {
    res.status(401).send("No User");
    return;
  }

  const docs = await getDocs(loggedinId);

  res.status(200).send(docs);
}