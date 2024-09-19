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

export const find = async (authorId: string) => {
  const sharedDoc = await SharedDoc.find({ usersIdArr: authorId });
  return sharedDoc;
};

export const findSharedDoc = async (documentId: string) => {
  const sharedDoc = await SharedDoc.findOne({ documentId: documentId });
  return sharedDoc;
};

export const clear = async (documentId: string) => {
  await SharedDoc.deleteOne({ documentId: documentId });
};

export const create = (documentId: string, userId: string, usersIdArr: []) => {
  SharedDoc.create({ documentId: documentId, usersIdArr: [userId] });
};

export const updateSharedDoc = async (
  documentId: string,
  userId: string,
  usersIdArr: string[]
) => {
  // collaboration-session table
  // update or create sharedDoc (collaboration session)
  // if sharedDoc doesn't exist, create it
  const sharedDoc = await findSharedDoc(documentId);
  if (!sharedDoc) {
    create(documentId, userId, []);
  } else {
    // if it exists, add userId if there is not the userId
    // find the userId in usersIdArr (shouldn't find)
    // if no, push the userId to usersIdArr
    if (!sharedDoc.usersIdArr.includes(userId)) {
      sharedDoc.usersIdArr.push(userId);
      await sharedDoc.save();
    }
  }
};
