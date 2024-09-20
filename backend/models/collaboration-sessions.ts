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
  const sharedDoc = await SharedDoc.findOne({ id: documentId });
  return sharedDoc;
};

export const clearSharedDoc = async (documentId: string) => {
  await SharedDoc.deleteOne({ id: documentId });
};

// export const create = (documentId: string, userId: string, usersIdArr: []) => {
//   SharedDoc.create({ documentId: documentId, usersIdArr: [userId] });
// };

/**
 * Update shared document
 * @param id documentId
 * @param userIds an array of user id
 */
export const updateSharedDoc = async (
  documentId: string,
  userIds: string[]
) => {
  // update a shared document
  // find a document that is shared based on documentId
  const sharedDoc = await findSharedDoc(documentId);

  // if there is no a document, create a shared document
  if (!sharedDoc) {
    SharedDoc.create({ documentId: documentId, usersIdArr: userIds });
  } else {
    // if there is a document and userId doesn't include in userIdArr, push userId to the array
    userIds.forEach(async (userId) => {
      if (!sharedDoc.usersIdArr.includes(userId)) {
        sharedDoc.usersIdArr.push(userId);
        await sharedDoc.save();
      }
    });
  }
};
