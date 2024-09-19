import mongoose, { Document, Schema } from "mongoose";

type SharedDocType = {
  id: Schema.Types.ObjectId;
  documentId: Schema.Types.ObjectId;
  usersIdArr: string[];
  createdAt: Date;
  updatedAt: Date;
};

const sharedDocSchema = new Schema<SharedDocType>(
  {
    documentId: {
      type: String,
      required: true,
      ref: Document,
    },

    usersIdArr: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const SharedDoc = mongoose.model("SharedDoc", sharedDocSchema);
