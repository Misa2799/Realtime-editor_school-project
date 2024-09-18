import mongoose, { Schema } from "mongoose";

type SharedDocType = {
  id: Schema.Types.ObjectId;
  documentId: string;
  usersIdArr: string[];
  createdAt: Date;
  updatedAt: Date;
};

const sharedDocSchema = new Schema<SharedDocType>(
  {
    documentId: {
      type: String,
      required: true,
    },

    usersIdArr: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const SharedDoc = mongoose.model("SharedDoc", sharedDocSchema);
