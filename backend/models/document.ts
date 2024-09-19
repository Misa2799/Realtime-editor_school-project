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

type GetDocumentResponse = {
  id: string;
  name: string;
  content: string;
  authorId: string;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const createDoc = async (authorId: string, name: string) => {
  const createdDoc = await Document.create({ authorId: authorId, name: name });
  return createdDoc;
};

const updateDoc = async (
  id: string,
  name: string,
  content: string,
  sharedWith: [string]
) => {
  const updatedDoc = await Document.findOneAndUpdate(
    { id: id },
    { name: name, content: content },
    { new: true }
  );

  if (!updatedDoc) {
    throw new Error("Document not found");
  }

  return updatedDoc;
};

const deleteDoc = async (id: string) => {
  await Document.deleteOne({ id });
};

export const DocumentModel = { createDoc, updateDoc, deleteDoc };

export const getDocs = async (authorId: string) => {
  let allDocs = <GetDocumentResponse[]>[];

  // search my documents and push to allDocs
  const docs = await Document.find({ authorId: authorId });
  docs.forEach((doc) => {
    const docObj = {
      id: doc.id,
      name: doc.name,
      content: doc.content,
      authorId: doc.authorId,
      isShared: false,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    allDocs.push(docObj);
  });

  // search shared documents with authorId
  const sharedDocSessions = await find(authorId);
  const sharedDocsIds = sharedDocSessions.map((session) => session.documentId);

  // search document by sharedDocsIds
  const sharedDocs = await Document.find({ _id: { $in: sharedDocsIds } });
  sharedDocs.forEach((doc) => {
    const docObj = {
      id: doc.id,
      name: doc.name,
      content: doc.content,
      authorId: doc.authorId,
      isShared: true,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    allDocs.push(docObj);
  });

  // merge my documents and shared documents
  return allDocs;
};
