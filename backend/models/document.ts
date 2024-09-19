import mongoose, { Schema } from "mongoose";
import { SharedDoc } from "./collaboration-sessions";

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
