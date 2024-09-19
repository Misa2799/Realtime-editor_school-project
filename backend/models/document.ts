import mongoose, { Schema } from "mongoose";
import { find } from "./collaboration-sessions";

type DocumentType = {
  id: Schema.Types.ObjectId;
  name: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

const documentSchema = new Schema<DocumentType>(
  {
    name: {
      type: String,
      required: true,
    },

    content: {
      type: String,
    },
    authorId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", documentSchema);

export const createDoc = async (authorId: string, name: string) => {
  const createdDoc = await Document.create({ authorId: authorId, name: name });
  return createdDoc;
};

export const getDocs = async (authorId: string) => {
  // search my documents
  const docs = await Document.find({ authorId: authorId });
  
  // search shared documents with authorId
  const sharedDocSessions = await find(authorId);
  const sharedDocsIds = sharedDocSessions.map((session) => session.documentId);

  // search document by sharedDocsIds
  const sharedDocs = await Document.find({ _id: { $in: sharedDocsIds } });

  // merge my documents and shared documents
  return docs.concat(sharedDocs);
}