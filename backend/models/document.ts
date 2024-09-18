import mongoose, { Schema } from "mongoose";

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
