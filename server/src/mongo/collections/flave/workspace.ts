import { mongoClient } from "lib/mongo";
import { ObjectId } from "mongodb";

type flvWorkspaceType = {
  name: string;
  owner: ObjectId;
  member: {
    user_id: ObjectId;
  }[];
};

export const flvWorkspaceCollection = mongoClient
  .db("flave")
  .collection<flvWorkspaceType>("workspace");
