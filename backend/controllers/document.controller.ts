import { Request, Response } from "express";
import {
  clearSharedDoc,
  updateSharedDoc,
} from "../models/collaboration-sessions";
import { DocumentModel, getDocs } from "../models/document";
import { get as getFromModel } from "../models/user";

export const post = async (req: Request, res: Response) => {
  const { loggedInUserId } = req;

  if (!loggedInUserId) {
    res.status(401).send("No User");
    return;
  }

  const { name } = req.body;

  await DocumentModel.createDoc(loggedInUserId, name);

  res.status(201).send("Document created");
};

// when a shared btn and the edit btn is clicked, call the update method
export const update = async (req: Request, res: Response) => {
  const { id, name, content, sharedWith } = req.body;

  if (name || content) {
    // pattern1: id, name
    // pattern2: id, content
    // update only the document table
    const updatedDoc = await DocumentModel.updateDoc(id, name, content);
  } else {
    // pattern3: id, sharedWith
    // update the collaboration-sessions table

    // find user based on email
    let userIds: string[] = [];
    sharedWith.forEach(async (email: string) => {
      const user = await getFromModel(email);
      if (!user?.id) {
        res.status(404).send("User not found");
        return
      }
      userIds.push(user?.id);
    });

    // update the collaboration sessions table
    const updatedShareDoc = await updateSharedDoc(id, userIds);
  }

  // send response
  res.status(201).send("Document updated");
};

export const clear = async (req: Request, res: Response) => {
  const id = req.query.id as string;

  await DocumentModel.deleteDoc(id);
  await clearSharedDoc(id);

  res.status(201).send("Document deleted");
};

export const get = async (req: Request, res: Response) => {
  const { loggedInUserId } = req;

  if (!loggedInUserId) {
    res.status(401).send("No User");
    return;
  }

  const docs = await getDocs(loggedInUserId);

  res.status(200).send(docs);
};
