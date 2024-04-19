import { flvWorkspaceCollection } from "mongo/collections/flave/workspace";
import { ObjectId } from "mongodb";

export const createWorkspace = async (name: string, owner: ObjectId) => {
  const result = await flvWorkspaceCollection.insertOne({
    name,
    owner,
    member: [],
  });

  if (result.acknowledged) {
    return result.insertedId;
  } else {
    return null;
  }
};
