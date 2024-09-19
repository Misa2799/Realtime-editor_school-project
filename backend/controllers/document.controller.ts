import { Request, Response } from "express";
import { DocumentModel } from "../models/document";
import { User } from "../models/user";
import { SharedDoc } from "../models/collaboration-sessions";

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
  const { email, id, authorId, name, content } = req.body;

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

  // update or create sharedDoc (collaboration session)
  // if sharedDoc doesn't exist, create it
  const sharedDoc = await SharedDoc.findOne({ id });
  if (!sharedDoc) {
    SharedDoc.create({ id, usersIdArr: [userId] });
  } else {
    // if it exists, add userId if there is not the userId
    // find the userId in usersIdArr (shouldn't find)
    // if no, push the userId to usersIdArr
    if (!sharedDoc.usersIdArr.includes(userId)) {
      sharedDoc.usersIdArr.push(userId);
      await sharedDoc.save();
    }
  }

  // send response
  res.status(201).send("Document updated");
};

export const clear = async (req: Request, res: Response) => {
  const { id } = req.body;

  await DocumentModel.deleteDoc(id);

  // find an entity based on documentId
  const sharedDoc = await SharedDoc.findOne({ id });
  SharedDoc.deleteOne({ id });

  res.status(201).send("Document deleted");
};
