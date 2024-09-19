import { Request, Response } from "express";
import { DocumentModel, getDocs } from "../models/document";
import { User } from "../models/user";
import { updateSharedDoc } from "../models/collaboration-sessions";

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

  await DocumentModel.createDoc(authorId, name);

  res.status(201).send("Document created");
};

export const update = async (req: Request, res: Response) => {
  const { email, documentId, authorId, name, content } = req.body;

  // find user based on email
  const user = await User.findOne({ email });
  // if (!user) {
  //   res.status(404).send("User not found");
  // }

  const userId = user?.id;

  // update the document
  const updatedDoc = await DocumentModel.updateDoc(authorId, name, content, [
    userId,
  ]);

  // update the
  updateSharedDoc(documentId, userId, []);

  // send response
  res.status(201).send("Document updated");
};

export const clear = async (req: Request, res: Response) => {
  const { documentId } = req.body;

  await DocumentModel.deleteDoc(documentId);

  res.status(201).send("Document deleted");
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
};
